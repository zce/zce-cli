import { load } from './loader'
import { parse } from './parser'
import { invoke } from './invoker'

/**
 * Run the CLI
 * @param args command arguments
 */
export const run = async (args?: string[]): Promise<void> => {
  // default args
  args = args || process.argv.slice(2)

  // extract command name and extra args
  const [name, ...extras] = args

  // load command by name
  const cmd = await load(name)

  // top level command args
  if (['default', 'help', 'version'].includes(cmd.name)) {
    extras.unshift(name)
  }

  // parse cli context
  const ctx = await parse(extras, cmd.options)

  // invoke command
  await invoke(cmd, ctx)
}
