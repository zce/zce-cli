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
      const command = require(join(commandDir, item)).default as Command
      cmds[command.name] = command
      if (typeof command.alias === 'string') {
        cmds[command.alias] = command
      } else if (command.alias) {
        command.alias.forEach(a => { cmds[a] = command })
      }
    } catch {}
    return cmds
  }, {} as Record<string, Command>)
}

/**
 * All commands
 */
export const commands: Record<string, Command> = {
  ...loadCommands('./commands'),
  ...loadCommands('../commands')
}

/**
 * Load command by name
 * @param name command name
 */
export const load = async (name?: string): Promise<Command> => {
  // try to load command
  if (name && commands[name]) {
    return commands[name]
  }

  // fallback unknown command
  return commands.unknown
}
