import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'init',
  alias: [],
  description: 'Generate a new project from a template',
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    // const { parameters, template, print } = toolbox
    // const name = parameters.first
    // await template.generate({
    //   template: 'model.ts.ejs',
    //   target: `models/${name}-model.ts`,
    //   props: { name }
    // })
    // print.info(`Generated file at models/${name}-model.ts`)
    toolbox.print.info('Generate a new project from a template')
  }
}
