#!/usr/bin/env node

const chalk = require('chalk')
const program = require('commander')

const util = require('../lib/util')
const pkg = require('../package')

const { generator } = require('..')

/**
 * Command name
 */
const name = Object.keys(pkg.bin)[0] || 'zce'

/**
 * Global error handler
 * @param {Error} err error
 * @param {Promise} promise promise
 */
const onError = (err, promise) => {
  // log error
  console.log()

  if (program.debug) {
    console.error(err)
    promise && console.error(promise)
  } else {
    console.error('💀 ', err instanceof Error ? err.message : err)
  }

  console.log()

  // error exit
  process.exit(1)
}

// provide a title to the process
process.title = name
process.on('uncaughtException', onError)
process.on('unhandledRejection', onError)

// node version required
util.checkNodeVersion()

// cli name & version
program.name(pkg.name).version(pkg.version)

// global option
program.option('--debug', 'debug mode')

// #region register commands

// `init` command
program
  .command('init <template> [project]')
  .description('generate a new project from a template')
  .option('-f, --force', 'overwrite target directory if it exists')
  .option('-o, --offline', 'use cached template')
  .action((template, project, { force, offline }) => {
    generator.init(template, project, { force, offline }).catch(onError)
  })
  .on('--help', () => {
    console.log()
    console.log('  Examples:')
    console.log()
    console.log(chalk.gray('    # create a new project with an official template'))
    console.log(`    $ ${name} init <template> [project]`)
    console.log()
    console.log(chalk.gray('    # create a new project straight from a github template'))
    console.log(`    $ ${name} init <username>/<repo> [project]`)
  })

// `list` command
program
  .command('list [username]').alias('ls')
  .description('list available official templates')
  .option('-s, --short', 'short mode')
  .action((username, { short }) => {
    generator.list(username, { short }).catch(onError)
  })

// #endregion

// `unknown` command
// output help information on unknown commands add some useful info on help
program
  .arguments('command')
  .action(command => {
    onError(`Unknown command: '${chalk.yellow(command)}'. See '${name} --help'.`)
  })
  .on('--help', () => {
    console.log()
    console.log('  Suggestions:')
    console.log()
    console.log(`    Run ${chalk.cyan(`${name} <command> --help`)} for detailed usage of given command.`)
  })

// // clear console when sub command execute
// program.commands.forEach(item => item.action(util.clearConsole))

// help end padding
program.on('--help', console.log).commands.forEach(item => item.on('--help', console.log))

// bootstrap
program.parse(process.argv)
