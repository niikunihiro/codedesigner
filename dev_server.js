"use strict";

var
  express = require('express'),
  bodyparser = require('body-parser'),
  Webpack = require('webpack'),
  WebpackDevServer = require('webpack-dev-server'),
  WebpackConfig = require('./webpack.config'),
  fs = require('fs')
  ;

var compiler = Webpack(WebpackConfig);
var server = new WebpackDevServer(compiler, {
  contentBase: "/public",
  stats: {colors: true},
  hot: true,
  historyApiFallback: true,
  setup: function(app) {
    app.use(function (req, res, next) {
      console.log('Using middleware for ' + req.url);
      next();
    });
    app.use(/\/.+\/[\da-z]{8}_([\da-z]{4}_){3}[\da-z]{12}/, express.static("public/index.html"));
    app.use(express.static("public"));
    app.use(bodyparser.json());
    app.get('/download', function (req, res) {
      var json = JSON.stringify(req.query);
      var filename = req.query.title + '.json';
      res.set('Content-disposition', 'attachment; filename=' + filename);
      res.set('Content-Type', 'application/json');
      res.send(json).end();
    })

  },
  publicPath: '/assets/bundle/'
});

server.listen(8080, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
  }
  console.log('Starting server on http://localhost:8080');
});
