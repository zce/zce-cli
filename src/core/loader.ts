import { join } from 'path'
import { readdirSync } from 'fs'
import { Command } from './types'

/**
 * Load dir commands
 * @param dir dir to load
 */
const loadCommands = (dir: string): Record<string, Command> => {
  const commandDir = join(__dirname, dir)

  // scanning commands
  return readdirSync(commandDir).reduce((cmds, item) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
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
  }, {} as Record<string, Command>)
}

/**
 * All core commands
 */
export const coreCommands: Record<string, Command> = loadCommands('./commands')

/**
 * All commands
 */
export const userCommands: Record<string, Command> = loadCommands('../commands')

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
