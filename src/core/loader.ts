import { join } from 'path'
import { readdirSync } from 'fs'

import { Command } from './types'

interface CommandsDict {
  [name: string]: Command
}
interface Cache {
  [path: string]: CommandsDict
}

const cache: Cache = {}

/**
 * Load dir commands
 * @param dir dir to load
 */
const loadCommands = (dir: string): CommandsDict => {
  const commandDir = join(__dirname, dir)
  // return if cached
  if (cache[dir]) return cache[commandDir]

  // scanning commands
  cache[commandDir] = readdirSync(commandDir).reduce((commands, item) => {
    try {
      const command: Command = require(join(commandDir, item)).default
      commands[command.name] = command
      if (typeof command.alias === 'string') {
        commands[command.alias] = command
      } else if (command.alias) {
        command.alias.forEach(a => {
          commands[a] = command
        })
      }
    } catch (e) {}
    return commands
  }, {})

  return cache[commandDir]
}

/**
 * All core commands
 */
export const coreCommands: CommandsDict = loadCommands('./commands')

/**
 * All commands
 */
export const userCommands: CommandsDict = loadCommands('../commands')

/**
 * Load command by name
 * @param name command name
 */
export const load = async (name: string): Promise<Command> => {
  // help command
  if (['help', '--help', '-h'].includes(name)) {
    return coreCommands.help
  }

  // version command
  if (['version', '--version', '-V'].includes(name)) {
    return coreCommands.version
  }

  // try to load user command
  if (userCommands[name]) {
    return userCommands[name]
  }

  // try to load user default command
  if (userCommands.default) {
    return userCommands.default
  }

  // fallback default command
  return coreCommands.default
}
