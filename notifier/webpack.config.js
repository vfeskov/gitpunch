const path = require('path')
const nodeExternals = require('webpack-node-externals')

const config = {
  target: 'node',
  entry: './index',
  context: path.resolve(__dirname, 'src'),
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
    extensions: ['.ts']
  },
  externals: [nodeExternals()]
}

module.exports = config
