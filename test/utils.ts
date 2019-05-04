import { join } from 'path'
import * as execa from 'execa'
export { stub, SinonStub } from 'sinon'

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
  return execa(join(__dirname, '../bin/zce.js'), args)
}
