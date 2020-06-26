#!/usr/bin/env node
'use strict';
const meow = require('meow');
const servoe = require('./');

const cli = meow(`
Usage
  $ servoe [input]

Options
  --foo  Lorem ipsum. [Default: false]

Examples
  $ servoe
  unicorns
  $ servoe rainbows
  unicorns & rainbows
`);
