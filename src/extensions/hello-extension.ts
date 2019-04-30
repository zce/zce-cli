import { GluegunToolbox } from 'gluegun'

// add your CLI-specific functionality here, which will then be accessible
// to your commands
module.exports = async (toolbox: GluegunToolbox): Promise<void> => {
  toolbox.hello = (): void => {
    toolbox.print.info('Hello from an extension!')
  }

  // enable this if you want to read configuration in from
  // the current folder's package.json (in a "zce" property),
  // zce.config.json, etc.
  // toolbox.config = {
  //   ...toolbox.config,
  //   ...toolbox.config.loadConfig(process.cwd(), "zce")
  // }
}
