'use strict';

var filter = require('cauldron-core/app/utils/filter');

var hasScore = filter(entity => entity.hasComponents('score'));

class Score {
  static create (room) {
    return new Score(room);
  }

  constructor (room) {
    this.room = room;
  }

  tick (entities) {
    hasScore(entities)
    .forEach((entity) => {
      this.mediator.triggered(`death:${entity.id}`).forEach((e) => {
        var killedBy = this.game.getEntity(e.killedBy);
        var owner = killedBy && killedBy.getComponent('owner');

        if(!owner || owner.ownerId === entity.id) {
          return;
        }

        entity.getComponent('score').score -= 1;
        this.game.getEntity(owner.ownerId).getComponent('score').score += 1;
      });
    });
  }
}

module.exports = Score;
