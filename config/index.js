'use strict';

var nconf = require('nconf');

module.exports = nconf.env().defaults({
  PORT: 5005,
});
