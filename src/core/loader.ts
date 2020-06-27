import { join } from 'path'
import { readdirSync } from 'fs'
import { Command } from './types'

/**
 * Load dir commands
 * @param dir dir to load
 */
export const loadCommands = (dir: string): Record<string, Command> => {
  const commandDir = join(__dirname, dir)

  // scanning commands
  return readdirSync(commandDir).reduce((cmds, item) => {
    try {
      const { default: mod } = require(join(commandDir, item))

      // ignore not command
      if (typeof mod === 'undefined' || typeof mod.name !== 'string' || typeof mod.action !== 'function') return cmds

      const cmd = mod as Command

      cmds[cmd.name] = cmd
      if (typeof cmd.alias === 'string') {
        cmds[cmd.alias] = cmd
      } else if (cmd.alias) {
        cmd.alias.forEach(a => {
          cmds[a] = cmd
        })
      }
    } catch {}
    // } catch (e) { console.error(e) }
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
