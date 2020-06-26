import { Options } from 'minimist-options'

// export declare namespace zce { }

export { Options }
// export interface Options extends MinimistOptions {}

export interface Context {
  readonly brand: string
  readonly primary?: string
  readonly secondary?: string
  readonly thirdly?: string
  readonly fourthly?: string
  readonly extras: string[]
  readonly input: string[]
  readonly options: Record<string, unknown>
  readonly pkg: Record<string, unknown>
}

export interface Command {
  readonly name: string
  readonly usage?: string
  readonly description?: string
  readonly alias?: string | string[]
  readonly hidden?: boolean
  // // TODO: arguments
  // readonly arguments?: Arguments
  readonly options?: Options
  readonly action: (ctx: Context) => Promise<unknown>
  readonly help?: string | ((ctx: Context) => Promise<unknown>)
  readonly examples?: string | string[]
  readonly suggestions?: string | string[]
}
