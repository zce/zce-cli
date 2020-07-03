export type Next = () => Promise<void>
export type Middleware<T> = (state: T, next: Next) => Promise<void>

export class Ware<T> {
  private readonly state: T
  private readonly middlewares: Middleware<T>[]

  constructor (initalState: T) {
    this.state = initalState
    this.middlewares = []
  }

  use (middleware: Middleware<T> | Middleware<T>[]): Ware<T> {
    if (typeof middleware === 'function') {
      this.middlewares.push(middleware)
    } else {
      this.middlewares.push(...middleware)
    }
    return this
  }

  run (): Promise<void> {
    // this.state = initalState || this.state

    const next: Next = () => {
      const current = this.middlewares.shift()
      if (!current) return Promise.resolve()
      return current(this.state, next)
    }
    // start
    return next()

    // // https://github.com/koajs/compose/blob/master/index.js
    // // last called middleware #
    // let last = -1
    // const dispatch = (index: number): Promise<any> => {
    //   if (index <= last) throw new Error('next() called multiple times')
    //   last = index

    //   const current = this.middlewares[index]
    //   if (!current) return Promise.resolve()

    //   const res = current(this.state, dispatch.bind(null, index + 1))
    //   return Promise.resolve(res)
    // }
    // return dispatch(0)
  }

  static create<T> (initalState: T): Ware<T> {
    return new Ware<T>(initalState)
  }
}

export const ware = Ware.create
