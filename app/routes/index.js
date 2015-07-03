'use strict';

var playerService = require('../services/playerService');
var gameService = require('../services/gameService');
var Router = require('express').Router;
var router = Router();

router.route('/')
.get((req, res) => {
  res.send('I\'m alive');
});

router.route('/players')
.post((req, res, next) => {
  playerService.create(req.body)
  .then(data => res.send(data), next);
})
.get((req, res, next) => {
  playerService.list()
  .then(data => res.send(data), next);
});

router.route('/games')
.post((req, res, next) => {
  gameService.create(req.user, req.body)
  .then(data => res.send(data), next);
})
.get((req, res, next) => {
  gameService.list()
  .then(data => res.send(data), next);
});

router.route('/games/:game_id')
.get((req, res, next) => {
  gameService.get(req.params.game_id)
  .then(data => res.send(data), next);
});

module.exports = router;
