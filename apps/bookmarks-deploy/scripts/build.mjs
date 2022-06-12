import path from 'node:path'
import fs from 'node:fs/promises'
import {createRequire} from 'module'
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const require = createRequire(import.meta.url)

const distFolder = path.join(__dirname, '../dist')
await $`mkdir -p ${distFolder}`
await $`rm -rf ${distFolder}/*`

const packageJson = JSON.parse(await fs.readFile(path.join(__dirname, '../package.json'), 'utf8'))

await Promise.all(
  Object.keys(packageJson.dependencies)
    .map(key => require.resolve(`${key}/dist/manifest.json`))
    .map(async manifestJsonPath => {
      const manifest = require(manifestJsonPath)
      const publicPath = manifest['main.js'].substring(0, manifest['main.js'].indexOf('/main'))
      const folder = path.join(distFolder, publicPath)
      await $`mkdir -p ${folder}`

      const folderToCopy = manifestJsonPath.slice(0, -'/manifest.json'.length)
      await $`cp ${folderToCopy}/* ${folder}`
    })
)
