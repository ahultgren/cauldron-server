'use strict';

var http = require('http');
var express = require('express');
var WSS = require('ws').Server;
var config = require('../config');
var routes = require('./routes');

exports.start = () => {
  var app = express();
  var server = http.createServer(app);
  var wss = new WSS({server});

  wss.on('connection', (socket) => {
    console.log('Connection', socket);
  });

  app.use(routes);

  server.listen(config.get('PORT'), () =>
    console.log(`Listening on ${config.get('PORT')}`));

  return app;
};
