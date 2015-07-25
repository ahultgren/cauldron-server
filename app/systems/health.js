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
      this.mediator.triggered(`collision:${entity.id}`).forEach((e) => {
        var health = entity.getComponent('health');
        var hitBy = this.game.getEntity(e.hitBy);

        if(!hitBy || !hitBy.hasComponent('damage')) {
          return;
        }

        var damage = hitBy.getComponent('damage');

        health.health -= damage.damage;

        if(health.health <= 0) {
          health.health = health.maxHealth;
          this.mediator.emit(`death:${entity.id}`, {
            killedBy: e.hitBy,
          });
        }
      });
    });
  }
}

module.exports = Health;
