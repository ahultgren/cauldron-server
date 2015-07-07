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
  }

  send (type, message = {}) {
    if(this.socket.readyState === this.socket.OPEN) {
      this.socket.send(JSON.stringify({type, message}));
    }
  }

  joinGame (game) {
    this.game = game;
  }

}

module.exports = Client;
