import { logger } from './helpers'

/**
 * Throw unknown command error.
 * @param name command name
 * @param fallback fallback command tip
 */
export const unknownCommand = (name: string, fallback = '[bin] --help'): void => {
  logger.error('Unknown command: `%s`.', name)
  logger.error('Type `%s` to view all commands.', fallback)
  process.exit(1)
}

/**
 * Throw missing option error.
 * @param name argument name
 */
export const missingArgument = (name: string): void => {
  logger.error('Missing required argument: `<%s>`.', name)
  process.exit(1)
}

// export const unknownOption = (flag: string): void => {
//   if (this._allowUnknownOption) return
//   console.error('Unknown option: `%s`.', chalk.yellow(flag))
//   process.exit(1)
// }

// export const optionMissingArgument = (option, flag): void => {
//   if (flag) {
//     console.error('Missing required argument for option: `%s`, got `%s`', chalk.yellow(option.flags), chalk.yellow(flag))
//   } else {
//     console.error('Missing required argument for option: `%s`.', chalk.yellow(option.flags))
//   }
//   process.exit(1)
// }

// export const variadicArgNotLast = (name): void => {
//   console.error('Variadic arguments must be last: `%s`.', chalk.yellow(name))
//   process.exit(1)
// }
