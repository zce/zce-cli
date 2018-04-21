const os = require('os')
const path = require('path')

const pkg = require('../../package')

exports.getName = () => {
  let name = Object.keys(pkg.bin)[0] || 'zce'

  // istanbul ignore else
  if (process.env.NODE_ENV === 'test') {
    name += '-test'
  }

  return name
}

exports.getVersion = () => {
  return pkg.version
}

exports.getDataPath = (...args) => {
  return path.join(os.homedir(), '.config', exports.getName(), ...args)
}

exports.getTempPath = (...args) => {
  return path.join(os.tmpdir(), exports.getName(), ...args)
}
