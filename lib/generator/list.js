const ora = require('ora')
const chalk = require('chalk')

const options = {
  headers: {
    accept: 'application/json'
  },
  query: {
    client_id: '0cb723972877555ffb54',
    client_secret: 'ad0638a75ee90bb86c8b551f5f42f3a044725f38',
    per_page: 100,
    page: 1
  }
}

const spinner = ora('Loading available list from remote...')

/**
 * List command
 * @param  {String}  username Username
 * @param  {Boolean} short    Short mode
 * @return {Promise}          List promise
 */
module.exports = (username, short) => {
  username = username || 'zce-templates'

  console.log() // padding
  spinner.start()

  return got(`https://api.github.com/users/${username}/repos`, options)
    .then(res => {
      spinner.stop()

      const repos = JSON.parse(res.body)
      // // TODO: When will this happen?
      // if (repos.message) throw new Error(repos.message)

      if (!repos.length) {
        logger.log('Not found available\n')
        return repos
      }

      if (short) {
        repos.forEach(repo => logger.log(chalk.blue(repo.name)))
      } else {
        logger.log('👇  Available official templates:')
        logger.log() // padding
        repos.forEach(repo => logger.log(`  ${chalk.yellow('→')} ${chalk.blue(repo.name)} ${chalk.gray('-')} ${repo.description}`))
      }

      logger.log() // padding
      return repos
    })
    .catch(err => {
      spinner.stop()
      logger.fatal(`😞  Failed to load list from remote: ${chalk.red(err.message)}`, err)
    })
}
