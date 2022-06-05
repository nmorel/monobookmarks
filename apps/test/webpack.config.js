const webpackConfig = require('@nimo/config-webpack/web')
module.exports = webpackConfig({
  baseDir: __dirname,
  name: 'test',
  port: 8080,
  publicPath: '/',
})
