const ora = require('ora')
const chalk = require('chalk')

const { http, logger } = require('../helpers')

/**
 * Fetch user's repos
 * @param {string} username github username
 */
const fetch = async username => {
  const response = await http.request(`https://api.github.com/users/${username}/repos`, {
    query: {
      client_id: '0cb723972877555ffb54',
      client_secret: 'ad0638a75ee90bb86c8b551f5f42f3a044725f38',
      per_page: 200,
      sort: 'updated',
      direction: 'desc'
    },
    timeout: 10000
  })
  return response.body
}

/**
 * List available official templates
 * @param  {string}  username username
 * @param  {Object}  options  options
 * @param  {boolean} options.json  enable json output
 * @param  {boolean} options.short  enable short mode
 */
module.exports = async (username = 'zce-templates', { json, short } = {}) => {
  const spinner = ora('Loading available list from remote...')
  spinner.start()

  try {
    const repos = await fetch(username)
    spinner.stop()

    // no repos
    if (!repos || !repos.length) {
      return logger.warn('No available templates.')
    }

    // json output
    if (json) {
      const json = JSON.stringify(repos.map(item => ({
        name: username === 'zce-templates' ? item.name : item.full_name,
        description: item.description
      })))
      return logger.log(json)
    }

    // short output
    if (short) {
      return repos.forEach(item => logger.log(`→ ${username === 'zce-templates' ? item.name : item.full_name}`))
    }

    // full output
    logger.success(`Available ${username === 'zce-templates' ? 'official' : username}'s templates:`)
    repos.forEach(item => logger.log(` ${chalk.yellow('→')} ${chalk.blue(username === 'zce-templates' ? item.name : item.full_name)} ${chalk.gray('-')} ${item.description}`))
  } catch (e) {
    if (e.statusCode === 404) {
      return spinner.fail(`Username does not exist: \`${chalk.red(username)}\``)
    }
    spinner.fail(`Failed to load list from remote: ${chalk.red(e.message)}.`)
  }
}
