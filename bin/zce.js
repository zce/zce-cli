#!/usr/bin/env node

var fs = require('fs')
var path = require('path')

// check if we're running in dev mode
var devMode = fs.existsSync(path.join(__dirname, '../src'))
// or want to "force" running the compiled version with --compiled-build
var wantsCompiled = process.argv.indexOf('--compiled-build') >= 0

var cli

if (wantsCompiled || !devMode) {
  // import cli from the compiled
  cli = require('../lib')
} else {
  // hook into ts-node so we can run typescript on the fly
  require('ts-node').register({
    project: path.join(__dirname, '../tsconfig.json')
  })
  // import cli from the source
  cli = require('../src')
}

// run the CLI with the current process arguments
cli.run(process.argv.slice(2))
