var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
  	lib: [
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

  		// 'antd/lib/breadcrumb',
    //     'antd/lib/button',
    //     'antd/lib/calendar',
    //     'antd/lib/card',
    //     'antd/lib/cascader',
    //     'antd/lib/checkbox',
    //     'antd/lib/col',
    //     'antd/lib/date-picker',
    //     'antd/lib/dropdown',
    //     'antd/lib/form',
    //     'antd/lib/icon',
    //     'antd/lib/input',
    //     'antd/lib/input-number',
    //     'antd/lib/menu',
    //     'antd/lib/message',
    //     'antd/lib/modal',
    //     'antd/lib/pagination',
    //     'antd/lib/popconfirm',
    //     'antd/lib/popover',
    //     'antd/lib/radio',
    //     'antd/lib/row',
    //     'antd/lib/select',
    //     'antd/lib/slider',
    //     'antd/lib/spin',
    //     'antd/lib/switch',
    //     'antd/lib/table',
    //     'antd/lib/tabs',
    //     'antd/lib/tag',
    //     'antd/lib/time-picker',
    //     'antd/lib/tooltip',
    //     'antd/lib/tree',
    //     'antd/lib/upload'
  	]
  },
  output: {
    filename: '[name].[hash:8].js',
    path: path.join(__dirname, 'dist/html/js/'),
    library: '[name]_library'
  },
  plugins: [
  	new webpack.DefinePlugin({
		'process.env': {
			'NODE_ENV': JSON.stringify('production')
		},
		'__DEVTOOLS__': false
	}), 
   	new webpack.optimize.UglifyJsPlugin({
		compressor: {
			warnings: false
		},
		sourceMap: false
	}), 
    new webpack.DllPlugin({
    	path: path.join(__dirname, 'dist/html/js/', '[name]-manifest.json'),
    	name: '[name]_library',
        context: __dirname
    })
   
  ]
}
