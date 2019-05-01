import { build, GluegunToolbox } from 'gluegun'

export default async (argv?: string[]): Promise<GluegunToolbox> => {
  // create a CLI runtime
  const cli = build()
    .brand('zce')
    .exclude(['config', 'semver', 'http', 'strings', 'system', 'patching'])
    .src(__dirname)
    .help()
    .version()
    .create()

  // and run CLI
  const toolbox = await cli.run(argv)

  // send it back (for testing, mostly)
  return toolbox
}

// .exclude(['config', 'filesystem', 'semver', 'http', 'parameters', 'print', 'prompt', 'strings', 'system', 'template', 'patching'])
// .plugins('node_modules', { matching: 'zce-cli-*', hidden: true })
// {
//   name: 'help',
//   dashed: true,
//   description: 'Output all commands',
//   run: async (toolbox: GluegunToolbox): Promise<void> => {
//     toolbox.print.printHelp(toolbox)
//   }
// }
