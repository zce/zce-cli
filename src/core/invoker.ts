import { invokeHelp } from './commands/help'
import { Command } from './loader'
import { Context } from './parser'

/**
 * invoke command
 * @param cmd command
 * @param ctx context
 */
export const invoke = async (cmd: Command, ctx: Context): Promise<void> => {
  if (cmd.name !== 'unknown' && ctx.options.help as boolean) {
    return await invokeHelp(cmd, ctx)
  }

  // set process title
  process.title = `${cmd.name} · ${ctx.bin}`

  // invoke action
  await cmd.action(ctx)
}
