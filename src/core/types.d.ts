// import { BaseOption, MinimistOption } from 'minimist-options'

// export type OptionType = 'string' | 'boolean' | 'number' | 'array' | 'string-array' | 'boolean-array' | 'number-array'

// // export declare namespace zce { }
// export interface BaseOptionWrapper<T extends OptionType, D> extends BaseOption<T, D> {
//   /**
//    * The description value for the option.
//    */
//   readonly description?: string
// }
// export type StringOption = BaseOptionWrapper<'string', string>
// export type BooleanOption = BaseOptionWrapper<'boolean', boolean>
// export type NumberOption = BaseOptionWrapper<'number', number>
// export type DefaultArrayOption = BaseOptionWrapper<'array', ReadonlyArray<string>>
// export type StringArrayOption = BaseOptionWrapper<'string-array', ReadonlyArray<string>>
// export type BooleanArrayOption = BaseOptionWrapper<'boolean-array', ReadonlyArray<boolean>>
// export type NumberArrayOption = BaseOptionWrapper<'number-array', ReadonlyArray<number>>

// // export { Options }
// export interface Options {
//   [key: string]:
//     | OptionType
//     | StringOption
//     | BooleanOption
//     | NumberOption
//     | DefaultArrayOption
//     | StringArrayOption
//     | BooleanArrayOption
//     | NumberArrayOption
//     | MinimistOption // Workaround for https://github.com/microsoft/TypeScript/issues/17867
// }

import { Options } from 'minimist-options'

declare module 'minimist-options' {
  interface BaseOption {
    /**
     * The description value for the option.
     */
    readonly description?: string
  }
}

export { Options }

export interface Context {
  readonly bin: string
  readonly primary?: string
  readonly secondary?: string
  readonly thirdly?: string
  readonly fourthly?: string
  readonly extras: string[]
  readonly inputs: string[]
  readonly options: Record<string, unknown>
  readonly pkg: Record<string, unknown>
}

export interface Command {
  readonly name: string
  readonly usage?: string
  readonly description?: string
  readonly alias?: string | string[]
  readonly hidden?: boolean
  // TODO: arguments
  // readonly arguments?: Arguments
  readonly options?: Options
  readonly action: (ctx: Context) => Promise<void>
  readonly help?: string | ((ctx: Context) => Promise<void>)
  readonly examples?: string | string[]
  readonly suggestions?: string | string[]
}
