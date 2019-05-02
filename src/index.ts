import { build, GluegunToolbox } from 'gluegun'
import { zce, version, help } from './common'

// disable colors output for testing
if (process.env.NODE_ENV === 'test') {
  require('gluegun/build/toolbox/print-tools').print.colors.disable()
}

export default async (argv?: string[]): Promise<GluegunToolbox> => {
  // create a CLI runtime
  const cli = build()
    .brand('zce')
    .exclude(['config', 'semver', 'http', 'strings', 'system', 'patching'])
    .src(__dirname)
    .defaultCommand(zce)
    .version(version)
    .help(help)
    .create()

  // and run the CLI
  const toolbox = await cli.run(argv)

  // send it back (for testing, mostly)
  return toolbox
}
