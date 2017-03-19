# blinkmrc.j [![npm module](https://img.shields.io/npm/v/@blinkmobile/blinkmrc.svg)](https://www.npmjs.com/package/@blinkmobile/blinkmrc) [![Travis CI Status](https://travis-ci.org/blinkmobile/blinkmrc.js.svg?branch=master)](https://travis-ci.org/blinkmobile/blinkmrc.js) [![AppVeyor Status](https://img.shields.io/appveyor/ci/blinkmobile/blinkmrc-js/master.svg)](https://ci.appveyor.com/project/blinkmobile/blinkmrc-js) [![Greenkeeper badge](https://badges.greenkeeper.io/blinkmobile/blinkmrc.js.svg)](https://greenkeeper.io/)

bit like https://github.com/yeoman/configstore but with home-directory and project-specific files

We extracted this from [blinkmobile/bmp-cli](https://github.com/blinkmobile/bmp-cli) for the benefit of our other CLI projects.


## What is this?

This is a basic configuration file management library, hardcoded with defaults that suit our purposes. Like [git](http://git-scm.com/) and [npm](https://www.npmjs.com/package/npm), this library straddles configuration files in 2 locations:

- your home directory (based on your operating system), where files are readable by the current user and inaccessible by other users

- your project directory, where files are readable by anyone with access to the project (i.e. if you version control these files with your project)

This pair of configuration files are both JSON-formatted.

By default we use the following filenames (but this is configurable):

- user: blinkmrc.json

- project: .blinkmrc.json (like .eslintrc.json or .travis.yml)


## API

```js
const blinkmrc = require('@blinkmobile/blinkmrc');
const pkg = require('./package.json');
```


### `userConfig (options: ConfigOptions) => ConfigStore`

```js
const userConfig = blinkmrc.userConfig({ name: pkg.name, /* ... */ });
```


#### UserConfigOptions

```
interface ConfigOptions {
  fileMode = 0o600: Number,
  userConfigDir?: String,
...ConfigOptions
}
```


### `project (options: ConfigOptions) => ConfigStore`

```js
const projectConfig = blinkmrc.projectConfig({ name: pkg.name, /* ... */ });
```


#### ProjectConfigOptions

```
interface ConfigOptions {
  cwd = process.cwd(): String,
  fileMode = 0o666: Number,
  ...ConfigOptions
}
```


### ConfigOptions

```
interface ConfigOptions {
  name: String,
  filename = 'blinkmrc.json': String,
  fileMode?: Number
}
```


### ConfigStore

```
interface ConfigStore {
  load () => Promise[Object],
  update (updater: UpdaterFunction) => Promise,
  write () => Promise
}
```


#### `load () => Promise[Object]`

Locate the configuration file.
If found, parse it as JSON and return the Object.
If not found:

- userConfig: return a new Object

- projectConfig: reject with an Error


#### `update (updater: UpdaterFunction) => Promise[Object]`

Load the configuration data as above.
Then pass it to the provided UpdaterFunction.
Write the result of the UpdaterFunction back to the configuration file.


##### UpdaterFunction (config: Object) => Object

This function receives the current configuration data.
This function may or may not change this data (as you determine) before returning it.


#### `write (config: Object) => Promise[Object]`

Store the provided configuration data in the appropriate file.
