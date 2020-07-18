// Module Augmentation
// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation

import { BaseOption } from 'minimist-options'

declare module 'minimist-options' {
  interface BaseOption<TypeOptionType extends OptionType, DefaultOptionType> {
    /**
     * The description value for the option.
     */
    readonly description?: string
  }
}

declare interface Dictionary<T> {
  [key: string]: T
}
