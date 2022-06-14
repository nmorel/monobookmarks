import http from 'http'
import serveHandler from 'serve-handler'
import got from 'got'
import httpProxy from 'http-proxy'
import fs from 'node:fs'
import path from 'node:path'
import {createRequire} from 'module'

const require = createRequire(import.meta.url)
const host = process.env.HOST || 'localhost'

function packageToDist(pkg) {
  return require.resolve(`@nimo/${pkg}/package.json`).replace('package.json', 'dist')
}

const cacheHeaders = [
  {
    source: '**/*',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, max-age=31536000',
      },
    ],
  },
  {
    source: '/',
    headers: [
      {
        key: 'Cache-Control',
        value: 'no-store, max-age=0',
      },
    ],
  },
  {
    source: '/index.html',
    headers: [
      {
        key: 'Cache-Control',
        value: 'no-store, max-age=0',
      },
    ],
  },
  {
    source: '/remoteEntry.js',
    headers: [
      {
        key: 'Cache-Control',
        value: 'no-store, max-age=0',
      },
    ],
  },
]

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
        headers: cacheHeaders,
        public: packageToDist('bookmarks'),
      }),
  },
  youtube: {
    port: 3001,
    publicPath: '/static/youtube/',
    staticHandler: (req, res) =>
      serveHandler(req, res, {
        headers: cacheHeaders,
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

function requestManifest(url) {
  return got(url, {retry: {limit: 0}}).json()
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

function shouldRedirectToIndex(url) {
  return url.substring(url.lastIndexOf('/')).indexOf('.') < 0
}

function isUrlToService(service, url) {
  return url.startsWith(services[service].publicPath)
}

async function proxyUrlToService(service, url, req, res) {
  const redirectToIndex = shouldRedirectToIndex(url)
  const isDevServerRunning = await isDevServer(service)
  if (isDevServerRunning) {
    if (redirectToIndex) {
      got
        .stream(`http://${host}:${services[service].port}${services[service].publicPath}index.html`)
        .pipe(res)
    } else {
      proxy.web(req, res, {target: `http://${host}:${services[service].port}`})
    }
  } else {
    if (redirectToIndex) {
      fs.createReadStream(path.join(packageToDist(service), 'index.html')).pipe(res)
    } else {
      services[service].staticHandler(req, res)
    }
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
