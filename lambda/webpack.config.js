const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const plugins = process.env.PROD ? [new UglifyJSPlugin()] : []

const config = {
  target: 'node',
  entry: './index',
  context: path.resolve(__dirname),
  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'build'),
    libraryTarget: 'commonjs2'
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        use: [{
          loader: 'awesome-typescript-loader',
          options: { configFileName: path.resolve(__dirname, 'tsconfig.json') }
        }]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  plugins
}

module.exports = config
