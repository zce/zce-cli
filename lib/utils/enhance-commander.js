/**
 * Enhance commander error messages
 */

const chalk = require('chalk')

module.exports = cli => {
  cli.Command.prototype.unknownOption = function (flag) {
    if (this._allowUnknownOption) return
    console.error('Unknown option: `%s`.', chalk.yellow(flag))
    process.exit(1)
  }

  cli.Command.prototype.missingArgument = function (name) {
    console.error('Missing required argument: `%s`.', chalk.yellow(`<${name}>`))
    process.exit(1)
  }

  cli.Command.prototype.optionMissingArgument = function (option, flag) {
    if (flag) {
      console.error('Missing required argument for option: `%s`, got `%s`', chalk.yellow(option.flags), chalk.yellow(flag))
    } else {
      console.error('Missing required argument for option: `%s`.', chalk.yellow(option.flags))
    }
    process.exit(1)
  }

  cli.Command.prototype.variadicArgNotLast = function (name) {
    console.error('Variadic arguments must be last: `%s`.', chalk.yellow(name))
    process.exit(1)
  }
}
