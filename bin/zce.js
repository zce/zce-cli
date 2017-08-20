#!/usr/bin/env node

const program = require('commander')
const { version } = require('../package')

program
  .version(version)
  .usage('<command> [options]')
  .command('init', 'generate a new project from a template')
  .command('list', 'list available official templates').alias('ls')
  .on('--help', console.log)
  .parse(process.argv)
