'use strict';

var uuid = require('uuid');
var players = new Map();

exports.list = () => {
  return Promise.resolve(Array.from(players.values()));
};

exports.create = ({password}) => {
  var id = uuid.v4();
  var player = {player_id: id, password};

  players.set(id, player);

  return Promise.resolve(player);
};
