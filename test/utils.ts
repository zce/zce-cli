import { join } from 'path'
import { strings } from 'gluegun'
import { Toolbox } from 'gluegun/build/domain/toolbox'
import * as sinon from 'sinon'

export const createFakeToolbox = (): Toolbox => {
  const toolbox = new Toolbox()
  toolbox.pluginName = 'zce'
  toolbox.meta = {
    src: join(__dirname, '../src'),
    version: sinon.stub().returns('0.1.0'),
    commandInfo: sinon.stub()
  }
  // toolbox.config = null
  toolbox.filesystem = {
    resolve: sinon.stub(),
    dir: sinon.stub(),
    chmodSync: sinon.stub(),
    rename: sinon.stub(),
    exists: sinon.stub()
  }
  // toolbox.semver = null
  // toolbox.http = null
  toolbox.parameters = { first: undefined, options: {} }
  toolbox.print = {
    colors: {
      green: sinon.stub(),
      gray: sinon.stub()
    },
    info: sinon.stub(),
    error: sinon.stub(),
    table: sinon.stub()
  }
  toolbox.prompt = {
    ask: async () => ({ answer: undefined }),
    confirm: sinon.stub(),
    separator: sinon.stub()
  }
  toolbox.strings = strings
  toolbox.system = {
    spawn: sinon.stub(),
    which: sinon.stub()
  }
  toolbox.template = {
    generate: sinon.stub()
  }
  // toolbox.patching = null
  return toolbox
}
