'use strict';

var uuid = require('uuid');

class Client {

  static create (socket) {
    return new Client(socket);
  }

  constructor (socket) {
    this.player_id = uuid.v4();
    this.socket = socket;
    this.game = null;

    socket.on('message', message => this.receiveMessage(JSON.parse(message)));
    socket.on('close', () => this.game.leave(this));

    this.send('game/joined', this.game.rules);
  }

  send (type, message = {}) {
    if(this.socket.readyState === this.socket.OPEN) {
      this.socket.send(JSON.stringify({type, message}));
    }
  }

  joinGame (game) {
    this.game = game;
  }

  receiveMessage ({type, data}) {
    var playerId = this.player_id;

    switch (type) {
      case 'player/update':
        this.game.updatePlayer(playerId, data);
        break;
      case 'player/spawn':
        this.game.spawn(playerId, data);
        break;
    }
  }

}

module.exports = Client;
