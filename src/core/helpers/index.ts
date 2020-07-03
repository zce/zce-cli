export * as file from './file'
export * as http from './http'
export * as config from './config'
export { prompt } from './prompt'
export * as system from './system'
export * as logger from './logger'
export * as template from './template'
export { ware } from './ware'

// // Load on demand
// export default new Proxy({}, {
//   get: (target, cmd) => require(`./${cmd.toString()}`)
// })
