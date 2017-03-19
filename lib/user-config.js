/* @flow */
'use strict';

/* ::
import type {
  Config,
  UserConfigOptions
} from '..'
*/

// Node.js built-ins

const os = require('os');

// foreign modules

const AppDirectory = require('appdirectory');

// local modules

const baseConfig = require('./config');
const config = baseConfig.config;
const resolveOnError = baseConfig.resolveOnError;

// this module

// use ~/.config in OS X (like Linux), dotfiles are better for CLIs
const platform = (() => {
  const p = os.platform();
  if (p === 'darwin') {
    return 'linux';
  }
  return p;
})();

function userConfig (
  options /* : UserConfigOptions */
) /* : Config */ {
  options = Object.assign({}, options);

  options.dir = options.userConfigDir || (() => {
    const dirs = new AppDirectory({
      appName: options.name,
      platform,
      useRoaming: false
    });
    return dirs.userConfig();
  })();

  options.fileMode = options.fileMode || 0o600;

  const cfg = config(options);

  // it's okay if the file does not exist yet
  cfg.load = resolveOnError(cfg.load, 'ENOENT', {});

  return cfg;
}

module.exports = { userConfig };
