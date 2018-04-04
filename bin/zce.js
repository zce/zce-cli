#!/usr/bin/env node

/**
 * CLI Portal
 *
 * https://github.com/tj/commander.js
 * https://github.com/sindresorhus/log-update
 * https://github.com/segmentio/metalsmith
 * https://github.com/sindresorhus/fullname
 */

const chalk = require('chalk')
const program = require('commander')

const { version } = require('../package')
const { generator, util } = require('..')

;(async () => {
  // provide a title to the process
  process.title = 'zce'

  // Ensure if any promises aren't handled correctly then they get logged
  process.on('unhandledRejection', (reason, promise) => {
    console.warn('A promise was rejected but did not have a .catch() handler:')
    // console.warn(reason && reason.stack || reason || promise)
    throw reason
  })

  // check node version
  await util.checkVersion()

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
    .action((template, project, { offline, debug }) => {
      generator.init(template, project, { offline, debug })
    })
    .on('--help', () => {
      console.log()
      console.log('  Examples:')
      console.log()
      console.log(chalk.gray('    # create a new project with an official template'))
      console.log('    $ zce init <template> [project]')
      console.log()
      console.log(chalk.gray('    # create a new project straight from a github template'))
      console.log('    $ zce init <username>/<repo> [project]')
      console.log()
    })

  /**
   * List command
   */
  program
    .command('list [username]').alias('ls')
    .description('list available official templates')
    .option('-s, --short', 'short mode')
    .option('--debug', 'debug mode')
    .action((template, project, { short, debug }) => {
      generator.list(username, { short, debug })
    })
    .on('--help', console.log)

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

  // // new line for help
  // program.commands.forEach(c => c.on('--help', () => console.log()))

  // bootstrap parse argv
  program.parse(process.argv)
})()
