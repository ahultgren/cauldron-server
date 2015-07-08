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
    console.log('Connection');
    //## Authorize headers, set socket.player

    var client = Client.create(socket);

    // Join first available game
    var game = games.joinFullest(client);
    client.send('game/joined', game.rules);

    // Route messages
    socket.on('message', message => this.receiveMessage(client, JSON.parse(message)));

    // Clean up
    socket.on('close', () => game.leave(client));
  }

  receiveMessage (client, {type, data}) {
    var playerId = client.player_id;
    var gameId;

    switch (type) {
      case 'player/update':
        client.game.updatePlayer(playerId, data);
        break;
    }
  }

}

module.exports = SocketRouter;
