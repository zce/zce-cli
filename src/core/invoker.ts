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
    return await coreCommands.help.action(ctx)
  }
  return await cmd.action(ctx)
}
