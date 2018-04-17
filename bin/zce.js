#!/usr/bin/env node

const chalk = require('chalk')
const semver = require('semver')
const program = require('commander')

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
    console.error('💀', err instanceof Error ? err.message : err)
  }

  console.log()

  // error exit
  process.exit(1)
}

/**
 * node version check
 */
const checkVersion = () => {
  if (semver.satisfies(process.version, pkg.engines.node)) return true

  console.log(chalk.red(`You are using Node.js ${chalk.yellow(process.version)}, but this version of ${chalk.cyan(pkg.name)} requires Node.js ${chalk.green(pkg.engines.node)}.`))
  console.log(chalk.red('Please upgrade your Node.js version before this operation.'))

  process.exit(1)
}

// provide a title to the process
process.title = name
process.on('uncaughtException', onError)
process.on('unhandledRejection', onError)

checkVersion()

// cli name & version
program.name(pkg.name).version(pkg.version)

// global option
program.option('--debug', 'debug mode')

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
