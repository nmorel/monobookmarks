const http = require('http')
const serveHandler = require('serve-handler')
const {request} = require('undici')
const httpProxy = require('http-proxy')

const host = process.env.HOST || 'localhost'

function packageToDist(package) {
  return require.resolve(`@nimo/${package}/package.json`).replace('package.json', 'dist')
}

//
// Create a proxy server with custom application logic
//
const proxy = httpProxy.createProxyServer()
const services = {
  bookmarks: {
    port: 3000,
    publicPath: '/',
    staticHandler: (req, res) =>
      serveHandler(req, res, {
        public: packageToDist('bookmarks'),
      }),
  },
  youtube: {
    port: 3001,
    publicPath: '/static/youtube/',
    staticHandler: (req, res) =>
      serveHandler(req, res, {
        public: packageToDist('youtube'),
        rewrites: [
          {
            source: '/static/youtube/:rest',
            destination: '/:rest',
          },
        ],
      }),
  },
}

async function requestManifest(url) {
  const {body} = await request(url)
  return body.json()
}

async function isDevServer(service) {
  try {
    await requestManifest(
      `http://${host}:${services[service].port}${services[service].publicPath}manifest.json`
    )
    return true
  } catch (err) {
    return false
  }
}

// function shouldRedirectToIndex(url) {
//   return !/\/.*\.(js|css|html|json|ico)$/.test(url)
// }

function isUrlToService(service, url) {
  return url.startsWith(services[service].publicPath)
}

async function proxyUrlToService(service, url, req, res) {
  //   use rewrites ? https://github.com/vercel/serve-handler#rewrites-array
  //   const redirectToIndex = shouldRedirectToIndex(url)
  //   if (redirectToIndex) {
  //     // redirect to index
  //     services[service].staticHandler(req, res)
  //     return
  //   }

  const isDevServerRunning = await isDevServer(service)
  if (isDevServerRunning) {
    proxy.web(req, res, {target: `http://${host}:${services[service].port}`})
  } else {
    services[service].staticHandler(req, res)
  }
}

//
// Create your custom server and just call `proxy.web()` to proxy
// a web request to the target passed in the options
// also you can use `proxy.ws()` to proxy a websockets request
//
const server = http.createServer(async (req, res) => {
  const {url} = req

  console.log(url)

  if (isUrlToService('youtube', url)) {
    await proxyUrlToService('youtube', url, req, res)
  } else {
    await proxyUrlToService('bookmarks', url, req, res)
  }
})

server.listen(process.env.HTTP_PORT)
