#!/usr/bin/env node

const program = require('commander')
const list = require('../lib/cli-list')

program
  .usage('[username]')
  .option('-s, --short', 'short mode')
  .option('--debug', 'debug mode')
  .on('--help', console.log)
  .parse(process.argv)

const { args, short, debug } = program
const [ username ] = args

process.env.NODE_ENV = debug ? 'development' : 'production'

list(username, short)
