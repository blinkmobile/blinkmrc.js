/* @flow */
'use strict';

/* ::
import type {
  Config,
  ConfigOptions
} from '..'
*/

// Node.js built-ins

const path = require('path');

// foreign modules

const loadJson = require('load-json-file');
const writeJson = require('write-json-file');

// this module

const FILENAME = 'blinkmrc.json';

function assertDir (options) {
  if (!options.dir || typeof options.dir !== 'string') {
    throw new TypeError('target directory not provided / detected');
  }
}

function assertUpdater (updater) {
  if (!updater || typeof updater !== 'function') {
    throw new TypeError('updater must be a function');
  }
}

function load (
  filePath /* : string */
) /* : Promise<Object> */ {
  return loadJson(filePath)
    .catch((err) => {
      if (err.code === 'JSONError') {
        const error = new Error(`${filePath} is not valid JSON`);
        // $FlowFixMe [flow] property `code` (Property not found in Error)
        error.code = err.code;
        throw error;
      }
      throw err;
    })
    .then((data) => {
      if (!data || typeof data !== 'object') {
        throw new TypeError(`${filePath} does not define a JSON Object`);
      }
      return data;
    });
}

/** wrap a promise function so that error is swallowed, resolving instead */
function resolveOnError (
  fn /* : Function */,
  code /* : string */,
  value /* : Object */
) /* : (arguments) => Promise<Object> */ {
  return function () {
    return fn.apply(this, arguments)
      .catch((err) => {
        if (err.code === code) {
          return value; // it's okay if the file does not exist yet
        }
        throw err; // throw every other error
      });
  };
}

function write (
  filePath /* : string */,
  options /* : { mode?: number } */,
  data /* : Object */
) /* : Promise<Object> */ {
  options = Object.assign({}, {
    indent: 2,
    sortKeys: true
  }, options);
  return writeJson(filePath, data, options)
    .then(() => data);
}

function update (
  filePath /* : string */,
  options /* : { mode?: number } */,
  updater /* : (Object) => Object */
) /* : Promise<Object> */ {
  assertUpdater(updater);
  // it's okay if the file does not exist yet
  return resolveOnError(load, 'ENOENT', {})(filePath)
    .then((data) => write(filePath, options, updater(data)));
}

function config (
  options /* : ConfigOptions */
) /* : Config */ {
  options = Object.assign({}, options);
  assertDir(options);
  options.filename = options.filename || FILENAME;

  const filePath = path.join(options.dir, options.filename);

  return {
    load: load.bind(null, filePath),
    update: update.bind(null, filePath, { mode: options.fileMode }),
    write: write.bind(null, filePath, { mode: options.fileMode })
  };
}

module.exports = { config, FILENAME, load, resolveOnError, update, write };
