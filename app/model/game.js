'use strict';

var uuid = require('uuid');
var R = require('ramda');
var games = require('../services/gameService');

class Game {

  static create (client, rules = {map: 'one'}) {
    return new Game(client, rules);
  }

  constructor (client, rules) {
    this.game_id = uuid.v4();
    this.players = [];
    this.maxPlayers = 8;
    this.owner = client;
    this.state = 'started';
    this.started_at = new Date();
    this.rules = rules;
  }

  broadcast (type, message, ignore) {
    this.players.forEach((client) => {
      if(client.player_id === ignore) {
        return;
      }
      client.send(type, message)
    });
  }

  join (client) {
    this.players.push(client);
    client.joinGame(this);
  }

  leave (client) {
    var index = R.findIndex(R.propEq('player_id', client.player_id))(this.players);

    if(index) {
      this.players.splice(index, 1);
      this.broadcast('player/left', {
        player_id: client.player_id,
      });

      if(this.players.length === 0) {
        games.delete(this);
      }
    }

    return !!index;
  }

  updatePlayer (player_id, data) {
    // [TODO] Validate data
    data.player_id = player_id;
    this.broadcast('player/update', data, player_id);
  }

  spawn (player_id, data) {
    this.broadcast('game/spawn', data, player_id);
  }

}

module.exports = Game;
