export type Middleware<T> = (state: T, next: () => Promise<void>) => Promise<void> | void

/**
 * Middleware Async.
 * @template S state type
 */
class Ware<S> {
  private readonly middlewares: Array<Middleware<S>>

  constructor () {
    this.middlewares = []
  }

  /**
   * Use the given middleware.
   * @param middleware middleware func
   */
  use (middleware: Middleware<S> | Array<Middleware<S>>): Ware<S> {
    if (typeof middleware === 'function') {
      this.middlewares.push(middleware)
    } else {
      this.middlewares.push(...middleware)
    }
    return this
  }

  /**
   * Run all middlewares.
   * @param initalState initial state
   */
  async run (initalState: S): Promise<void> {
    // https://github.com/koajs/compose/blob/master/index.js
    const next = async (): Promise<void> => {
      const current = this.middlewares.shift()
      if (current == null) return await Promise.resolve()
      const result = current(initalState, next)
      return await Promise.resolve(result)
    }
    return await next()
  }
}

/**
 * Middleware Async.
 * @template S state type
 */
export const ware = <S> (): Ware<S> => new Ware<S>()
