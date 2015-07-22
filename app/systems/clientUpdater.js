'use strict';

var map = (fn, iterable) => {
  var result = [];

  for(let item of iterable) {
    result.push(fn(item[1]));
  }

  return result;
}

class ClientUpdater {
  static create (room) {
    return new ClientUpdater(room);
  }

  constructor (room) {
    this.room = room;
  }

  tick (entities) {
    // [TODO] Observe/diff entities and their components to not spam all the data all the time
    this.room.broadcast('game/updates', map(entity => entity.serialize(), entities));
  }
}

module.exports = ClientUpdater;
