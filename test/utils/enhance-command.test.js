import test from 'ava'
import sinon from 'sinon'

import enhanceCommand from '../../lib/utils/enhance-command'
import commander from 'commander'

test.beforeEach(t => {
  t.context.error = console.error
  console.error = sinon.spy()
  t.context.exit = process.exit
  process.exit = sinon.spy()
})

test.afterEach(t => {
  console.error = t.context.error
  process.exit = t.context.exit
})

test('utils:enhance-commander:before-enhance', t => {
  const command = new commander.Command()
  command.unknownOption()
  t.is(process.exit.lastCall.args[0], 1)

  command._allowUnknownOption = true
  command.unknownOption()
  t.is(process.exit.callCount, 1)

  command.missingArgument()
  t.is(process.exit.lastCall.args[0], 1)

  command.optionMissingArgument({})
  t.is(process.exit.lastCall.args[0], 1)

  command.variadicArgNotLast()
  t.is(process.exit.lastCall.args[0], 1)
})

test('utils:enhance-commander:after-enhance', t => {
  enhanceCommand(commander)
  const command = new commander.Command()
  command.unknownOption()
  t.is(console.error.lastCall.args[0], 'Unknown option: `%s`.')

  command._allowUnknownOption = true
  command.unknownOption()
  t.is(process.exit.callCount, 5)

  command.missingArgument()
  t.is(console.error.lastCall.args[0], 'Missing required argument: `%s`.')

  command.optionMissingArgument({})
  t.is(console.error.lastCall.args[0], 'Missing required argument for option: `%s`.')

  command.optionMissingArgument({}, true)
  t.is(console.error.lastCall.args[0], 'Missing required argument for option: `%s`, got `%s`')

  command.variadicArgNotLast()
  t.is(console.error.lastCall.args[0], 'Variadic arguments must be last: `%s`.')
})
