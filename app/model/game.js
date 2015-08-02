'use strict';

var uuid = require('uuid');
var R = require('ramda');
var cauldron = require('cauldron-core');
var maps = require('cauldron-core/app/maps');
var mapFactory = require('cauldron-core/app/factories/map');
var powerupFactory = require('cauldron-core/app/factories/powerup');
var filter = require('cauldron-core/app/utils/filter');
var games = require('../services/gameService');
var ClientUpdater = require('../systems/clientUpdater');
var Score = require('../systems/score');
var Health = require('../systems/health');

class Game {

  static create (client, rules = {map: 'one', duration: 120}) {
    return new Game(client, rules);
  }

  constructor (client, rules) {
    this.game_id = uuid.v4();
    this.players = [];
    this.maxPlayers = 8;
    this.owner = client;
    this.state = 'started';
    this.rules = rules;
    this.rules.started_at = new Date();

    var game = cauldron.Game.create();
    game.addSystem(cauldron.systems.Collision.create());
    game.addSystem(cauldron.systems.Movement.create());
    game.addSystem(cauldron.systems.Parent.create());
    game.addSystem(cauldron.systems.Factory.create());
    game.addSystem(cauldron.systems.Expire.create());
    game.addSystem(cauldron.systems.Powerups.create());
    game.addSystem(cauldron.systems.Reactivate.create());
    game.addSystem(Health.create());
    game.addSystem(Score.create());
    game.addSystem(ClientUpdater.create(this));

    game.addEntity(mapFactory(this.rules.map));

    maps[this.rules.map].powerupPoints.map(powerupFactory)
    .forEach(entity => game.addEntity(entity));
    this.simulation = game;

    setTimeout(() => this.end(), this.rules.duration * 1000);
    game.start();
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

      if(client.socket.readyState === client.socket.OPEN) {
        client.socket.close();
      }

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

  getPlayer (player_id) {
    return R.find(R.propEq('player_id', player_id), this.players);
  }

  updatePlayer (player_id, data) {
    // [TODO] Validate data
    data.player_id = player_id;
  }

  spawn (player_id, data) {
    var entity = cauldron.Entity.fromData(data);

    this.simulation.addEntity(entity);
  }

  leaderboard () {
    return filter((entity) => entity.hasComponent('score'), this.simulation.entities)
    .sort((a, b) => b.getComponent('score').score - a.getComponent('score').score)
    .map(entity => ({id: entity.id, score: entity.getComponent('score').score}));
  }

  end () {
    this.simulation.stop();
    this.state = 'ended';
    this.broadcast('game/end', {results: this.leaderboard()});
    this.players.forEach(player => this.leave(player));
  }

}

module.exports = Game;
