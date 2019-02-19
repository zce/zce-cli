#!/usr/bin/env node

const pkg = require('../package.json')

// node version check
require('../lib/utils/node-version-check')(pkg)

// update check
require('../lib/utils/update-check')(pkg)

const chalk = require('chalk')
const cli = require('commander')

// enhance command error messages
require('../lib/utils/enhance-command')(cli)

// cli config
cli
  .version(pkg.version)
  .description(pkg.description)
  .usage('<command> [options]')
  .action(command => {
    // output help information on unknown commands
    console.error('Unknown command: `%s`.', chalk.yellow(command))
    console.error('Run `%s` for got useful info.', chalk.cyan(`${cli.name()} --help`))
    // cli.outputHelp()
  })
  .on('--help', () => {
    // add some useful info on help
    console.log()
    console.log('Run `%s` for detailed usage of given command.', chalk.cyan(`${cli.name()} <command> --help`))
  })

// init command
cli
  .command('init <template> [project]')
  .description('generate a new project from a template')
  .option('-v, --verbose', 'enable verbose output')
  .action((template, project, options) => {
    require('..').init(template, project, options)
  })
  .on('--help', () => {
    console.log()
    console.log('Examples:')
    console.log(chalk.gray('  # create a new project with an official template'))
    console.log('  $ %s init <template> [project]', cli.name())
    console.log(chalk.gray('  # create a new project straight from a github template'))
    console.log('  $ %s init <username>/<repo> [project]', cli.name())
  })

// list command
cli
  .command('list [username]').alias('ls')
  .description('list available official templates')
  .option('-j, --json', 'enable json mode output')
  .option('-s, --short', 'enable short mode output')
  .action((username, { json, short }) => {
    require('..').list(username, { json, short })
  })

// cli parse
cli.parse(process.argv)

// output help
cli.args.length || cli.help()

// /**
//  * Global error handler
//  * @param {Error} err error
//  * @param {Promise} promise promise
//  */
// const onError = (err, promise) => {
//   console.error('💀 ', chalk.red(err instanceof Error ? err.message : err))
//   // error exit
//   process.exit(1)
// }

// /**
//  * Global cancel handler
//  */
// const onCancel = () => {
//   console.log('👋  You have to cancel the task.')
//   process.exit()
// }

// // provide a title to the process
// process.title = pkg.name

// // unhandled exception & rejection
// process.on('uncaughtException', onError)
// process.on('unhandledRejection', onError)
// process.on('SIGINT', onCancel)
