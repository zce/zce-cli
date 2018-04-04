const ora = require('ora')
const chalk = require('chalk')
const { got, logger } = require('../util')

/**
 * Fetch user's repos
 * @param {String} username GitHub username
 */
const fetchRepos = async username => {
  const res = await got(`https://api.github.com/users/${username}/repos`, {
    query: {
      client_id: '0cb723972877555ffb54',
      client_secret: 'ad0638a75ee90bb86c8b551f5f42f3a044725f38',
      per_page: 100
    },
    json: true
  })
  return res.body
}

/**
 * List available official templates
 * @param  {String}  username Username
 * @param  {Object}  options  Options
 * @param  {Boolean} options.short  Short mode
 */
module.exports = async (username = 'zce-templates', { short }) => {
  const spinner = ora('Loading available list from remote...')

  try {
    spinner.start()
    const repos = await fetchRepos(username)
    spinner.stop()

    if (!repos.length) {
      return logger.log('😞  No available templates')
    }

    if (short) {
      // short output
      return repos.forEach(item => logger.log(`→ ${username === 'zce-templates' ? item.name : item.full_name}`))
    }

    logger.log()
    logger.log(`👇  Available ${username === 'zce-templates' ? 'official' : username}'s templates:`)
    logger.log()
    repos.forEach(item => logger.log(`  ${chalk.yellow('→')} ${chalk.blue(username === 'zce-templates' ? item.name : item.full_name)} ${chalk.gray('-')} ${item.description}`))
    logger.log()
  } catch (e) {
    spinner.stop()
    logger.log(`😞  Failed to load list from remote: ${chalk.red(e.message)}`)
  }
}
