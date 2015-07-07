'use strict';

var playerService = require('../services/playerService');
var gameService = require('../services/gameService');
var Router = require('express').Router;
var router = Router();

router.route('/')
.get((req, res) => {
  res.send('I\'m alive');
});

router.route('/games')
.get((req, res, next) => {
  res.send(gameService.list());
});

router.route('/games/:game_id')
.get((req, res, next) => {
  res.send(gameService.get(req.params.game_id));
});

module.exports = router;
