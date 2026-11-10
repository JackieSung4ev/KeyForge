export type Language = 'zh' | 'en' | 'ja'

export type GeneratorMode = 'random' | 'passphrase' | 'pin'

export type SeparatorType = '-' | '.' | '_' | ' '

export interface PasswordOptions {
  mode: GeneratorMode
  // Random mode options
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  excludeSimilar: boolean
  // Passphrase mode options
  wordCount: number
  separator: SeparatorType
  capitalizeWords: boolean
  includePassphraseNumber: boolean
  // PIN mode options
  pinLength: number
  avoidRepeatingPin: boolean
  // Shared options
  autoGenerate: boolean
}

export interface HistoryItem {
  id: string
  password: string
  mode: GeneratorMode
  length: number
  entropy: number
  strengthLevel: StrengthLevel
  strengthScore: number
  timestamp: string
}

export type StrengthLevel = 'waiting' | 'veryWeak' | 'weak' | 'medium' | 'strong' | 'veryStrong'

export interface PasswordMetrics {
  entropy: number
  score: number // 0 - 100
  strengthLevel: StrengthLevel
  crackTimeKey:
    | 'instantly'
    | 'inSeconds'
    | 'inMinutes'
    | 'inHours'
    | 'days'
    | 'years'
    | 'kYears'
    | 'mYears'
    | 'bYears'
    | 'overTrillionYears'
  crackTimeValue?: number
  counts: {
    uppercase: number
    lowercase: number
    numbers: number
    symbols: number
  }
}
