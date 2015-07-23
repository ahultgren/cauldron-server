'use strict';

var playerFactory = require('cauldron-core/app/factories/player');

class Client {

  static create (socket) {
    return new Client(socket);
  }

  constructor (socket) {
    this.player = playerFactory();
    this.player_id = this.player.id;
    this.socket = socket;
    this.game = null;

    socket.on('message', message => this.receiveMessage(JSON.parse(message)));
    socket.on('close', () => this.game.leave(this));
  }

  send (type, message = {}) {
    if(this.socket.readyState === this.socket.OPEN) {
      this.socket.send(JSON.stringify({type, message}));
    }
  }

  joinGame (game) {
    this.game = game;
    this.send('game/joined', {
      rules: game.rules,
      player: this.player.serialize(),
    });
  }

  receiveMessage ({type, data}) {
    var playerId = this.player_id;

    switch (type) {
      case 'player/update':
        this.update(data);
        break;
      case 'player/spawn':
        this.game.spawn(playerId, data);
        break;
    }
  }

  update (data) {
    this.player.setComponents(data);
  }

}

module.exports = Client;
