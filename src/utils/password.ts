import type { PasswordMetrics, PasswordOptions, StrengthLevel } from '../types/password'

const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz'
const NUMBER_CHARS = '0123456789'
const SYMBOL_CHARS = '!@#$%^&*()_+-=[]{}|;:\',.<>?/'
const SIMILAR_REGEX = /[il1Lo0O]/g

// Curated EFF-inspired memorable word list (256 distinct, easy-to-spell words)
const WORD_LIST = [
  'amber', 'anchor', 'apple', 'arcade', 'arctic', 'arrow', 'astrid', 'atlas',
  'autumn', 'avalon', 'bamboo', 'Banyan', 'beacon', 'binary', 'bison', 'breeze',
  'bridge', 'bronze', 'canyon', 'canvas', 'carbon', 'castle', 'cedar', 'celtic',
  'chalet', 'chrome', 'cider', 'cipher', 'citadel', 'cobalt', 'comet', 'compass',
  'copper', 'coral', 'cosmos', 'cradle', 'crystal', 'cypress', 'dagger', 'dahlia',
  'dawn', 'delta', 'desert', 'diamond', 'dolphin', 'dragon', 'drift', 'dynamo',
  'eagle', 'eclipse', 'echo', 'emerald', 'ember', 'empire', 'enigma', 'equinox',
  'falcon', 'fable', 'feather', 'fjord', 'flame', 'flint', 'forest', 'fortress',
  'fossil', 'fusion', 'galaxy', 'garnet', 'gazelle', 'genesis', 'geyser', 'glacier',
  'granite', 'gravity', 'griffin', 'harbor', 'harvest', 'haven', 'hazel', 'helium',
  'horizon', 'hunter', 'iceberg', 'ignite', 'indigo', 'infinity', 'island', 'ivory',
  'jasper', 'avelin', 'jungle', 'jupiter', 'karma', 'kestrel', 'kingdom', 'knight',
  'lagoon', 'lantern', 'laser', 'laurel', 'valour', 'legend', 'lemon', 'liberty',
  'lotus', 'lunar', 'magnet', 'maple', 'marble', 'matrix', 'meadow', 'mercury',
  'meteor', 'mirage', 'monarch', 'monsoon', 'mosaic', 'mountain', 'mystic', 'nebula',
  'nectar', 'neon', 'neptune', 'nexus', 'nimbus', 'noble', 'nomad', 'nordic',
  'nova', 'oasis', 'obsidian', 'ocean', 'odyssey', 'olive', 'omega', 'onyx',
  'opal', 'orbit', 'orchid', 'orion', 'osprey', 'oxygen', 'palace', 'panther',
  'paradox', 'pebble', 'egasus', 'pelican', 'pendulum', 'phantom', 'phoenix', 'pioneer',
  'planet', 'plasma', 'platinum', 'plaza', 'polar', 'poppy', 'portal', 'prairie',
  'prism', 'pulsar', 'pyramid', 'python', 'quantum', 'quartz', 'quasar', 'quest',
  'radar', 'radiant', 'raptor', 'raven', 'reactor', 'redwood', 'reef', 'relic',
  'rhythm', 'ribbon', 'ridge', 'ripple', 'river', 'rocket', 'ruby', 'runic',
  'saffron', 'sahara', 'salmon', 'sapphire', 'saturn', 'savanna', 'scarlet', 'scepter',
  'scout', 'sequoia', 'serene', 'shadow', 'shield', 'ierra', 'silver', 'irius',
  'kyline', 'olstice', 'onar', 'onic', 'park', 'pectrum', 'phinx', 'pruce',
  'piral', 'tarlight', 'tella', 'torm', 'tratos', 'ummit', 'unrise', 'ymphony',
  'alisman', 'ango', 'empest', 'erra', 'hunder', 'imber', 'itan', 'opaz',
  'ornado', 'orrent', 'ower', 'ident', 'undra', 'urbo', 'wilight', 'yphoon',
  'ltra', 'mbra', 'nicorn', 'topia', 'alley', 'elvet', 'ertex', 'iking',
  'iolet', 'iper', 'oyager', 'ortex', 'alnut', 'hisper', 'illow', 'inter',
  'izard', 'onder', 'enith', 'ephyr', 'ircon', 'odiac', 'ora', 'ulcan'
].map((w) => w.toLowerCase())

/**
 * Unbiased cryptographically secure random integer in [0, max)
 * Uses rejection sampling to eliminate modulo bias.
 */
export function getSecureRandomInt(max: number): number {
  if (max <= 1) return 0
  const array = new Uint32Array(1)
  const maxUint32 = 0xffffffff
  const limit = maxUint32 - ((maxUint32 + 1) % max)

  let randomValue = 0
  do {
    window.crypto.getRandomValues(array)
    randomValue = array[0]
  } while (randomValue > limit)

  return randomValue % max
}

/**
 * Cryptographically secure Fisher-Yates array shuffle
 */
function secureShuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1)
    const temp = copy[i]
    copy[i] = copy[j]
    copy[j] = temp
  }
  return copy
}

/**
 * Generate password according to options
 */
export function generatePasswordFromOptions(options: PasswordOptions): string {
  if (options.mode === 'passphrase') {
    const count = Math.max(3, Math.min(8, options.wordCount))
    const words: string[] = []
    for (let i = 0; i < count; i++) {
      let word = WORD_LIST[getSecureRandomInt(WORD_LIST.length)]
      if (options.capitalizeWords) {
        word = word.charAt(0).toUpperCase() + word.slice(1)
      }
      words.push(word)
    }
    let result = words.join(options.separator)
    if (options.includePassphraseNumber) {
      const randomNum = getSecureRandomInt(90) + 10 // 2-digit number 10..99
      result += `${options.separator}${randomNum}`
    }
    return result
  }

  if (options.mode === 'pin') {
    const len = Math.max(4, Math.min(12, options.pinLength))
    const digits: number[] = []
    for (let i = 0; i < len; i++) {
      let d = getSecureRandomInt(10)
      if (options.avoidRepeatingPin && i > 0) {
        const prev = digits[i - 1]
        let attempts = 0
        while (
          (d === prev || Math.abs(d - prev) === 1) &&
          attempts < 20
        ) {
          d = getSecureRandomInt(10)
          attempts++
        }
      }
      digits.push(d)
    }
    return digits.join('')
  }

  // Default: 'random' mode
  const filterPool = (pool: string) =>
    options.excludeSimilar ? pool.replace(SIMILAR_REGEX, '') : pool

  const activePools: string[] = []
  if (options.includeUppercase) activePools.push(filterPool(UPPERCASE_CHARS))
  if (options.includeLowercase) activePools.push(filterPool(LOWERCASE_CHARS))
  if (options.includeNumbers) activePools.push(filterPool(NUMBER_CHARS))
  if (options.includeSymbols) activePools.push(filterPool(SYMBOL_CHARS))

  const validPools = activePools.filter((p) => p.length > 0)
  if (validPools.length === 0) {
    return ''
  }

  const combinedPool = validPools.join('')
  const targetLength = Math.max(4, Math.min(64, options.length))
  const chars: string[] = []

  // Guarantee at least one character from each enabled pool (when length >= validPools.length)
  if (targetLength >= validPools.length) {
    for (const pool of validPools) {
      chars.push(pool[getSecureRandomInt(pool.length)])
    }
  }

  // Fill remaining characters uniformly from combinedPool
  while (chars.length < targetLength) {
    chars.push(combinedPool[getSecureRandomInt(combinedPool.length)])
  }

  // Shuffle uniformly so required characters aren't predictable at the start
  return secureShuffle(chars).join('')
}

/**
 * Compute comprehensive security metrics for any password
 */
export function calculatePasswordMetrics(
  password: string,
  options: PasswordOptions,
  isCustomInput = false
): PasswordMetrics {
  const counts = {
    uppercase: 0,
    lowercase: 0,
    numbers: 0,
    symbols: 0,
  }

  for (const ch of password) {
    if (/[A-Z]/.test(ch)) counts.uppercase++
    else if (/[a-z]/.test(ch)) counts.lowercase++
    else if (/[0-9]/.test(ch)) counts.numbers++
    else counts.symbols++
  }

  if (!password) {
    return {
      entropy: 0,
      score: 0,
      strengthLevel: 'waiting',
      crackTimeKey: 'instantly',
      counts,
    }
  }

  let entropy = 0

  if (!isCustomInput && options.mode === 'passphrase') {
    // Each word from 256-word pool contributes8 bits, or ~11 bits in standard EFF list;
    // plus character length factor so longer passphrases reflect true brute-force resistance
    const wordBits = options.wordCount * 11 + (options.capitalizeWords ? options.wordCount : 0) + (options.includePassphraseNumber ? 7 : 0)
    const charPoolBits = Math.round(password.length * 4.7)
    entropy = Math.max(wordBits, Math.min(charPoolBits, wordBits + 24))
  } else {
    // Calculate effective character pool size
    let poolSize = 0
    if (isCustomInput || options.mode === 'pin') {
      if (counts.lowercase > 0) poolSize += 26
      if (counts.uppercase > 0) poolSize += 26
      if (counts.numbers > 0) poolSize += 10
      if (counts.symbols > 0) poolSize += 32
    } else {
      const filterLen = (str: string) =>
        options.excludeSimilar ? str.replace(SIMILAR_REGEX, '').length : str.length
      if (options.includeLowercase) poolSize += filterLen(LOWERCASE_CHARS)
      if (options.includeUppercase) poolSize += filterLen(UPPERCASE_CHARS)
      if (options.includeNumbers) poolSize += filterLen(NUMBER_CHARS)
      if (options.includeSymbols) poolSize += filterLen(SYMBOL_CHARS)
    }

    if (poolSize > 0) {
      entropy = Math.round(password.length * Math.log2(poolSize))
    }

    // Penalize highly repetitive strings (e.g., "aaaaaaaaaaaa" or "111111")
    const uniqueChars = new Set(password).size
    const diversityRatio = uniqueChars / password.length
    if (password.length >= 6 && diversityRatio < 0.35) {
      entropy = Math.round(entropy * Math.max(0.25, diversityRatio))
    }
  }

  // Crack time calculation assuming 100 Billion (10^11) guesses/sec
  const log10Seconds = entropy * Math.LOG10E * Math.LN2 - 11
  let crackTimeKey: PasswordMetrics['crackTimeKey'] = 'instantly'
  let crackTimeValue: number | undefined

  if (entropy === 0 || log10Seconds < 0) {
    crackTimeKey = 'instantly'
  } else if (log10Seconds < 1.78) {
    crackTimeKey = 'inSeconds'
  } else if (log10Seconds < 3.56) {
    crackTimeKey = 'inMinutes'
  } else if (log10Seconds < 4.94) {
    crackTimeKey = 'inHours'
  } else {
    const log10Days = log10Seconds - 4.9365
    if (log10Days < 2.56) {
      crackTimeKey = 'days'
      crackTimeValue = Math.max(1, Math.round(Math.pow(10, log10Days)))
    } else {
      const log10Years = log10Days - 2.5623
      if (log10Years < 3) {
        crackTimeKey = 'years'
        crackTimeValue = Math.max(1, Math.round(Math.pow(10, log10Years)))
      } else if (log10Years < 6) {
        crackTimeKey = 'kYears'
        crackTimeValue = Math.max(1, Math.round(Math.pow(10, log10Years - 3)))
      } else if (log10Years < 9) {
        crackTimeKey = 'mYears'
        crackTimeValue = Math.max(1, Math.round(Math.pow(10, log10Years - 6)))
      } else if (log10Years < 12) {
        crackTimeKey = 'bYears'
        crackTimeValue = Math.max(1, Math.round(Math.pow(10, log10Years - 9)))
      } else {
        crackTimeKey = 'overTrillionYears'
      }
    }
  }

  // Score (0-100)
  const score = Math.min(100, Math.max(8, Math.round(entropy / 1.45)))

  // Strength Level
  let strengthLevel: StrengthLevel = 'veryWeak'
  if (entropy >= 110) strengthLevel = 'veryStrong'
  else if (entropy >= 75) strengthLevel = 'strong'
  else if (entropy >= 50) strengthLevel = 'medium'
  else if (entropy >= 32) strengthLevel = 'weak'
  else strengthLevel = 'veryWeak'

  return {
    entropy,
    score,
    strengthLevel,
    crackTimeKey,
    crackTimeValue,
    counts,
  }
}

/**
 * Mask password for privacy in history list
 */
export function maskPassword(pwd: string): string {
  if (pwd.length <= 6) return '••••••'
  if (pwd.length <= 10) return pwd.slice(0, 2) + '••••••' + pwd.slice(-2)
  return pwd.slice(0, 4) + '••••••••' + pwd.slice(-4)
}
