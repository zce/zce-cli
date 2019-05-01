import { stub, SinonStub } from 'sinon'
import { zce, version, help } from '../../src/common'
import { createFakeToolbox } from '../utils'

// #region zce command

test('unit:common:zce', async (): Promise<void> => {
  expect(zce.name).toBe('zce')
  expect(zce.alias).toBe(undefined)
  expect(zce.description).toBe(undefined)
  expect(zce.hidden).toBe(true)
  expect(zce.dashed).toBe(true)
  expect(typeof zce.run).toBe('function')
})

test('unit:common:zce:default-command', async (): Promise<void> => {
  const toolbox = createFakeToolbox()
  await zce.run(toolbox)
  const error = toolbox.print.error as SinonStub
  expect(error.notCalled).toBe(true)
})

test('unit:common:zce:unknown-command', async (): Promise<void> => {
  const toolbox = createFakeToolbox()
  toolbox.parameters.first = 'foo'
  await zce.run(toolbox)
  const error = toolbox.print.error as SinonStub
  expect(error.getCall(0).args[0]).toBe('Unknown command: `foo`.')
  expect(error.getCall(1).args[0]).toBe(
    'Type `zce --help` to view all commands.'
  )
})

// #endregion

// #region version command

test('unit:common:version', async (): Promise<void> => {
  expect(version.name).toBe('version')
  expect(version.alias).toBe(undefined)
  expect(version.description).toBe('Output the version number')
  expect(version.hidden).toBe(true)
  expect(version.dashed).toBe(true)
  expect(typeof version.run).toBe('function')
})

test('unit:common:version:default', async (): Promise<void> => {
  const toolbox = createFakeToolbox()
  await version.run(toolbox)
  const info = toolbox.print.info as SinonStub
  expect(info.getCall(0).args[0]).toBe('zce v0.1.0')
})

// #endregion

// #region help command

test('unit:common:help', async (): Promise<void> => {
  expect(help.name).toBe('help')
  expect(help.alias).toBe(undefined)
  expect(help.description).toBe('Output usage information')
  expect(help.hidden).toBe(true)
  expect(help.dashed).toBe(true)
  expect(typeof help.run).toBe('function')
})

test('unit:common:help:default', async (): Promise<void> => {
  const toolbox = createFakeToolbox()
  toolbox.help = stub()
  await help.run(toolbox)
  const h = toolbox.help as SinonStub
  expect(h.getCall(0).args[0].usage).toBe('zce <command> [options]')
})

// #endregion
