import os from 'os'
import fs from 'fs'
import path from 'path'
import * as file from './file'

const pkg = require('../../../package.json') as { name: string }

const tempPrefix = path.join(os.tmpdir(), 'zce-cli-test-')

test('unit:core:helpers:file:read', async () => {
  const filename = path.join(__dirname, '../../../test/fixtures/test.ini')
  const buffer = await file.read(filename)
  const contents = buffer.toString().trim()
  expect(contents).toBe('foo = bar')
})

test('unit:core:helpers:file:write', async () => {
  const filename = path.join(__dirname, '../../../test/.temp/temp.txt')
  await file.write(filename, 'hello zce')
  const contents = await fs.promises.readFile(filename, 'utf8')
  expect(contents).toBe('hello zce')
  await fs.promises.rmdir(path.dirname(filename), { recursive: true })
})

test('unit:core:helpers:file:getDataPath', async () => {
  const result1 = file.getDataPath()
  expect(result1).toBe(path.join(os.homedir(), `.config/${pkg.name}-test`))

  const result2 = file.getDataPath('foo')
  expect(result2).toBe(path.join(os.homedir(), `.config/${pkg.name}-test/foo`))

  const result3 = file.getDataPath('foo', 'bar')
  expect(result3).toBe(path.join(os.homedir(), `.config/${pkg.name}-test/foo/bar`))
})

test('unit:core:helpers:file:getTempPath', async () => {
  const result1 = file.getTempPath()
  expect(result1).toBe(path.join(os.tmpdir(), `${pkg.name}-test`))

  const result2 = file.getTempPath('foo')
  expect(result2).toBe(path.join(os.tmpdir(), `${pkg.name}-test/foo`))

  const result3 = file.getTempPath('foo', 'bar')
  expect(result3).toBe(path.join(os.tmpdir(), `${pkg.name}-test/foo/bar`))
})

test('unit:core:helpers:file:exists', async () => {
  const result1 = await file.exists(__dirname)
  expect(result1).toBe('dir')

  const result2 = await file.exists(__filename)
  expect(result2).toBe('file')

  const result3 = await file.exists(tempPrefix + Date.now().toString())
  expect(result3).toBe(false)

  // // https://github.com/nodejs/node/issues/18518
  // const target4 = `./test/.temp`
  // await fs.promises.mkdir(target4)
  // const symlink4 = path.join(target4, 'symlink')
  // await fs.promises.symlink(__dirname, symlink4, 'junction')
  // const result4 = await file.exists(symlink4)
  // expect(result4).toBe('dir')
  // await fs.promises.rmdir(target4, { recursive: true })
})

test('unit:core:helpers:file:isFile', async () => {
  const result1 = await file.isFile(__filename)
  expect(result1).toBe(true)

  const result2 = await file.isFile(__dirname)
  expect(result2).toBe(false)
})

test('unit:core:helpers:file:isDirectory', async () => {
  const result1 = await file.isDirectory(__filename)
  expect(result1).toBe(false)

  const result2 = await file.isDirectory(__dirname)
  expect(result2).toBe(true)
})

test('unit:core:helpers:file:isEmpty', async () => {
  const empty1 = await file.isEmpty(__dirname)
  expect(empty1).toBe(false)

  const temp2 = await fs.promises.mkdtemp(tempPrefix)
  const empty2 = await file.isEmpty(temp2)
  expect(empty2).toBe(true)
  await fs.promises.rmdir(temp2)
})

test('unit:core:helpers:file:mkdir', async () => {
  // relative path recursive
  const target1 = `test/.temp/${Date.now()}/zce/cli/mkdir/1`
  await file.mkdir(target1)
  const exists1 = fs.existsSync(target1)
  expect(exists1).toBe(true)
  await fs.promises.rmdir('test/.temp', { recursive: true })

  // absolute path recursive
  const root2 = tempPrefix + Date.now().toString()
  const target2 = `${root2}/zce/cli/mkdir/2`
  await file.mkdir(target2)
  const exists2 = fs.existsSync(target2)
  expect(exists2).toBe(true)
  await fs.promises.rmdir(root2, { recursive: true })

  // mode options
  const target3 = tempPrefix + Date.now().toString()
  await file.mkdir(target3, { mode: 0o755, recursive: false })
  const stat3 = await fs.promises.stat(target3)
  expect(stat3.mode).toBe(process.platform === 'win32' ? 16822 : 16877)
  await fs.promises.rmdir(target3)
})

test('unit:core:helpers:file:remove', async () => {
  const temp = await fs.promises.mkdtemp(tempPrefix)

  const filename1 = path.join(temp, 'zce-cli-remove-1.txt')
  await fs.promises.writeFile(filename1, '')
  await file.remove(filename1)
  const exists1 = fs.existsSync(filename1)
  expect(exists1).toBe(false)

  const filename2 = path.join(temp, 'zce-cli-remove-2.txt')
  await file.remove(filename2)
  const exists2 = fs.existsSync(filename2)
  expect(exists2).toBe(false)

  await fs.promises.rmdir(temp)
})

test('unit:core:helpers:file:glob', async () => {
  const files = await file.glob('**/*', { cwd: __dirname })
  expect(files).toContain(path.basename(__filename))
})

test('unit:core:helpers:file:minimatch', async () => {
  const match1 = file.minimatch('foo.bar', '*.bar')
  expect(match1).toBe(true)

  const match2 = file.minimatch('foo.bar', '*.foo')
  expect(match2).toBe(false)

  const match3 = file.minimatch('foo.bar', '**/*.bar')
  expect(match3).toBe(true)

  const match4 = file.minimatch('.foo', '**', { dot: true })
  expect(match4).toBe(true)
})

test('unit:core:helpers:file:tildify', async () => {
  const home = os.homedir()

  // home dir
  const result1 = file.tildify(home)
  expect(result1).toBe('~')

  // home sub dir
  const result2 = file.tildify(path.join(home, 'tildify'))
  expect(result2).toBe(path.join('~', 'tildify'))

  // ensure only a fully matching path is replaced
  const result3 = file.tildify(`${home}foo/tildify`)
  expect(result3).toBe(`${home}foo${path.sep}tildify`)

  // only tildify when home is at the start of a path
  const result4 = file.tildify(path.join('tildify', home))
  expect(result4).toBe(path.join('tildify', home))

  // ignore relative paths
  const result5 = file.tildify('tildify')
  expect(result5).toBe('tildify')

  // ignore not home sub dir
  const result6 = file.tildify('/tildify')
  expect(result6).toBe(path.sep + 'tildify')
})

test('unit:core:helpers:file:untildify', async () => {
  const home = os.homedir()

  // home dir
  const result1 = file.untildify('~')
  expect(result1).toBe(home)

  // home sub dir
  const result2 = file.untildify(path.join('~', 'untildify'))
  expect(result2).toBe(path.join(home, 'untildify'))

  // ensure only a fully matching path is replaced
  const result3 = file.untildify(`${home}foo${path.sep}untildify`)
  expect(result3).toBe(`${home}foo${path.sep}untildify`)

  // only untildify when home is at the start of a path
  const result4 = file.untildify(path.join('untildify', home))
  expect(result4).toBe(path.join('untildify', home))

  // ignore relative paths
  const result5 = file.untildify('untildify')
  expect(result5).toBe('untildify')

  // ignore not home sub dir
  const result6 = file.untildify('/untildify')
  expect(result6).toBe('/untildify')
})

test('unit:core:helpers:file:extract:normal', async () => {
  const temp = await fs.promises.mkdtemp(tempPrefix)
  await file.extract(path.join(__dirname, '../../../test/fixtures/archive.zip'), temp)
  const stat1 = fs.statSync(path.join(temp, 'archive'))
  expect(stat1.isDirectory()).toBe(true)
  const stat2 = fs.statSync(path.join(temp, 'archive/LICENSE'))
  expect(stat2.isFile()).toBe(true)
  const stat3 = fs.statSync(path.join(temp, 'archive/README.md'))
  expect(stat3.isFile()).toBe(true)
  await fs.promises.rmdir(temp, { recursive: true })
})

test('unit:core:helpers:file:extract:strip', async () => {
  const temp = await fs.promises.mkdtemp(tempPrefix)
  await file.extract(path.join(__dirname, '../../../test/fixtures/archive.zip'), temp, 1)
  const stat1 = fs.statSync(path.join(temp, 'LICENSE'))
  expect(stat1.isFile()).toBe(true)
  const stat2 = fs.statSync(path.join(temp, 'README.md'))
  expect(stat2.isFile()).toBe(true)
  await fs.promises.rmdir(temp, { recursive: true })
})
