'use strict';

var R = require('ramda');
var Game = require('../model/game');
var games = new Map();

exports.list = () => {
  return Array.from(games.values()).map(({game_id, players, maxPlayers, started_at, rules}) => {
    return {
      game_id, maxPlayers, started_at, rules,
      players: players.length,
    };
  });
};

exports.get = (gameId) => {
  return games.get(gameId);
};

exports.create = (client) => {
  var game = Game.create(client);
  games.set(game.game_id, game);
  return game;
};

exports.joinFullest = (client) => {
  var fullestGame = R.pipe(
    R.filter(game => game.maxPlayers > game.players.length),
    R.sortBy(game => game.maxPlayers - game.players.length),
    R.reverse,
    R.head
  )(Array.from(games.values()));

  if(!fullestGame) {
    fullestGame = exports.create(client);
  }

  fullestGame.join(client);
  return fullestGame;
};

exports.delete = (game) => {
  games.delete(game.game_id);
};
