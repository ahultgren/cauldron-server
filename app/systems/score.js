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
      this.mediator.triggered(`collision:${entity.id}`).forEach((e) => {
        var hitBy = this.game.getEntity(e.hitBy);
        var owner = hitBy && hitBy.getComponent('owner');

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
