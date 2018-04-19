const inquirer = require('inquirer')

const mockPrompt = require('./mock-prompt')

// const sleep = timeout => new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve(Date.now())
//   }, timeout)
// })

const main = async () => {
  // const { sure } = await inquirer.prompt([
  //   {
  //     name: 'name',
  //     type: 'input',
  //     message: 'What\'s your name?'
  //   },
  //   {
  //     name: 'sure',
  //     type: 'confirm',
  //     default: async answers => {
  //       const now = await sleep(2000)
  //       console.log(now)
  //       return now % 2
  //     },
  //     message: 'Generate project in current directory?'
  //   }
  // ])

  // console.log(sure)

  mockPrompt({
    sure: true
  })

  const { sure } = await inquirer.prompt({
    name: 'sure',
    type: 'confirm',
    message: 'Generate project in current directory?'
  })

  console.log(sure)

  const { ok } = await inquirer.prompt({
    name: 'ok',
    type: 'confirm',
    message: 'Generate project in current directory?'
  })

  console.log(ok)
}

main()
