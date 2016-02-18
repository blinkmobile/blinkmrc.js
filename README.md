# blinkmrc.js

bit like https://github.com/yeoman/configstore but with home-directory and project-specific files

[![npm module](https://img.shields.io/npm/v/@blinkmobile/bmp-cli.svg)](https://www.npmjs.com/package/@blinkmobile/blinkmrc)
[![Build Status](https://travis-ci.org/blinkmobile/bmp-cli.svg?branch=master)](https://travis-ci.org/blinkmobile/blinkmrc.js)


We extracted this from [blinkmobile/bmp-cli](https://github.com/blinkmobile/bmp-cli) for the benefit of our other CLI projects.


## What is this?

This is a basic configuration file management library, hardcoded with defaults that suit our purposes. Like [git](http://git-scm.com/) and [npm](https://www.npmjs.com/package/npm), this library straddles configuration files in 2 locations:

- your home directory (based on your operating system), where files are readable by the current user and inaccessible by other users

- your project directory, where files are readable by anyone with access to the project (i.e. if you version control these files with your project)

This pair of configuration files are both JSON-formatted.

By default we use the following filenames (but this is configurable):

- home: blinkmrc.json

- project: .blinkmrc.json (like .eslintrc.json or .travis.yml)


## API

```js
const blinkmrc = require('@blinkmobile/blinkmrc');
const pkg = require('./package.json');
```


### `home (options: ConfigOptions) => ConfigStore`

```js
const homeConfig = blinkmrc.home({ name: pkg.name, /* ... */ });
```


#### ConfigOptions

```
interface ConfigOptions {
  cwd = process.cwd(): String,
  name: String,
  filename = 'blinkmrc.json': String
}
```


#### ConfigStore

```
interface ConfigStore {
  load () => Promise[Object],
  update (updater: UpdaterFunction) => Promise,
  write () => Promise
}
```


### `project (options: ConfigOptions) => ConfigStore`

```js
const projectConfig = blinkmrc.project({ name: pkg.name, /* ... */ });
```


#### `load () => Promise[Object]`

Locate the configuration file.
If found, parse it as JSON and return the Object.
If not found, then return a new Object.


#### `update (updater: UpdaterFunction) => Promise[Object]`

Load the configuration data as above.
Then pass it to the provided UpdaterFunction.
Write the result of the UpdaterFunction back to the configuration file.


##### UpdaterFunction (config: Object) => Object

This function receives the current configuration data.
This function may or may not change this data (as you determine) before returning it.


#### `write (config: Object) => Promise[Object]`

Store the provided configuration data in the appropriate file.
