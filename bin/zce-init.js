#!/usr/bin/env node

const chalk = require('chalk')
const program = require('commander')
const init = require('../lib/cli-init')

program
  .usage('<template> [project]')
  .option('--offline', 'use cached template')
  .option('--debug', 'debug mode')
  .on('--help', () => {
    console.log()
    console.log('  Examples:')
    console.log()
    console.log(chalk.gray('    # create a new project with an official template'))
    console.log('    $ zce init <template-name> [project-name]')
    console.log()
    console.log(chalk.gray('    # create a new project straight from a github template'))
    console.log('    $ zce init <username>/<repo> [project-name]')
    console.log()
  })
  .parse(process.argv)
  .args.length || program.help()

const { args, offline, debug } = program
const [ template, target ] = args

process.env.NODE_ENV = debug ? 'development' : 'production'

init(template, target, offline)
