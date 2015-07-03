'use strict';

var uuid = require('uuid');
var games = new Map();

exports.list = () => {
  return Promise.resolve(Array.from(games.values()));
};

exports.get = (gameId) => {
  return Promise.resolve(games.get(gameId));
};

exports.create = (owner, {name, rules}) => {
  var id = uuid.v4();

  games.set(id, {
    game_id: id,
    name,
    rules,
    players: [owner],
    owner,
    state: 'created',
    started_at: null,
  });

  return Promise.resolve();
};

exports.join = (gameId, playerId) => {
  var game = games.get(gameId);

  if(!game) {
    return Promise.reject();
  }

  if(game.players.length >= game.rules.players) {
    return Promise.reject();
  }

  game.players.push(playerId);

  return Promise.resolve();
};

exports.start = (id) => {
  var game = games.get(id);

  game.state = 'started';
  game.started_at = Date.now();

  return Promise.resolve();
};

//## Demo
exports.create('mr_andersen', {
  name: 'Test game',
  rules: {
    players: 4,
    map: 'one',
  },
});
