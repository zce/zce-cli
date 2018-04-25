#!/usr/bin/env node

const chalk = require('chalk')
const semver = require('semver')
const program = require('commander')

const pkg = require('../package')

const { generator } = require('..')

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
    console.error('💀 ', chalk.red(err instanceof Error ? err.message : err))
  }

  console.log()

  // error exit
  process.exit(1)
}

/**
 * Global exit handler
 */
const onExit = () => {
  console.log('\n\n👋  You have to cancel the init task.\n')
  process.exit(1)
}

// provide a title to the process
process.title = pkg.name
// unhandled exception & rejection
process.on('uncaughtException', onError)
process.on('unhandledRejection', onError)
process.on('SIGINT', onExit)

// istanbul ignore if
if (!semver.satisfies(process.version, pkg.engines.node)) {
  console.log(chalk.red(`You are using Node.js ${chalk.yellow(process.version)}, but this version of ${chalk.cyan(pkg.name)} requires Node.js ${chalk.green(pkg.engines.node)}.`))
  console.log(chalk.red('Please upgrade your Node.js version before this operation.'))
  // node version required
  process.exit(1)
}

// #region register commands

// `init` command
program
  .command('init <template> [project]')
  .description('generate a new project from a template')
  .option('-f, --force', 'overwrite target directory if it exists')
  .option('-o, --offline', 'offline mode, use cached template')
  .option('-s, --save', 'save the answers for the next')
  .action((template, project, { force, offline, save }) => {
    generator.init(template, project, { force, offline, save }).catch(onError)
  })
  .on('--help', () => {
    console.log()
    console.log('  Examples:')
    console.log()
    console.log(chalk.gray('    # create a new project with an official template'))
    console.log(`    $ ${program.name()} init <template> [project]`)
    console.log()
    console.log(chalk.gray('    # create a new project straight from a github template'))
    console.log(`    $ ${program.name()} init <username>/<repo> [project]`)
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

// #region main command

program
  .version(pkg.version)
  .usage('<command> [options]')
  .option('--debug', 'run command in debug mode')
  .action(command => {
    // output help information on unknown commands add some useful info on help
    onError(`Unknown command: '${chalk.yellow(command)}'. See '${program.name()} --help'.`)
  })
  .on('--help', () => {
    console.log()
    console.log('  Suggestions:')
    console.log()
    console.log(`    Run ${chalk.cyan(`${program.name()} <command> --help`)} for detailed usage of given command.`)
  })
// #endregion

// #region common action & help

// // clear console when sub command execute
// program.commands.forEach(item => item.action(clearConsole))

// help end padding
program.on('--help', console.log).commands.forEach(item => item.on('--help', console.log))

// #endregion

// bootstrap
program.parse(process.argv)
