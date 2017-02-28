var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var moduleConfig = require('./module.config')
var plugins = [].concat.apply([
    new webpack.optimize.OccurenceOrderPlugin(), 
    new webpack.NoErrorsPlugin(),
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
    new ExtractTextPlugin('/html/css/app.[hash:8].css', {
        allChunks: true
    }),
    new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('./dist/html/js/lib-manifest.json')
    })
], moduleConfig.plugins)
module.exports = {
	entry: moduleConfig.entry,
	output: {
		filename: '/html/js/[name].[hash:8].js',
		chunkFilename: '/html/js/[name].[chunkhash:8].js',
		path: path.join(__dirname, 'dist'),
		publicPath: ''
	},
	plugins: plugins,
	module: {
		loaders: [
		{
			test: /\.css$/,
			loader: ExtractTextPlugin.extract('style', 'css')
		},
		{
			test: /\.scss$/,
			loader: ExtractTextPlugin.extract('style', 'css?modules&localIdentName=[hash:base64:5]!sass-loader')
		},
		{
			test: /\.js$/,
			loaders: ['babel'],
			include: path.join(__dirname, 'src')
		},{
			test: /\.(png|jpg|gif|svg|woff2|woff|eot|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
			loader: 'url-loader?limit=12192&name=/html/img/[name].[hash:5].[ext]'
		}]
	},
	resolve: {
        alias: {
            iconFont: path.join(__dirname, 'src') + '/components/common/iconFont.js',
            safeString: path.join(__dirname, 'src') + '/Application/utils/safeConvertToString.js'
        },
        root: [
            path.resolve(__dirname, 'src'),
            // path.resolve(__dirname, 'src/application/views/common'),
        ]
    },
	cssnext: {
		browsers: 'last 2 versions'
	}
};