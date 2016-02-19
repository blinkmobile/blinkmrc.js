'use strict';

// local modules

const cfg = require('./config');
const config = cfg.config;
const FILENAME = cfg.FILENAME;

// this module

function projectConfig (options) {
  options = Object.assign({}, options);
  // prefix project configuration with a dot like .eslintrc.json or .travis.yml
  options.filename = `.${options.filename || FILENAME}`;

  return config(options);
}

module.exports = { projectConfig };
