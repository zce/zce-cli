/* eslint-disable @typescript-eslint/no-explicit-any */
import { Options } from 'minimist-options'

// export declare namespace zce { }

export interface DynamicObject {
  [key: string]: any
}

export interface Context {
  readonly brand: string
  readonly primary?: string
  readonly secondary?: string
  readonly thirdly?: string
  readonly fourthly?: string
  readonly extras: string[]
  readonly input: string[]
  readonly options: { [k: string]: any }
  readonly pkg: { [k: string]: any }
}

// interface Arguments {
//   [key: string]:
//     | string
//     | {
//         readonly type: 'string'
//         readonly default?: string
//         readonly required?: boolean
//       }
//     | {
//         readonly type: 'number'
//         readonly default?: number
//         readonly required?: boolean
//       }
//     | {
//         readonly type: 'boolean'
//         readonly default?: boolean
//         readonly required?: boolean
//       }
// }

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
