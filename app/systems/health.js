'use strict';

var filter = require('cauldron-core/app/utils/filter');

var hasHealth = filter(entity => entity.hasComponents('health'));

class Health {
  static create () {
    return new Health();
  }

  constructor () {

  }

  tick (entities) {
    hasHealth(entities)
    .forEach((entity) => {
      this.mediator.triggered(`collision:${entity.id}`).forEach(() => {
        // [TODO] Check if hitBy has a damage component?
        var health = entity.getComponent('health');
        health.health--;

        if(health.health <= 0) {
          health.health = health.maxHealth;
          this.mediator.emit(`death:${entity.id}`, {});
        }
      });
    });
  }
}

module.exports = Health;
