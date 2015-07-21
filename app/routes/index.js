'use strict';

var gameService = require('../services/gameService');
var Router = require('express').Router;
var router = new Router();

router.route('/')
.get((req, res) => {
  res.send('I\'m alive');
});

router.route('/games')
.get((req, res) => {
  res.send(gameService.list());
});

router.route('/games/:game_id')
.get((req, res) => {
  res.send(gameService.get(req.params.game_id));
});

module.exports = router;
