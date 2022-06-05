const css = require('@parcel/css')
const path = require('node:path')
const fs = require('node:fs/promises')
const crypto = require('node:crypto')
const browserslist = require('browserslist')

async function build() {
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

  const distFolder = path.join(__dirname, '..', 'dist')
  const filename = `main-${contentHash}.css`

  // Create dist folder if necessary
  try {
    await fs.mkdir(distFolder)
  } catch (err) {
    // ignore err
  }

  await Promise.all([
    // Write css file using the hash
    fs.writeFile(path.join(distFolder, filename), code, 'utf-8'),
    // Writing a manifest
    fs.writeFile(path.join(distFolder, 'manifest.json'), `{"main.css": "${filename}"}`),
  ])
}

build()
