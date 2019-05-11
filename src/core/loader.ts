import { join } from 'path'
import { readdirSync } from 'fs'

import { Command, Commands } from './types'

/**
 * Load dir commands
 * @param dir dir to load
 */
const loadCommands = (dir: string): Commands => {
  const commandDir = join(__dirname, dir)

  // scanning commands
  return readdirSync(commandDir).reduce(
    (cmds, item) => {
      try {
        const command: Command = require(join(commandDir, item)).default
        cmds[command.name] = command
        if (typeof command.alias === 'string') {
          cmds[command.alias] = command
        } else if (command.alias) {
          command.alias.forEach(a => {
            cmds[a] = command
          })
        }
      } catch (e) {}
      return cmds
    },
    {} as any
  )
}

/**
 * All core commands
 */
export const coreCommands: Commands = loadCommands('./commands')

/**
 * All commands
 */
export const userCommands: Commands = loadCommands('../commands')

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
