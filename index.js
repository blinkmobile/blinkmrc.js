/* @flow */
'use strict';

// local modules

const userConfig = require('./lib/user-config').userConfig;
const projectConfig = require('./lib/project-config').projectConfig;

// this module

module.exports = { userConfig, projectConfig };

/* ::

export type Config = {
  load: () => Promise<Object>,
  update: ((Object) => Object) => Promise<Object>,
  write: (Object) => Promise<Object>
}

export type ConfigOptions = {
  dir: string,
  fileMode?: number,
  filename?: string
}

export type ProjectConfigOptions = {
  cwd?: string,
  fileMode?: number,
  filename?: string,
  name: string
}

export type UserConfigOptions = {
  fileMode?: number,
  name: string,
  userConfigDir?: string
}

*/
