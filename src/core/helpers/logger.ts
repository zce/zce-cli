/* eslint-disable @typescript-eslint/no-explicit-any */
import * as readline from 'readline'

import chalk from 'chalk'
import * as redent from 'redent'
import ora, { Ora } from 'ora'

// Disable colors output for testing
chalk.enabled = process.env.NODE_ENV !== 'test'

/**
 * Writes a normal message.
 * @param message The message to show.
 */
export const log = (message?: any, ...optionalParams: any[]): void => {
  console.log(message, ...optionalParams)
}

/**
 * Writes a normal information message.
 * This is the default type you should use.
 * @param message The message to show.
 */
export const info = (message?: any, ...optionalParams: any[]): void => {
  log(chalk.reset(message), ...optionalParams)
}

/**
 * Writes a success message.
 * When something is successful.  Use sparingly.
 * @param message The message to show.
 */
export const success = (message?: any, ...optionalParams: any[]): void => {
  log(chalk.green(message), ...optionalParams)
}

/**
 * Writes a warning message.
 * This is when the user might not be getting what they're expecting.
 * @param message The message to show.
 */
export const warn = (message?: any, ...optionalParams: any[]): void => {
  log(chalk.yellow(message), ...optionalParams)
}

/**
 * Writes an error message.
 * This is when something horribly goes wrong.
 * @param message The message to show.
 */
export const error = (message?: any, ...optionalParams: any[]): void => {
  log(chalk.red(message), ...optionalParams)
}

/**
 * Writes a debug message.
 * This is for devs only.
 * @param message The message to show.
 */
export const debug = (message: any, title: string = 'DEBUG'): void => {
  log(
    chalk.magenta(
      `↓↓↓ --------------------[ ${title} ]-------------------- ↓↓↓`
    )
  )
  log(message)
  log(
    chalk.magenta(
      `↑↑↑ --------------------[ ${title} ]-------------------- ↑↑↑`
    )
  )
}

/**
 * Pad `input` to `width`.
 * @param input input text
 * @param width width
 */
export const pad = (input: string, width: number): string => {
  const len = Math.max(0, width - input.length)
  return input + Array(len + 1).join(' ')
}

/**
 * Indent message.
 * @param input indent text
 * @param size indent size
 */
export const table = (
  obj: { [key: string]: string },
  minCels: number = 20
): string => {
  const keys = Object.keys(obj)
  minCels = Math.max(minCels, ...keys.map(k => k.length))
  return keys.map(k => `${pad(k, minCels)} ${obj[k]}`).join('\n')
}

/**
 * Indent message.
 * @param input indent text
 * @param size indent size
 */
export const indent = (input: string, size: number = 2): string => {
  return redent(input, size)
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
  log(
    chalk.gray(
      '--------------------------------------------------------------------------------'
    )
  )
}

/**
 * Clear console.
 * @param title Default title
 */
export const clear = (title?: string): void => {
  if (!process.stdout.isTTY) return
  const blank = '\n'.repeat(process.stdout.rows || 30)
  log(blank)
  readline.cursorTo(process.stdout, 0, 0)
  readline.clearScreenDown(process.stdout)
  title && log(title)
}

/**
 * Creates a spinner and starts it up.
 * @param options The text for the spinner or an ora options.
 * @returns The Ora spinner.
 */
export const spin = (options: string | object = ''): Ora => {
  return ora(options).start()
}

export { chalk }
