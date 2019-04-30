import { GluegunToolbox } from 'gluegun'
import * as zce from 'zce'

module.exports = {
  name: 'zce',
  run: async (toolbox: GluegunToolbox) => {
    zce()
  }
}
