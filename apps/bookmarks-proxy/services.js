import fs from 'node:fs/promises'
import path from 'node:path'
import {__dirname} from './dirname.js'
import serveHandler from 'serve-handler'

const headers = [
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

const appsFolder = path.join(__dirname, '..')
const files = await fs.readdir(appsFolder)
export const services = (
  await Promise.all(
    files.map(file =>
      import(path.join(appsFolder, file, 'webpack.config.js'))
        .then(({default: config}) => {
          const distFolder = path.join(appsFolder, file, 'dist')
          return {
            name: file,
            publicPath: config.output.publicPath,
            distFolder,
            port: config.devServer.port,
            staticHandler: (req, res) =>
              serveHandler(req, res, {
                headers,
                public: distFolder,
                rewrites: [
                  {
                    source: `${config.output.publicPath}:rest`,
                    destination: '/:rest',
                  },
                ],
              }),
          }
        })
        .catch(() => false)
    )
  )
).filter(Boolean)
