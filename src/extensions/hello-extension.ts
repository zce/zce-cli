import { GluegunToolbox } from 'gluegun'

module.exports = async (toolbox: GluegunToolbox) => {
  toolbox.hello = () => {
    toolbox.print.info('Hello from an extension!')
  }
}