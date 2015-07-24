'use strict';

var R = require('ramda');
var filter = require('cauldron-core/app/utils/filter');
var map = require('cauldron-core/app/utils/map');
var maps = require('cauldron-core/app/maps');

var serialize = map(entity => entity.serialize());
var collidable = filter(entity => entity.hasComponent('collision'));
var broadcastable = R.compose(serialize, collidable);

class ClientUpdater {
  static create (room) {
    return new ClientUpdater(room);
  }

  constructor (room) {
    this.room = room;
  }

  tick (entities) {
    // [TODO] Observe/diff entities and their components to not spam all the data all the time
    this.room.broadcast('game/updates', broadcastable(entities));

    entities.forEach((entity) => {
      this.game.mediator.triggered(`death:${entity.id}`).forEach(() => {
        var mapData = maps[this.room.rules.map];
        var [x, y] = mapData.spawnPoints[~~(mapData.spawnPoints.length * Math.random())];

        this.room.getPlayer(entity.id).send('game/respawn', {x, y});
      });
    });
  }
}

module.exports = ClientUpdater;
