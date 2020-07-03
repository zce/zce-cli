export * as file from './file'
export * as http from './http'
export * as system from './system'
export * as config from './config'
export * as logger from './logger'
export * as template from './template'
export { ware } from './ware'
export { prompt } from './prompt'
export { unknownCommand, missingArgument } from './error'

// // Load on demand
// export default new Proxy({}, {
//   get: (target, cmd) => require(`./${cmd.toString()}`)
// })
