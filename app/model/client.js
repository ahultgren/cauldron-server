'use strict';

var playerFactory = require('cauldron-core/app/factories/player');
var map = require('cauldron-core/app/utils/map');
var maps = require('cauldron-core/app/maps');

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
    this.setSpawnPosition(this.player, game.rules.map);
    this.send('game/joined', {
      rules: game.rules,
      player: this.player.serialize(),
    });
    this.send('game/updates', map(entity => entity.serialize(), game.simulation.entities));
  }

  setSpawnPosition (player, mapName) {
    var mapData = maps[mapName];
    var [x, y] = mapData.spawnPoints[~~(mapData.spawnPoints.length * Math.random())];
    var position = player.getComponent('position');

    position.x = x;
    position.y = y;
  }

  receiveMessage ({type, data}) {
    var playerId = this.player_id;

    switch (type) {
      case 'player/update':
        this.onUpdate(data);
        break;
      case 'player/spawn':
        this.game.spawn(playerId, data);
        break;
    }
  }

  onUpdate ({position, physics}) {
    // Only accept position and physics updates from player
    this.player.setComponents({position, physics});
  }

}

module.exports = Client;
