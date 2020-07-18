import { load } from './loader'
import { parse } from './parser'
import { invoke } from './invoker'

/**
 * Extract command name and extra args.
 * @param args command arguments
 */
export const extract = (args: string[]): [string, string[]] => {
  // // help command
  // // e.g. '$ zce --help' | '$ zce -h' | '$ zce foo --help' | '$ zce foo -h'
  // if (args.includes('--help') || args.includes('-h')) return ['help', args]

  const [first, ...rest] = args

  if (first != null) {
    // sub command
    // e.g. '$ zce foo'
    if (!first.startsWith('-')) return [first, rest]

    // help command
    // e.g. '$ zce --help' | '$ zce -h'
    if (['--help', '-h'].includes(first)) return ['help', args]

    // version command
    // e.g. '$ zce --version' | '$ zce -h'
    if (['--version', '-v'].includes(first)) return ['version', args]
  }

  // default command
  // e.g. '$ zce' | '$ zce --other'
  return ['default', args]
}

/**
 * Run this program.
 * @param args command arguments
 */
export const run = async (args?: string[]): Promise<void> => {
  // default args
  args = args ?? process.argv.slice(2)

  // extract command name
  const [name, argv] = extract(args)

  // load command by name
  const cmd = await load(name)

  // unknown command name
  if (cmd.name === 'unknown') {
    argv.unshift(name)
  }

  // parse cli context
  const ctx = await parse(argv, cmd.options)

  // invoke command action
  await invoke(cmd, ctx)
}
