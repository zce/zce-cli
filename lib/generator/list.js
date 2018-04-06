/**
 * List command action
 */

const ora = require('ora')
const chalk = require('chalk')

const util = require('./util')

/**
 * Fetch user's repos
 * @param {String} username GitHub username
 */
const fetchRepos = async username => {
  const res = await util.got(`https://api.github.com/users/${username}/repos`, {
    query: {
      client_id: '0cb723972877555ffb54',
      client_secret: 'ad0638a75ee90bb86c8b551f5f42f3a044725f38',
      per_page: 100
    }
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
      return util.log('😞  No available templates.')
    }

    if (short) {
      // short output
      return repos.forEach(item => util.log(`→ ${username === 'zce-templates' ? item.name : item.full_name}`))
    }

    util.log()
    util.log(`👇  Available ${username === 'zce-templates' ? 'official' : username}'s templates:`)
    util.log()
    repos.forEach(item => util.log(`  ${chalk.yellow('→')} ${chalk.blue(username === 'zce-templates' ? item.name : item.full_name)} ${chalk.gray('-')} ${item.description}`))
    util.log()
  } catch (e) {
    spinner.stop()
    util.log(`😞  Failed to load list from remote: ${chalk.red(e.message)}.`)
  }
}
