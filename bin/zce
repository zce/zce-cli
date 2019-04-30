#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// check if we're running in dev mode
const devMode = fs.existsSync(path.join(__dirname, '../src'))
// or want to "force" running the compiled version with --compiled-build
const wantsCompiled = process.argv.indexOf('--compiled-build') >= 0

let cli

if (wantsCompiled || !devMode) {
  // import cli from the compiled
  cli = require(path.join(__dirname, '../lib')).default
} else {
  // hook into ts-node so we can run typescript on the fly
  require('ts-node').register({ project: path.join(__dirname, '../tsconfig.json') })
  // import cli from the source
  cli = require(path.join(__dirname, '../src')).default
}

// run the CLI with the current process arguments
cli(process.argv)
