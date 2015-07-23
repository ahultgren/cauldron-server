'use strict';

var uuid = require('uuid');
var R = require('ramda');
var cauldron = require('cauldron-core');
var games = require('../services/gameService');
var ClientUpdater = require('../systems/clientUpdater');
var Score = require('../systems/score');
var mapFactory = require('cauldron-core/app/factories/map');

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

    var game = cauldron.Game.create();
    game.addSystem(cauldron.systems.Collision.create());
    game.addSystem(cauldron.systems.Movement.create());
    game.addSystem(cauldron.systems.Parent.create());
    game.addSystem(cauldron.systems.Factory.create());
    game.addSystem(cauldron.systems.Expire.create());
    game.addSystem(Score.create());
    game.addSystem(ClientUpdater.create(this));

    game.addEntity(mapFactory(this.rules.map));
    game.start();

    this.simulation = game;
  }

  broadcast (type, message, ignore) {
    this.players.forEach((client) => {
      if(client.player_id === ignore) {
        return;
      }
      client.send(type, message);
    });
  }

  join (client) {
    console.log('Join', client.player_id);

    this.players.push(client);
    this.simulation.addEntity(client.player);
    client.joinGame(this);
  }

  leave (client) {
    var index = R.findIndex(R.propEq('player_id', client.player_id))(this.players);

    if(index > -1) {
      console.log('Leave', client.player_id);

      this.players.splice(index, 1);
      this.simulation.removeEntity(client.player_id);
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
  }

  spawn (player_id, data) {
    var entity = cauldron.Entity.fromData(data);

    // [TODO] Remove this temporary fulhack when i've figured out how or how not to have consistent ids on clients and servers
    if(entity.hasComponent('owner')) {
      entity.getComponent('owner').ownerId = player_id;
    }

    this.simulation.addEntity(entity);
  }

}

module.exports = Game;
