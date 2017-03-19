/* @flow */
'use strict';

/* ::
import type {
  Config,
  ProjectConfigOptions
} from '..'
*/

// local modules

const baseConfig = require('./config');
const config = baseConfig.config;
const FILENAME = baseConfig.FILENAME;

// this module

function projectConfig (
  options /* : ProjectConfigOptions */
) /* : Config */ {
  options = Object.assign({}, options);
  // default is a dotfile, like .eslintrc.json or .travis.yml
  options.filename = options.filename || `.${FILENAME}`;

  options.dir = options.cwd || process.cwd();
  options.fileMode = options.fileMode || 0o666;

  return config(options);
}

module.exports = { projectConfig };
