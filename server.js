// var router = require('koa-router')()
// var routers = require('./routers')
// var app = require('koa')()
// var serve = require('koa-static') 

// var webpackDevMiddleware = require('koa-webpack-dev-middleware');
// var webpack = require('webpack');
// var config = require('./webpack.config');
// var http = require('http')
// var path = require('path');

// var compiler = webpack(config);

// routers(router, app)
// app.use(router.routes())

// app.use(webpackDevMiddleware(compiler, {
//     publicPath: config.output.publicPath,
//     noInfo: true,
//     hot: true,
//     stats: {
//         colors: true
//     }
// }));
// app.use(serve(__dirname + '/dist'))

// app.use(require('koa-webpack-hot-middleware')(compiler));

// app = http.createServer(app.callback())
// app.listen(3999, 'localhost', function(){
// 	console.log('app listen success at port -> 3999.')
// })
// 

var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config');

var app = express();
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  hot: true
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(express.static(__dirname + "/dist"));

app.get('*', function (req, res) {
  console.log(req.url);
  // res.sendFile(path.join(__dirname, './dist/wechat.html'));
});

app.listen(9999, 'localhost', function (err) {
  if (err) {
    console.error(err);
    return;
  }

  console.log('Listening at http://localhost:9999');
});