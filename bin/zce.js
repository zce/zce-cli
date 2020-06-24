#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// process arguments
const args = process.argv.slice(2)

// check if we're running in dev mode
const devMode = fs.existsSync(path.join(__dirname, '../src'))
// or want to "force" running the compiled version with --compiled-build
const wantsCompiled = args.indexOf('--compiled-build') >= 0

if (wantsCompiled || !devMode) {
  // import cli from the compiled
  // run the CLI with the current process arguments
  require('../lib').run(args)
} else {
  // hook into ts-node so we can run typescript on the fly
  require('ts-node').register({
    project: path.join(__dirname, '../tsconfig.json')
  })

  // import cli from the source
  // run the CLI with the current process arguments
  require('../src').run(args)
}
