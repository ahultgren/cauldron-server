'use strict';

var WSS = require('ws').Server;
var games = require('../services/gameService');
var Client = require('../model/client');

class SocketRouter {
  static create (server) {
    return new SocketRouter(server);
  }

  constructor (server) {
    this.wss = new WSS({server});

    this.wss.on('connection', socket => this.connection(socket));
  }

  connection (socket) {
    // [TODO] Authorize headers, get player session?

    // Join first available game
    games.joinFullest(Client.create(socket));
  }

}

module.exports = SocketRouter;
