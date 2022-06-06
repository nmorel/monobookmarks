const webpackConfig = require('@nimo/config-webpack/web')

module.exports = webpackConfig({
  baseDir: __dirname,
  name: 'youtube',
  port: 3001,
  exposes: {
    './Card': './src/components/Card',
  },
})
