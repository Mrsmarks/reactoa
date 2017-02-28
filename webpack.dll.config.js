var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
  	vendor: [
  		'react',
  		'react-dom',
  		'redux',
  		'redux-thunk',
  		'react-redux',
  		'babel-polyfill',
  		'immutable',
  		'axios',
  		'classnames',
  		'antd'
  	]
  },
  output: {
    filename: '[name].dll.js',
    path: path.join(__dirname, 'dist'),
    library: '[name]_library'
  },
  plugins: [
   
    new webpack.DllPlugin({
    	path: path.join(__dirname, 'dist', '[name]-manifest.json'),
    	name: '[name]_library',
        context: __dirname
    })
   
  ]
}
