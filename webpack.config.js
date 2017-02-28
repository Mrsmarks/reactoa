var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var moduleConfig = require('./module.config')
var plugins = [].concat.apply([
    new webpack.HotModuleReplacementPlugin(), 
    new webpack.NoErrorsPlugin(), 
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('development')
        }
    }),
    new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('./dist/vendor-manifest.json')
    })
], moduleConfig.plugins)

module.exports = {
	// devtool: '#inline-eval-cheap-source-map',
	devtool: '#cheap-module-eval-source-map',
	// devtool: 'eval',
	entry: moduleConfig.entry,
	output: {
		filename: '[name].js',
		chunkFilename: '[name].chunk.js',
		path: path.join(__dirname, 'dist'),
		publicPath: '/'
	},
	plugins: plugins,
	module: {
		loaders: [
			{
				test: /\.css$/,
				loader: 'style!css'
			},
			{
				test: /\.scss$/,
				loader: 'style!css?modules&localIdentName=[local]-[hash:base64:5]!sass?sourceMap=true'
			},
			{
				test: /\.js$/,
				loader: 'babel',
				include: path.join(__dirname, 'src')
			},
			{
				test: /\.(png|jpg|gif|svg|woff2|woff|eot|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'url-loader?limit=12192'
			}
		]
	},
	resolve: {
		alias: {
			iconFont: path.join(__dirname, 'src') + '/components/common/iconFont.js',
            safeString: path.join(__dirname, 'src') + '/Application/utils/safeConvertToString.js',
		},
        root: [
            path.resolve(__dirname, 'src'),
            // path.resolve(__dirname, 'src/application/views/common'),
        ]
	},
	cssnext: {
		browsers: 'last 2 versions'
	}
}
