import http from 'http'
import got from 'got'
import httpProxy from 'http-proxy'
import path from 'node:path'
import {createReadStream} from 'node:fs'
import {services} from './services.js'

const host = process.env.HOST || 'localhost'
const proxy = httpProxy.createProxyServer()

function requestManifest(url) {
  return got(url, {retry: {limit: 0}}).json()
}

async function isDevServer(service) {
  try {
    await requestManifest(`http://${host}:${service.port}${service.publicPath}manifest.json`)
    return true
  } catch (err) {
    return false
  }
}

function shouldRedirectToIndex(url) {
  return url.substring(url.lastIndexOf('/')).indexOf('.') < 0
}

function findServiceFromUrl(url) {
  const defaultService = services.find(service => service.publicPath === '/')
  return (
    services.find(service => service !== defaultService && url.startsWith(service.publicPath)) ||
    defaultService
  )
}

async function proxyUrlToService(service, url, req, res) {
  const redirectToIndex = shouldRedirectToIndex(url)
  const isDevServerRunning = await isDevServer(service)
  if (isDevServerRunning) {
    if (redirectToIndex) {
      got.stream(`http://${host}:${service.port}${service.publicPath}index.html`).pipe(res)
    } else {
      proxy.web(req, res, {target: `http://${host}:${service.port}`})
    }
  } else {
    if (redirectToIndex) {
      createReadStream(path.join(service.distFolder, 'index.html')).pipe(res)
    } else {
      service.staticHandler(req, res)
    }
  }
}

const server = http.createServer(async (req, res) => {
  const {url} = req

  console.log(url)

  const service = findServiceFromUrl(url)
  if (!service) {
    res.statusCode = 404
    res.end()
    return
  }

  await proxyUrlToService(service, url, req, res)
})

server.listen(process.env.HTTP_PORT)
