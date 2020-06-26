import { invokeHelp } from './commands/help'
import { Context, Command } from './types'

/**
 * invoke command
 * @param cmd command
 * @param ctx context
 */
export const invoke = async (cmd: Command, ctx: Context): Promise<void> => {
  if (cmd.name !== 'unknown' && (ctx.options.help || ctx.options.h)) {
    return await invokeHelp(cmd, ctx)
  }

  // set process title
  process.title = `${cmd.name} · ${ctx.bin}`

  // invoke action
  await cmd.action(ctx)
}
