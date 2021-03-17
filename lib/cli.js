const cac = require('cac')
const zceCli = require('.')
const { name, version } = require('../package.json')

// Unified error handling
/* istanbul ignore next */
const onError = err => {
  console.error(err.message)
  process.exit(1)
}

process.on('uncaughtException', onError)
process.on('unhandledRejection', onError)

const cli = cac(name)

// TODO: Implement module cli

cli
  .command('<input>', 'Sample cli program')
  .option('--host <host>', 'Sample options')
  .example(`  $ ${name} w --host zce.me`)
  .action((input, { host }) => {
    if (typeof host !== 'string' && typeof host !== 'undefined') {
      throw new TypeError('Expected host is a string, got undefined')
    }
    console.log(zceCli(input, { host }))
  })

cli.help().version(version).parse()
