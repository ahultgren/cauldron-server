'use strict';

var R = require('ramda');
var filter = require('cauldron-core/app/utils/filter');
var map = require('cauldron-core/app/utils/map');

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
  }
}

module.exports = ClientUpdater;
