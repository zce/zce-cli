// import command, { getTemplateUrl } from './generator'

// let log: jest.SpyInstance
// let exit: jest.SpyInstance

// beforeEach(async () => {
//   log = jest.spyOn(console, 'log').mockImplementation()
//   exit = jest.spyOn(process, 'exit').mockImplementation()
// })

// afterEach(async () => {
//   log && log.mockRestore()
//   exit && exit.mockRestore()
// })

// test('unit:commands:generator:getTemplateUrl', async () => {
//   const url1 = await getTemplateUrl('tpl1')
//   expect(url1).toBe('https://github.com/zce-templates/tpl1/archive/master.zip')
//   const url2 = await getTemplateUrl('zce/tpl2')
//   expect(url2).toBe('https://github.com/zce/tpl2/archive/master.zip')
//   const url3 = await getTemplateUrl('zce/tpl3#dev')
//   expect(url3).toBe('https://github.com/zce/tpl3/archive/dev.zip')
//   const url4 = await getTemplateUrl('tpl4#dev')
//   expect(url4).toBe('https://github.com/zce-templates/tpl4/archive/dev.zip')
//   const url5 = await getTemplateUrl('https://github.com/zce/tpl5/archive/dev.zip')
//   expect(url5).toBe('https://github.com/zce/tpl5/archive/dev.zip')
// })

// test('unit:commands:generator:default', async () => {
//   expect(command.name).toBe('init')
//   expect(command.usage).toBe('init <template> [project]')
//   expect(command.description).toBe('generate a new project from a template.')
//   expect(command.options).toBeTruthy()
//   expect(command.examples).toBeTruthy()
//   expect(typeof command.action).toBe('function')
// })

// // test('unit:commands:generator:action:1', async () => {
// //   const ctx = createFakeContext()
// //   await command.action(ctx)
// //   expect(log.mock.calls[0][0]).toBe('Missing required argument: `<%s>`.')
// //   expect(log.mock.calls[0][1]).toBe('name')
// // })

// // test('unit:commands:generator:action:2', async () => {
// //   const ctx = createFakeContext({ primary: 'zce' })
// //   await command.action(ctx)
// //   expect(log).not.toHaveBeenCalled()
// // })

// // test('unit:commands:generator:action:3', async () => {
// //   const ctx = createFakeContext({ primary: 'zce', options: { lang: 'en' } })
// //   await command.action(ctx)
// //   expect(log.mock.calls[0][0]).toBe('Hey! zce~')
// // })

// // test('unit:commands:generator:action:4', async () => {
// //   const ctx = createFakeContext({ primary: 'zce', options: { lang: 'zh', debug: true } })
// //   await command.action(ctx)
// //   expect(log.mock.calls[0][0]).toBe('嘿！zce~')
// //   expect(log.mock.calls[1][0]).toBe('↓↓↓ --------------------[ DEBUG ]-------------------- ↓↓↓')
// //   expect(log.mock.calls[2][0]).toBe(ctx)
// //   expect(log.mock.calls[3][0]).toBe('↑↑↑ --------------------[ DEBUG ]-------------------- ↑↑↑')
// // })
