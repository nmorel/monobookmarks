const webpackConfig = require('@nimo/config-webpack/web')

module.exports = webpackConfig({
  baseDir: __dirname,
  name: 'bookmarks',
  port: 8090,
  publicPath: '/',
})
