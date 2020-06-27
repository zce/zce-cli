import path from 'path'
import execa, { ExecaChildProcess } from 'execa'

import { Command, Context } from '../src/core/types'

export { execa }

/**
 * Executes a commandline via execa.
 * @param args The command line arguments
 * @returns Promise with result
 */
export const runCommand = async (args: string | string[] = []): Promise<ExecaChildProcess> => {
  if (typeof args === 'string') {
    args = [args]
  }
  // // test compiled
  // args && args.push('--compiled-build')
  return await execa(path.join(__dirname, '../bin/zce.js'), args)
}

/**
 * Create a fake command for testing.
 * @param overrides override default
 */
export const createFakeCommand = (overrides?: Record<string, unknown>): Command => {
  return Object.assign(
    {
      name: 'fake',
      description: 'fake command',
      usage: 'fake [options]',
      action: jest.fn()
    },
    overrides
  )
}

/**
 * Create a fake context for testing.
 * @param overrides override default
 */
export const createFakeContext = (overrides?: Record<string, unknown>): Context => {
  return Object.assign(
    {
      bin: 'zce',
      options: {},
      extras: [],
      inputs: [],
      pkg: {
        name: 'zce-cli',
        version: '0.1.0'
      }
    },
    overrides
  )
}
