import { GluegunToolbox } from 'gluegun'

// add your CLI-specific functionality here, which will then be accessible
// to your commands
export default async (toolbox: GluegunToolbox): Promise<void> => {
  toolbox.hello = (name: string): void => {
    toolbox.print.info(toolbox.print.colors.rainbow(`Hey ${name}~`))
  }

  // enable this if you want to read configuration in from
  // the current folder's package.json (in a "zce" property),
  // zce.config.json, etc.
  // toolbox.config = {
  //   ...toolbox.config,
  //   ...toolbox.config.loadConfig(process.cwd(), "zce")
  // }
}
