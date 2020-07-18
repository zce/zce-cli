// https://github.com/enquirer/enquirer
// https://github.com/SBoudrias/Inquirer.js

import Enquirer, { prompt } from 'enquirer'

// #region enquirer types https://github.com/enquirer/enquirer/pull/252
interface BasePromptOptions {
  name: string | (() => string)
  type: string | (() => string)
  message: string | (() => string) | (() => Promise<string>)
  initial?: unknown
  required?: boolean
  format?: (value: string) => string | Promise<string>
  result?: (value: string) => string | Promise<string>
  skip?: ((state: unknown) => boolean | Promise<boolean>) | boolean
  validate?: (value: string) => boolean | Promise<boolean> | string | Promise<string>
  onSubmit?: (name: string, value: unknown, prompt: Enquirer.Prompt) => boolean | Promise<boolean>
  onCancel?: (name: string, value: unknown, prompt: Enquirer.Prompt) => boolean | Promise<boolean>
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

type PromptOptions = BasePromptOptions | ArrayPromptOptions | BooleanPromptOptions | StringPromptOptions | NumberPromptOptions | SnippetPromptOptions | SortPromptOptions

export type Questions = PromptOptions | PromptOptions[]

export type Answers<T = unknown> = Record<string, T>
// #endregion

export { prompt }
