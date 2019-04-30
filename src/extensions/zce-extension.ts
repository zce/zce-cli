import { GluegunToolbox } from 'gluegun'
import * as zce from 'zce'

// add your CLI-specific functionality here, which will then be accessible
// to your commands
module.exports = (toolbox: GluegunToolbox) => {
  toolbox.zce = process.env.NODE_ENV !== 'test' ? zce : () => {}

  // enable this if you want to read configuration in from
  // the current folder's package.json (in a "zce" property),
  // zce.config.json, etc.
  // toolbox.config = {
  //   ...toolbox.config,
  //   ...toolbox.config.loadConfig(process.cwd(), "zce")
  // }
}
