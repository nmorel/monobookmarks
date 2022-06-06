const webpack = require('webpack')
const ModuleFederationPlugin = webpack.container.ModuleFederationPlugin
const TerserPlugin = require('terser-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const {WebpackManifestPlugin} = require('webpack-manifest-plugin')
const sharedLibs = require('@nimo/mf-shared-libs')
const path = require('node:path')
const fs = require('node:fs')
const {capitalCase, snakeCase, paramCase} = require('change-case')

const isProd = process.env.NODE_ENV === 'production'
const isFastRefreshEnabled = process.env.FAST_REFRESH === 'true'

module.exports = ({baseDir, name, publicPath, port, exposes, remotes} = {}) => {
  if (!baseDir) throw new Error(`'baseDir' is required`)
  if (!name) throw new Error(`'name' is required`)
  if (!port) throw new Error(`'port' is required`)

  const capitalName = capitalCase(name)
  const snakeName = snakeCase(name)
  const paramName = paramCase(name)

  publicPath ??= `/static/${paramName}/`

  const outputPath = path.resolve(baseDir, 'dist')
  const globalCssFolder = require
    .resolve(`@nimo/ui-global-css/dist/manifest.json`)
    .replace('manifest.json', '')

  return {
    entry: ['./src/index'],
    output: {
      filename: `[name]-[contenthash].js`,
      path: outputPath,
      publicPath,
      clean: true,
    },
    experiments: {
      topLevelAwait: true,
    },
    optimization: {
      minimize: isProd,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: 2018,
          },
        }),
      ],
    },
    devtool: isProd ? false : 'eval',
    devServer: {
      host: '0.0.0.0',
      liveReload: !isFastRefreshEnabled,
      hot: isFastRefreshEnabled,
      port,
      allowedHosts: 'all',
      static: ['public'],
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
    },
    mode: isProd ? 'production' : 'development',
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules\/(?!(@kop\/.*\/src)\/).*/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                configFile: false,
                targets: {
                  esmodules: true,
                },
                assumptions: {
                  setPublicClassFields: true,
                },
                plugins: [...(isFastRefreshEnabled ? ['react-refresh/babel'] : [])],
                presets: [
                  ['@babel/preset-env', {modules: false}],
                  ['@babel/preset-react', {runtime: 'automatic'}],
                  ['@babel/preset-typescript'],
                ],
              },
            },
          ],
        },
      ],
    },

    plugins: [
      new ModuleFederationPlugin({
        name: snakeName,
        filename: 'remoteEntry.js',
        remotes: remotes?.length
          ? remotes.reduce((acc, remoteName) => {
              acc[snakeCase(remoteName)] = `${snakeCase(remoteName)}@/static/${paramCase(
                remoteName
              )}/remoteEntry.js`
              return acc
            }, {})
          : undefined,
        exposes,
        shared: [sharedLibs],
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.join(globalCssFolder, '*.css'),
            to: ({absoluteFilename}) => {
              return path.join(
                outputPath,
                absoluteFilename.substring(absoluteFilename.lastIndexOf('/'))
              )
            },
          },
        ],
      }),
      new HtmlWebpackPlugin({
        templateContent: () => {
          const cssFiles = fs
            .readdirSync(globalCssFolder)
            .filter(filename => filename.endsWith('.css'))
          return `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8" />
                <title>${capitalName}</title>
                ${cssFiles
                  .map(
                    filename =>
                      `<link href="${path.join(publicPath, filename)}" rel="stylesheet" />`
                  )
                  .join('')}
              </head>
              <body>
                <div id="root"></div>
              </body>
            </html>
          `
        },
      }),
      new WebpackManifestPlugin({
        filter: file => file.isInitial || file.isAsset,
      }),
      ...(isFastRefreshEnabled ? [new ReactRefreshWebpackPlugin()] : []),
    ],

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      symlinks: true,
    },
  }
}
