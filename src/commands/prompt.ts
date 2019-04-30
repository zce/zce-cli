import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'prompt',
  description: 'Runs through a kitchen sink of Gluegun tools',
  run: async (toolbox: GluegunToolbox) => {
    const { print, prompt } = toolbox

    const result = await prompt.ask([
      {
        type: 'select',
        name: 'exselect',
        message: 'What shoes are you wearing?',
        choices: ['Clown', 'Other']
      },
      {
        type: 'confirm',
        name: 'exconfirm',
        message: 'Are you sure?'
      },
      {
        type: 'multiselect',
        name: 'exmultiselect',
        message: 'What are your favorite colors?',
        choices: ['red', 'blue', 'yellow']
      },
      {
        type: 'select',
        name: 'exselect',
        message: 'What is your favorite team?',
        choices: ['Jazz', 'Trail Blazers', 'Lakers', 'Warriors']
      },
      {
        type: 'multiselect',
        name: 'exmultiselect',
        message: 'What are your favorite months?',
        choices: ['January', 'July', 'September', 'November']
      },
      {
        type: 'password',
        name: 'expassword',
        message: 'Enter a fake password'
      },
      {
        type: 'input',
        name: 'exinput',
        message: 'What is your middle name?'
      },
      {
        type: 'autocomplete',
        name: 'exautocomplete',
        message: 'State?',
        choices: ['Oregon', 'Washington', 'California'],
        // You can leave this off unless you want to customize behavior
        suggest(s, choices) {
          return choices.filter(choice => {
            return choice.message.toLowerCase().startsWith(s.toLowerCase())
          })
        }
      }
    ])

    print.debug(result)
  }
}
