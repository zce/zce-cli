import { join } from 'path'
import * as execa from 'execa'
import * as sinon from 'sinon'
import { Command, Context } from '../src/core/types'

/**
 * Executes a commandline via execa.
 * @param args The command line arguments
 * @returns Promise with result
 */
export const runCommand = async (
  args?: string | string[]
): Promise<execa.ExecaReturns> => {
  if (typeof args === 'string') {
    args = [args]
  }
  // args && args.push('--compiled-build')
  return execa(join(__dirname, '../bin/zce.js'), args)
}

/**
 * Create a fake command
 * @param options override default
 */
export const createFakeCommand = (options?: {
  [key: string]: any
}): Command => {
  return Object.assign(
    {
      name: 'fake',
      description: 'fake command',
      usage: 'fake [options]',
      action: sinon.stub()
    },
    options
  )
}

/**
 * Create a fake context
 * @param options override default
 */
export const createFakeContext = (options?: {
  [key: string]: any
}): Context => {
  return Object.assign(
    {
      brand: 'zce',
      options: {},
      extras: [],
      input: [],
      pkg: {}
    },
    options
  )
}

export { execa, sinon }
