import css from '@parcel/css'
import browserslist from 'browserslist'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const distFolder = path.join(__dirname, '../dist')
await $`mkdir -p ${distFolder}`
await $`rm -rf ${distFolder}/*`

const targets = css.browserslistToTargets(browserslist('extends @nimo/browserslist-config'))

// Generate css bundle
const {code} = css.bundle({
  filename: path.join(__dirname, '../src/index.css'),
  minify: true,
  targets,
})

// Compute hash of the css content
const hashSum = crypto.createHash('md4')
hashSum.update(code)
const contentHash = hashSum.digest('hex')

const filename = `main-${contentHash}.css`

await Promise.all([
  // Write css file using the hash
  fs.writeFile(path.join(distFolder, filename), code, 'utf-8'),
  // Writing a manifest
  fs.writeFile(
    path.join(distFolder, 'manifest.json'),
    JSON.stringify({'main.css': `/${filename}`})
  ),
])
