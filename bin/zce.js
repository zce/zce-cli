#!/usr/bin/env node

const chalk = require('chalk')
const program = require('commander')

const { version } = require('../package')
const { generator, util } = require('..')

// error handler
const onError = (err, promise) => {
  // // 💀  ${err.message}
  // util.error(err.message)

  // if (!!process.env.NODE_DEBUG) {
  //   console.log(process.env.NODE_DEBUG)
  //   throw err
  // }

  if (!program.debug) {
    return util.error(err.message)
  }

  // util.error('A promise was rejected but did not have a .catch() handler:')
  util.error((err && err.stack) || err || promise)
  // throw err
}

// check node version
util.nodeVersionCheck()

// command name
const name = 'zce'

// provide a title to the process
process.title = name

// Ensure if any promises aren't handled correctly then they get logged
process.on('unhandledRejection', onError)

// cli name & version
program.name(name).version(version)

// debug option
program.option('--debug', 'debug mode')

/**
 * Init command
 */
program
  .command('init <template> [project]').alias('create')
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
    console.log()
  })

/**
 * List command
 */
program
  .command('list [username]').alias('ls')
  .description('list available official templates')
  .option('-s, --short', 'short mode')
  .action((username, { short }) => {
    generator.list(username, { short }).catch(onError)
  })
  .on('--help', console.log)

// // clear console when sub command execute
// program.commands.forEach(item => item.action(util.clearConsole))

/**
 * Main command
 * output help information on unknown commands
 * add some useful info on help
 */
program
  .arguments('command')
  .action(cmd => {
    program.outputHelp()
    util.error(`Unknown command: ${chalk.yellow(cmd)}.`)
    util.log()
  })
  .on('--help', () => {
    console.log()
    console.log('  Suggestions:')
    console.log()
    console.log(`    Run ${chalk.cyan(`${name} <command> --help`)} for detailed usage of given command.`)
    console.log()
  })

// bootstrap parse argv
program.parse(process.argv)
