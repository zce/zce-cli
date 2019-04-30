const path = require('path')
const { system } = require('gluegun')
const pkg = require('../package.json')

const src = path.join(__dirname, '..')

const runCommand = async cmd => system.run(`node ${path.join(src, 'bin', 'zce')} ${cmd}`)

test('outputs version', async () => {
  const output = await runCommand('--version')
  expect(output).toContain(pkg.version)
})

test('outputs help', async () => {
  const output = await runCommand('--help')
  expect(output).toContain(pkg.version)
})

// test('generates file', async () => {
//   const output = await runCommand('generate foo')

//   expect(output).toContain('Generated file at models/foo-model.ts')
//   const foomodel = filesystem.read('models/foo-model.ts')

//   expect(foomodel).toContain(`module.exports = {`)
//   expect(foomodel).toContain(`name: 'foo'`)

//   // cleanup artifact
//   filesystem.remove('models')
// })
