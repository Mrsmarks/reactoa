var HtmlWebpackPlugin = require('html-webpack-plugin');

var entry = {}
var plugins = []
var entrys = [
    'wechat',
    'wechatWall',
    'activity',
    'card',
    'park',
    'system',
    'ytcard',
    'integral',
    'teacher',
    'cardVoucher'
]
entrys.forEach(function(item) {
    entry[item] = createEntry(item)
    plugins.push(createPlugins(item))
})

function createEntry(entry) {
    return ['webpack-hot-middleware/client', './src/'+ entry +'/index']
}

function createPlugins(entry) {
    return new HtmlWebpackPlugin({
        filename: entry + '.html',
        template: 'index.template.html',
        vendorPath: '/vendor.dll.js',
        chunks: [entry]
    })
}

module.exports = {
    entry: entry,
    plugins: plugins
}