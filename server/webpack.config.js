const path = require('path')
const nodeExternals = require('webpack-node-externals')

const config = {
  target: 'node',
  entry: './index',
  context: path.resolve(__dirname),
  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'build')
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        use: [{
          loader: 'awesome-typescript-loader',
          options: { configFileName: path.resolve(__dirname, 'tsconfig.json') }
        }]
      },
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, '..', 'client', 'src'),
        loader: require.resolve('babel-loader'),
        options: {
          babelrc: false,
          presets: [require.resolve('babel-preset-react-app')]
        }
      },
      { test: /(\.md|\.map)$/, loader: 'null-loader' },
      { test: /\.json$/, loader: 'json-loader' }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  }
}

config.externals = [nodeExternals()]

module.exports = config
