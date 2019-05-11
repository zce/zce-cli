import { coreCommands } from './loader'

import { Context, Command } from './types'

/**
 * invoke command
 * @param cmd command
 * @param ctx context
 */
export const invoke = async (cmd: Command, ctx: Context) => {
  if (ctx.options.help || ctx.options.h) {
    // invoke help command
    cmd = coreCommands.help
  }
  process.title = `${cmd.name} · ${ctx.brand}`
  return await cmd.action(ctx)
}
