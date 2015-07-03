'use strict';

var http = require('http');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
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

  app.use(cors({
    origin: true,
    methods: 'GET,POST,HEAD,PUT,DELETE',
    credentials: true,
    maxAge: 1800
  }));
  app.use(bodyParser.json());
  app.use((req, res, next) => {
    var auth = req.header('Authorization');

    if(auth) {
      var [, username, token] = auth.match(/^Cauldron ([^=]+)=(.+)$/) || [];
      //## Verify token
      req.user = username;
    }

    next();
  });
  app.use(routes);

  server.listen(config.get('PORT'), () =>
    console.log(`Listening on ${config.get('PORT')}`));

  return app;
};
