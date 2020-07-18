import chalk from 'chalk'
import redent from 'redent'
import ora, { Ora } from 'ora'

/**
 * Chalk instance
 */
export const color = new chalk.Instance({
  // Disable colors output for testing
  level: process.env.NODE_ENV === 'test' ? 0 : /* istanbul ignore next */ 3
})

/**
 * Writes a normal message.
 * @param message The message to show.
 */
export const log = (...args: unknown[]): void => {
  console.log(...args)
}

/**
 * Writes a normal information message.
 * This is the default type you should use.
 * @param message The message to show.
 */
export const info = (message?: unknown, ...args: unknown[]): void => {
  log(color.reset(message), ...args)
}

/**
 * Writes a success message.
 * When something is successful.  Use sparingly.
 * @param message The message to show.
 */
export const success = (message?: unknown, ...args: unknown[]): void => {
  log(color.green(message), ...args)
}

/**
 * Writes a warning message.
 * This is when the user might not be getting what they're expecting.
 * @param message The message to show.
 */
export const warn = (message?: unknown, ...args: unknown[]): void => {
  log(color.yellow(message), ...args)
}

/**
 * Writes an error message.
 * This is when something horribly goes wrong.
 * @param message The message to show.
 */
export const error = (message?: unknown, ...args: unknown[]): void => {
  log(color.red(message), ...args)
}

/**
 * Writes a debug message.
 * This is for devs only.
 * @param message The message to show.
 */
export const debug = (message: unknown, title = 'DEBUG'): void => {
  log(color.magenta(`↓↓↓ --------------------[ ${title} ]-------------------- ↓↓↓`))
  log(message)
  log(color.magenta(`↑↑↑ --------------------[ ${title} ]-------------------- ↑↑↑`))
}

/**
 * Writes an table message.
 * @param infos infos
 * @param width column width
 * @param indent indent size
 * @todo
 * support color ansi
 * - https://github.com/chalk/strip-ansi/blob/master/index.js
 */
export const table = (infos: Array<[string, unknown]> | Record<string, unknown>, min = 10, indent = 0): void => {
  if (!Array.isArray(infos)) {
    infos = Object.entries(infos)
  }
  min = Math.max(min, ...infos.map(i => i[0].length))
  let text = infos.map(i => `${i[0].padEnd(min)}  ${i[1] as string}`).join('\n')
  text = indent !== 0 ? redent(text, indent) : text
  log(text)
}
/**
 * Print a blank line.
 */
export const newline = (): void => {
  log('')
}

/**
 * Prints a divider line
 */
export const divider = (): void => {
  log(color.gray('-'.repeat(80)))
}

/**
 * Clear console.
 * @param title Default title
 */
export const clear = (title?: string): void => {
  // if (!process.stdout.isTTY) return
  // log('\n'.repeat(process.stdout.rows || 30))
  // readline.cursorTo(process.stdout, 0, 0)
  // readline.clearScreenDown(process.stdout)
  console.clear() // node >= 8.3
  title != null && log(title)
}

/**
 * Indent message.
 * @param input indent text
 * @param size indent size
 */
export const indent = (input: string, size = 2): string => {
  return redent(input, size)
}

/**
 * Creates a spinner and starts it up.
 * @param options The text for the spinner or an ora options.
 * @returns The Ora spinner.
 */
export const spin = (options: string | Record<string, unknown> = ''): Ora => {
  return ora(options).start()
}
