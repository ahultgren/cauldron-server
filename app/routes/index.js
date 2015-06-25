'use strict';

var Router = require('express').Router;
var router = Router();

router.route('/')
.get((req, res) => {
  res.send('I\'m alive');
});

module.exports = router;
