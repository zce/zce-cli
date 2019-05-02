export interface HelpMessage {
  description?: string
  usage: string
  commands?: {} | string[][]
  options?: {} | string[][]
  examples?: string[] | string
  suggestions?: string[] | string
}
