'use strict';

// local modules

const config = require('./config').config;

// this module

function home (options) {
  options = Object.assign({}, options);

  return config(options);
}

module.exports = { home };
