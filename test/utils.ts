import { join } from 'path'
import execa, { ExecaChildProcess } from 'execa'

import { Command, Context } from '../src/core/types'

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
  return await execa(join(__dirname, '../bin/zce.js'), args)
}

/**
 * Create a fake command
 * @param overrides override default
 */
export const createFakeCommand = (overrides?: Command): Command => {
  const defaultCommand = {
    name: 'fake',
    description: 'fake command',
    usage: 'fake [options]',
    action: jest.fn()
  }
  return Object.assign(defaultCommand, overrides)
}

/**
 * Create a fake context
 * @param overrides override default
 */
export const createFakeContext = (overrides?: Record<string, unknown>): Context => {
  const defaultContext = {
    brand: 'zce',
    options: {},
    extras: [],
    input: [],
    pkg: {
      name: 'zce-cli',
      version: '0.1.0'
    }
  }
  return Object.assign(defaultContext, overrides)
}

export { execa }
