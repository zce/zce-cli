/**
 * TODO: demand loading
 * https://github.com/SBoudrias/Inquirer.js#question
 * default, choices(if defined as functions), validate, filter and when functions can be called asynchronously.
 * Either return a promise or use this.async() to get a callback you'll call with the final value.
 */

const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const rc = require('rc')
const fullname = require('fullname')
const username = require('username')

const { util } = require('../common')

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const npmrc = rc('npm')
const yarnrc = rc('yarn')

const getLatestAnswers = async () => {
  try {
    const filename = util.getDataPath('generator', 'answers.json')
    const json = await readFile(filename, 'utf8')
    return JSON.parse(json)
  } catch (e) {
    // istanbul ignore next
    return {}
  }
}

class Defaults {
  constructor (dest, defaults) {
    this.dest = dest
    // last remember answers
    Object.assign(this, defaults)
  }

  name (answers) {
    return path.basename(this.dest)
  }

  async username (answers) {
    // npm > yarn > git > system
    // istanbul ignore next
    const name = npmrc['init-author-name'] || yarnrc['init-author-name'] || await util.execute('git config --get user.name') || await username()
    return name
  }

  async fullname (answers) {
    const name = await fullname()
    return name
  }

  async email (answers) {
    // npm > yarn > git
    // istanbul ignore next
    const email = npmrc['init-author-email'] || yarnrc['init-author-email'] || await util.execute('git config --get user.email')
    return email
  }

  async url (answers) {
    // npm > yarn > git
    // istanbul ignore next
    const url = npmrc['init-author-url'] || yarnrc['init-author-url'] || await util.execute('git config --get user.url')
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
    const repo = await util.execute('git config --local --get remote.origin.url', this.dest)
    return repo
  }

  /**
   * Init new defaults.
   * @param {String} dest destination path
   */
  static async init (dest) {
    if (typeof dest !== 'string') {
      throw new TypeError(`Expected a string, got ${typeof dest}`)
    }

    const defaults = await getLatestAnswers()

    return new Defaults(dest, defaults)
  }

  /**
   * Save prompt answers.
   * @param {Object} answers prompt answers
   */
  static async save (answers) {
    // merge
    const defaults = await getLatestAnswers()
    Object.assign(defaults, answers)

    // delete ignore
    delete defaults.name
    delete defaults.description
    delete defaults.repo
    delete defaults.repository

    // save
    const json = JSON.stringify(defaults, null, 2)
    await util.mkdirp(util.getDataPath('generator'))
    await writeFile(util.getDataPath('generator', 'answers.json'), json)
  }
}

// alias
Defaults.prototype.repo = Defaults.prototype.repository

// export
module.exports = Defaults
