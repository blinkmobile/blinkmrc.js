'use strict';

const FILENAME = 'blinkmrc.json';

function config (options) {
  options = Object.assign({}, options);
  options.cwd = options.cwd || process.cwd();
  options.filename = options.filename || FILENAME;

  return {};
}

module.exports = { config, FILENAME };
