import { sniff, run, file } from './core'

// check the node version
sniff()

console.log(file.rimraf)
console.log(file.mkdirp)
console.log(file.tildify)
console.log(file.untildify)

// // Prevent caching of this module so module.parent is always accurate
// delete require.cache[__filename]
// global['parentDir'] = module.parent ? dirname(module.parent.filename) : ''

export { run }
