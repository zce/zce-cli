#!/usr/bin/env node

/**
 * CLI Portal
 *
 * https://github.com/tj/commander.js
 * https://github.com/sindresorhus/log-update
 */

const chalk = require('chalk')
const program = require('commander')

const { version } = require('../package')
const { init, util } = require('..')

util.checkNodeVersion()

// cli version
program.version(version)

/**
 * Init command
 */
program
  .command('init <template> [project]').alias('create')
  .description('generate a new project from a template')
  .option('--offline', 'use cached template')
  .option('--debug', 'debug mode')
  .action((template, project, options) => {
    init(template, project, options)
  })
  .on('--help', () => {
    console.log()
    console.log('  Examples:')
    console.log()
    console.log(chalk.gray('    # create a new project with an official template'))
    console.log(chalk.gray('    $ zce init <template> [project]'))
    console.log()
    console.log(chalk.gray('    # create a new project straight from a github template'))
    console.log(chalk.gray('    $ zce init <username>/<repo> [project]'))
    console.log()
  })

// output help information on unknown commands
program
  .arguments('command')
  .action(cmd => {
    // program.outputHelp()
    console.log()
    console.log(chalk.red(`  Unknown command: ${chalk.yellow(cmd)}.`))
    console.log()
  })

// add some useful info on help
program.on('--help', () => {
  console.log()
  console.log('  Suggestions:')
  console.log()
  console.log(`    Run ${chalk.cyan(`vue <command> --help`)} for detailed usage of given command.`)
  console.log()
})

// new line for help
program.commands.forEach(c => c.on('--help', () => console.log()))

// bootstrap parse argv
program.parse(process.argv)
