// Module Augmentation
// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation

import { BaseOption } from 'minimist-options'

declare module 'minimist-options' {
  interface BaseOption {
    /**
     * The description value for the option.
     */
    readonly description?: string
  }
}

declare type Dictionary<T> = { [key: string]: T }
