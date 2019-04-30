import { build, GluegunToolbox } from 'gluegun'

/**
 * Create the cli and kick it off
 */
export default async (argv?: string[]): Promise<GluegunToolbox> => {
  // create a CLI runtime
  const cli = build()
    .brand('zce')
    .exclude(['config', 'semver', 'http', 'strings', 'system', 'patching'])
    // .exclude(['config', 'filesystem', 'semver', 'http', 'parameters', 'print', 'prompt', 'strings', 'system', 'template', 'patching'])
    .src(__dirname)
    // .plugins('node_modules', { matching: 'zce-cli-*', hidden: true })
    .help()
    .version()
    .create()

  // and run it
  const toolbox = await cli.run(argv)

  // send it back (for testing, mostly)
  return toolbox
}
