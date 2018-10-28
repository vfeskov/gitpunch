const path = require('path')
const nodeExternals = require('webpack-node-externals')
const { DefinePlugin } = require('webpack')
const isProd = process.env.NODE_ENV === 'production'
const config = {
  devtool: isProd ? 'source-map' : 'eval',
  mode: isProd ? 'production' : 'development',
  target: 'node',
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, '..', 'client', 'src'),
        loader: require.resolve('babel-loader'),
        options: {
          babelrc: false,
          presets: [require.resolve('babel-preset-react-app')]
        }
      },
      {
        loader: require.resolve('file-loader'),
        exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    ]
  },
  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  resolve: {
    extensions: ['.js', '.json']
  }
}

config.externals = [nodeExternals()]

module.exports = config
