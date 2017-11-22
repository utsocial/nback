const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ENV = process.env.NODE_ENV || 'development'
const isProd = ENV === 'production'
const isStaging = ENV === 'staging'
const isDev = ENV === 'development'
const isE2e = ENV === 'e2e'
const WebpackErrorNotificationPlugin = require('webpack-error-notification')
const FB_ID = (() => {
  if (isProd) return '962957950472632'
  if (isStaging) return '724784051023090'
  if (isDev) return '329879750722396'
})()

module.exports = {
  cache: !isProd,
  devtool: isProd ? '#eval' : '#cheap-module-eval-source-map',
  context: path.join(__dirname, 'web'),
  entry: (function () {
    const entries = []
    if (isDev) {
      entries.push(
        'react-hot-loader/patch',
        // activate HMR for React

        'webpack-dev-server/client?http://localhost:8080',
        // bundle the client for webpack-dev-server
        // and connect to the provided endpoint

        'webpack/hot/only-dev-server'
        // bundle the client for hot reloading
        // only- means to only hot reload for successful updates
      )
    }
    return entries.concat('./index.js')
  })(),
  output: {
    path: path.join(__dirname, 'web-dist'),
    filename: '[name].[hash].js',
    publicPath: '/',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [/web/, /shared/],
        use: {
          loader: 'babel-loader',
          options: {
            extends: path.join(__dirname, '.babelrc-web'),
          },
        },
      },
      {
        test: /\.html$/,
        use: 'file-loader?name=[name].[ext]',
      },
      {
        test: /\.css$/,
        include: /web/,
        use: [
          'style-loader',
          'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'postcss-loader',
        ],
      },
      {
        test: /\.css$/,
        exclude: /web/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(png|jpg|wav)$/,
        use: 'file-loader',
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?limit=10000&mimetype=application/font-woff',
      },
      {
        test: /\.(woff(2)|ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'file-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    unsafeCache: true,
  },
  plugins: (function () {
    const plugins = [
      new HtmlWebpackPlugin({
        template: 'index.ejs',
      }),
      new WebpackErrorNotificationPlugin(),
      new webpack.DefinePlugin({
        FB_ID: JSON.stringify(FB_ID),
        __DEV__: JSON.stringify(!isProd),
        'process.env': {
          IS_WEB: JSON.stringify(true),
          NODE_ENV: JSON.stringify(ENV),
        },
      }),
    ]

    if (isDev || isE2e) {
      plugins.push(new webpack.HotModuleReplacementPlugin())// enable HMR globally
      plugins.push(new webpack.NamedModulesPlugin()) // prints more readable module names in the browser console on HMR updates)
    }

    if (!isDev) {
      plugins.push(new CopyWebpackPlugin([
        { from: './android*', to: './' },
        { from: './apple-touch-icon.png', to: './' },
        { from: './browserconfig.xml', to: './' },
        { from: './favicon*', to: './' },
        { from: './manifest.json', to: './' },
        { from: './mstile-150x150.png', to: './' },
        { from: './safari-pinned-tab.svg', to: './' },
      ]))
    }

    if (isProd) {
      plugins.push(new webpack.optimize.OccurrenceOrderPlugin(false))
      plugins.push(new webpack.optimize.UglifyJsPlugin({
        screwIe8: true,
        compress: {
          warnings: false,
        },
        output: {
          comments: false,
        },
      }))
    }

    return plugins
  }()),
  devServer: {
    contentBase: path.resolve(__dirname, 'web'),
    hot: isDev,
    publicPath: '/',
    historyApiFallback: true,
  },
}
