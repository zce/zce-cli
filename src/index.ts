// https://github.com/TypeStrong/ts-node#help-my-types-are-missing
// https://stackoverflow.com/questions/51610583/ts-node-ignores-d-ts-files-while-tsc-successfully-compiles-the-project
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="types.d.ts" />

import { sniff, run } from './core'

// check the node version
sniff()

// // Prevent caching of this module so module.parent is always accurate
// delete require.cache[__filename]
// global['parentDir'] = module.parent ? dirname(module.parent.filename) : ''

export { run }
