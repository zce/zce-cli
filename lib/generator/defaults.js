const path = require('path')
const { execSync } = require('child_process')

const rc = require('rc')
const fullname = require('fullname')
const username = require('username')

// execute command
const exec = (command, cwd) => {
  try {
    cwd = cwd || process.cwd()
    return execSync(command, { cwd }).toString().trim()
  } catch (e) {}
}

/**
 * Default variables
 */
module.exports = class Defaults {
  constructor (target, npmrc, yarnrc, fullname, username) {
    this.target = target
    this.npmrc = npmrc
    this.yarnrc = yarnrc
    this.fullname = fullname
    this.username = username
  }

  get name () {
    return path.basename(this.target)
  }

  get author () {
    const name = this.npmrc['init-author-name'] || this.yarnrc['init-author-name']
    const email = this.npmrc['init-author-email'] || this.yarnrc['init-author-email']
    const url = this.npmrc['init-author-url'] || this.yarnrc['init-author-url']
    return `${name}${email ? ` <${email}>` : ''}${url ? ` (${url})` : ''}`
  }

  get version () {
    return this.npmrc['init-version'] || this.yarnrc['init-version'] || '0.1.0'
  }

  get license () {
    return this.npmrc['init-license'] || this.yarnrc['init-license'] || 'MIT'
  }

  get repository () {
    return exec('git config --local --get remote.origin.url', this.target)
  }

  get (key) {
    return key in this ? this[key] : undefined
  }

  static async init (target) {
    return new Defaults(target, rc('npm'), rc('yarn'), await fullname(), await username())
  }
}
