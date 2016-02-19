'use strict';

// Node.js built-ins

const fs = require('fs');
const path = require('path');

// foreign modules

const pify = require('pify');
const temp = pify(require('temp').track());
const test = require('ava');

// local modules

const projectConfig = require('..').projectConfig;
const pkg = require('../package.json');

// this module

const fsp = pify(fs);

test.beforeEach((t) => {
  return temp.mkdir(pkg.name.replace(/\//g, '-') + '-')
    .then((dirPath) => {
      t.context.tempDir = dirPath;
      t.context.cfg = projectConfig({
        cwd: dirPath,
        name: pkg.name
      });
    });
});

test('read missing .blinkmrc.json, error', (t) => {
  return t.context.cfg.load()
    .then((data) => t.fail(JSON.stringify(data)))
    .catch((err) => t.ok(err));
});

test('read empty .blinkmrc.json, error', (t) => {
  const cfg = projectConfig({
    cwd: path.join(__dirname, 'fixtures', 'empty'),
    name: pkg.name
  });
  return cfg.load()
    .then((data) => t.fail(JSON.stringify(data)))
    .catch((err) => t.ok(err));
});

test('read .blinkmrc.json', (t) => {
  const cfg = projectConfig({
    cwd: path.join(__dirname, 'fixtures', 'blah'),
    name: pkg.name
  });
  return cfg.load()
    .then((obj) => {
      t.same(obj, { test: 'blah' });
    });
});

test('write to .blinkmrc.json', (t) => {
  return t.context.cfg.write({ test: 'abc' })
    .then((obj) => t.same(obj, { test: 'abc' }))
    .then(() => require(path.join(t.context.tempDir, '.blinkmrc.json')))
    .then((obj) => t.same(obj, { test: 'abc' }));
});

test('update .blinkmrc.json', (t) => {
  return fsp.writeFile(
    path.join(t.context.tempDir, '.blinkmrc.json'),
    '{"test":"blah"}',
    'utf8'
  )
    .then(() => t.context.cfg.update((obj) => {
      obj.abc = 'def';
      return obj;
    }))
    .then((obj) => t.same(obj, { abc: 'def', test: 'blah' }))
    .then(() => require(path.join(t.context.tempDir, '.blinkmrc.json')))
    .then((obj) => t.same(obj, { abc: 'def', test: 'blah' }));
});
