import { load } from './loader'
import { parse } from './context'
import { invoke } from './invoker'

const defaultCommands = ['default', 'help', 'version']

export const run = async (argv?: string[]): Promise<any> => {
  // default argv
  argv = argv || process.argv.slice(2)

  // load command by name
  const cmd = await load(argv)

  // extract command name and extra args
  const [name, ...extras] = argv

  // default command args
  if (defaultCommands.includes(cmd.name)) {
    extras.unshift(name)
  }

  // parse cli context
  const ctx = await parse(extras, cmd.options)

  // invoke command
  return await invoke(cmd, ctx)
}
