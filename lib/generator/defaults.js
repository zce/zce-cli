/**
 * TODO: demand loading
 * https://github.com/SBoudrias/Inquirer.js#question
 * default, choices(if defined as functions), validate, filter and when functions can be called asynchronously.
 * Either return a promise or use this.async() to get a callback you'll call with the final value.
 */

const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')
const { promisify } = require('util')

const rc = require('rc')
const mkdirp = require('mkdirp')
const fullname = require('fullname')
const username = require('username')

const { util } = require('../common')

const writeFile = promisify(fs.writeFile)
const mkdir = promisify(mkdirp)

const npmrc = rc('npm')
const yarnrc = rc('yarn')

/**
 * Execute a command return result
 * @param {String} command command text
 * @param {String} cwd     cwd path (optional)
 */
const execute = (command, cwd) => new Promise(resolve => {
  // istanbul ignore next
  cwd = cwd || process.cwd()
  exec(command, { cwd }, (err, stdout, stderr) => {
    // istanbul ignore if
    if (err) return resolve()
    resolve(stdout.toString().trim())
  })
})

/**
 * All prompt defaults
 * @param {string} dest destination path
 */
class Defaults {
  constructor (dest) {
    if (typeof dest !== 'string') {
      throw new TypeError(`Expected a string, got ${typeof dest}`)
    }

    this.dest = dest

    // last remember answers
    Object.assign(this, require(util.getDataPath('generator', 'config.json')))
  }

  name (answers) {
    return path.basename(this.dest)
  }

  async username (answers) {
    // npm > yarn > git > system
    // istanbul ignore next
    const name = npmrc['init-author-name'] || yarnrc['init-author-name'] || await execute('git config --get user.name') || await username()
    return name
  }

  async fullname (answers) {
    const name = await fullname()
    return name
  }

  async email (answers) {
    // npm > yarn > git
    // istanbul ignore next
    const email = npmrc['init-author-email'] || yarnrc['init-author-email'] || await execute('git config --get user.email')
    return email
  }

  async url (answers) {
    // npm > yarn > git
    // istanbul ignore next
    const url = npmrc['init-author-url'] || yarnrc['init-author-url'] || await execute('git config --get user.url')
    return url
  }

  async author (answers) {
    // istanbul ignore next
    const name = await this.username() || await this.fullname()
    const email = await this.email()
    const url = await this.url()

    // istanbul ignore next
    return `${name}${email ? ` <${email}>` : ''}${url ? ` (${url})` : ''}`
  }

  version (answers) {
    // istanbul ignore next
    return npmrc['init-version'] || yarnrc['init-version'] || '0.1.0'
  }

  license (answers) {
    // istanbul ignore next
    return npmrc['init-license'] || yarnrc['init-license'] || 'MIT'
  }

  async repository (answers) {
    const repo = await execute('git config --local --get remote.origin.url', this.dest)
    return repo
  }

  static async save (answers) {
    // delete ignore
    delete answers.name
    delete answers.repo
    delete answers.repository

    const json = JSON.stringify(answers, null, 2)
    await mkdir(util.getDataPath('generator'))
    await writeFile(util.getDataPath('generator', 'config.json'), json)
  }
}

// alias
Defaults.prototype.repo = Defaults.prototype.repository

// export
module.exports = Defaults
