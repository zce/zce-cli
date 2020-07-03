import { ware } from './ware'

test('unit:core:helpers:ware', async () => {
  type State = { foo: number, bar?: number, baz?: number }

  const arr: number[] = []

  const app = ware<State>()
  app.use(async (state, next) => {
    expect(state.foo).toBe(123)
    state.bar = 456
    arr.push(1)
    await next()
    arr.push(2)
  })
  app.use([
    async (state, next) => {
      expect(state.bar).toBe(456)
      state.baz = 789
      arr.push(3)
      await next()
      arr.push(4)
    },
    async (state, next) => {
      expect(state.baz).toBe(789)
      arr.push(5)
      await next()
      arr.push(6)
    }
  ])
  await app.run({ foo: 123 })
  expect(arr).toEqual([1, 3, 5, 6, 4, 2])
})
