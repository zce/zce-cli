import { Options } from 'minimist-options'
import Enquirer from 'enquirer'

declare module 'minimist-options' {
  interface BaseOption {
    /**
     * The description value for the option.
     */
    readonly description?: string
  }
}

export type Dictionary<T> = { [key: string]: T }

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

export type Next = () => Promise<void>

export type Middleware<T> = (state: T, next: Next) => Promise<void>

// #region enquirer types https://github.com/enquirer/enquirer/pull/252
interface BasePromptOptions {
  name: string | (() => string)
  type: string | (() => string)
  message: string | (() => string) | (() => Promise<string>)
  initial?: unknown
  required?: boolean
  format?(value: string): string | Promise<string>
  result?(value: string): string | Promise<string>
  skip?: ((state: unknown) => boolean | Promise<boolean>) | boolean
  validate?(value: string): boolean | Promise<boolean> | string | Promise<string>
  onSubmit?(name: string, value: unknown, prompt: Enquirer.Prompt): boolean | Promise<boolean>
  onCancel?(name: string, value: unknown, prompt: Enquirer.Prompt): boolean | Promise<boolean>
  stdin?: NodeJS.ReadStream
  stdout?: NodeJS.WriteStream
}

interface Choice {
  name: string
  message?: string
  value?: string
  hint?: string
  disabled?: boolean | string
}

interface ArrayPromptOptions extends BasePromptOptions {
  type: 'autocomplete' | 'editable' | 'form' | 'multiselect' | 'select' | 'survey' | 'list' | 'scale'
  choices: string[] | Choice[]
  maxChoices?: number
  muliple?: boolean
  initial?: number
  delay?: number
  separator?: boolean
  sort?: boolean
  linebreak?: boolean
  edgeLength?: number
  align?: 'left' | 'right'
  scroll?: boolean
}

interface BooleanPromptOptions extends BasePromptOptions {
  type: 'confirm'
  initial?: boolean
}

interface StringPromptOptions extends BasePromptOptions {
  type: 'input' | 'invisible' | 'list' | 'password' | 'text'
  initial?: string
  multiline?: boolean
}

interface NumberPromptOptions extends BasePromptOptions {
  type: 'numeral'
  min?: number
  max?: number
  delay?: number
  float?: boolean
  round?: boolean
  major?: number
  minor?: number
  initial?: number
}

interface SnippetPromptOptions extends BasePromptOptions {
  type: 'snippet'
  newline?: string
  template?: string
}

interface SortPromptOptions extends BasePromptOptions {
  type: 'sort'
  hint?: string
  drag?: boolean
  numbered?: boolean
}

type PromptOptions =
  | BasePromptOptions
  | ArrayPromptOptions
  | BooleanPromptOptions
  | StringPromptOptions
  | NumberPromptOptions
  | SnippetPromptOptions
  | SortPromptOptions

export type Questions =
  | PromptOptions
  | ((this: Enquirer) => PromptOptions)
  | (PromptOptions | ((this: Enquirer) => PromptOptions))[]

export type Answers<T = unknown> = Record<string, T>
// #endregion

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
