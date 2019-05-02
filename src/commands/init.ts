import { GluegunCommand, GluegunToolbox } from 'gluegun'
import { HelpMessage } from '../types'

const description = 'Generate a new project from a template'

const helpMessage: HelpMessage = {
  description,
  usage: 'zce init <template> [project]',
  options: {
    '-v, --verbose': 'Enable verbose output'
  },
  examples: [
    '# create a new project with an official template',
    '$ zce init <template> [project]',
    '# create a new project straight from a github template',
    '$ zce init <username>/<repo> [project]'
  ]
}

const command: GluegunCommand = {
  name: 'init',
  description,
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    if (toolbox.parameters.options.help || toolbox.parameters.options.h) {
      return toolbox.help(helpMessage)
    }

    // const { parameters, template, print } = toolbox
    // const name = parameters.first
    // await template.generate({
    //   template: 'model.ts.ejs',
    //   target: `models/${name}-model.ts`,
    //   props: { name }
    // })
    // print.info(`Generated file at models/${name}-model.ts`)

    toolbox.print.success('Generate a new project from a template')
  }
}

export default command
