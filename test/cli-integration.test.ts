const path = require('path')
const { filesystem, system } = require('gluegun')
const pkg = require('../package.json')

const runCommand = async cmd => system.run(`node ${path.join(__dirname, '../bin/zce')} ${cmd}`)

test('integration:version-command', async () => {
  const output = await runCommand('--version')
  expect(output).toContain(pkg.version)
})

test('integration:help-command', async () => {
  const output = await runCommand('--help')
  expect(output).toContain(pkg.version)
})

test('integration:default-command', async () => {
  const output = await runCommand('zce')
  expect(output).toBe('')
})

test('integration:hello-command', async () => {
  const output = await runCommand('hello')
  expect(output).toContain('Hello from an extension!')
  expect(output).toContain('Hello, world!')
})

test('integration:generate-command', async () => {
  const output = await runCommand('generate foo')
  expect(output).toContain('Generated file at models/foo-model.ts')
  
  const content = filesystem.read('models/foo-model.ts')
  expect(content).toContain(`module.exports = {`)
  expect(content).toContain(`name: 'foo'`)

  // cleanup artifact
  filesystem.remove('models')
})
