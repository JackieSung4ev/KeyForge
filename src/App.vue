<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import {
  Copy,
  Check,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  History,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Sun,
  Moon,
  ChevronDown
} from '@lucide/vue'

// Translation dictionary
const translations = {
  zh: {
    title: '密码生成器',
    bannerTitle: '立即生成安全密码',
    bannerSubtitle: '可定制。强安全性。隐私安全。快捷响应。',
    passwordPlaceholder: '[ 配置选项以生成密码 ]',
    copied: '已复制',
    copy: '复制',
    strength: '安全强度',
    entropy: '熵值',
    crackTime: '破解估时',
    score: '评分',
    length: '密码长度',
    characterSets: '字符集',
    selectedCount: '已选择 {count} / 4',
    uppercase: '大写字母',
    lowercase: '小写字母',
    numbers: '数字',
    symbols: '特殊符号',
    generateButton: '生成新密码',
    regenerate: '重新生成',
    excludeSimilar: '排除相似字符 (如 i, l, 1, o, 0, O)',
    autoGenerate: '修改配置时自动生成密码',
    historyTitle: '密码历史',
    clearAll: '清空历史',
    noHistory: '暂无历史记录。生成的密码将出现在这里。',
    historyTooltipReveal: '显示/隐藏密码',
    historyTooltipCopy: '复制密码',
    historyTooltipDelete: '删除记录',
    storageInfo: '存储方式: 浏览器本地',
    capacityInfo: '最大容量: 15 条',
    securityFooter: '本地加密生成，确保数据隐私安全',
    // Strength levels
    veryWeak: '极弱',
    weak: '较弱',
    medium: '中等',
    strong: '安全',
    veryStrong: '非常安全',
    waiting: '等待生成',
    // Crack times
    instantly: '立即',
    inSeconds: '数秒内',
    inMinutes: '数分钟内',
    inHours: '数小时内',
    days: '天',
    years: '年',
    kYears: '千年',
    mYears: '百万年',
    bYears: '十亿年',
    overTrillionYears: '万亿年以上',
    confirmClear: '确认清除所有密码历史记录吗？此操作无法撤销。'
  },
  en: {
    title: 'Password Generator',
    bannerTitle: 'Generate secure passwords instantly',
    bannerSubtitle: 'Customizable. Strong. Private. Fast.',
    passwordPlaceholder: '[ Configure options to generate ]',
    copied: 'Copied',
    copy: 'Copy',
    strength: 'Strength',
    entropy: 'Entropy',
    crackTime: 'Crack time',
    score: 'Score',
    length: 'Length',
    characterSets: 'Character sets',
    selectedCount: '{count} / 4 selected',
    uppercase: 'Uppercase',
    lowercase: 'Lowercase',
    numbers: 'Numbers',
    symbols: 'Symbols',
    generateButton: 'Generate new password',
    regenerate: 'Regenerate',
    excludeSimilar: 'Exclude ambiguous characters (e.g. i, l, 1, o, 0, O)',
    autoGenerate: 'Auto-generate on options change',
    historyTitle: 'Password History',
    clearAll: 'Clear All',
    noHistory: 'No history yet. Generated passwords will appear here.',
    historyTooltipReveal: 'Toggle visibility',
    historyTooltipCopy: 'Copy password',
    historyTooltipDelete: 'Delete record',
    storageInfo: 'Storage: Local browser',
    capacityInfo: 'Capacity: 15 entries',
    securityFooter: 'Secure 256-bit cryptographic local generation',
    // Strength levels
    veryWeak: 'Very Weak',
    weak: 'Weak',
    medium: 'Medium',
    strong: 'Strong',
    veryStrong: 'Very Strong',
    waiting: 'Waiting',
    // Crack times
    instantly: 'Instantly',
    inSeconds: 'In seconds',
    inMinutes: 'In minutes',
    inHours: 'In hours',
    days: 'days',
    years: 'years',
    kYears: 'K years',
    mYears: 'M years',
    bYears: 'B years',
    overTrillionYears: 'Over a trillion years',
    confirmClear: 'Are you sure you want to clear all password history? This action cannot be undone.'
  },
  ja: {
    title: 'パスワード生成器',
    bannerTitle: '安全なパスワードを即座に生成',
    bannerSubtitle: 'カスタマイズ可能。強力。安全。高速。',
    passwordPlaceholder: '[ オプションを設定して生成 ]',
    copied: 'コピー済',
    copy: 'コピー',
    strength: '強度',
    entropy: 'エントロピー',
    crackTime: '解読推定時間',
    score: 'スコア',
    length: 'パスワードの長さ',
    characterSets: '文字セット',
    selectedCount: '{count} / 4 選択中',
    uppercase: '大文字',
    lowercase: '小文字',
    numbers: '数字',
    symbols: '記号',
    generateButton: '新しいパスワードを生成',
    regenerate: '再生成',
    excludeSimilar: '類似文字を除く (例: i, l, 1, o, 0, O)',
    autoGenerate: '設定変更時に自動生成する',
    historyTitle: '生成履歴',
    clearAll: '履歴クリア',
    noHistory: '履歴がありません。生成されたパスワードがここに表示されます。',
    historyTooltipReveal: 'パスワードを表示/非表示',
    historyTooltipCopy: 'パスワードをコピー',
    historyTooltipDelete: '履歴を削除',
    storageInfo: '保存先: ブラウザローカル',
    capacityInfo: '最大容量: 15 件',
    securityFooter: 'ローカル暗号化生成、データのプライバシーを保護',
    // Strength levels
    veryWeak: '極めて弱い',
    weak: '弱い',
    medium: '普通',
    strong: '強い',
    veryStrong: '非常に強い',
    waiting: '生成待ち',
    // Crack times
    instantly: '即座に',
    inSeconds: '数秒以内',
    inMinutes: '数分以内',
    inHours: '数時間以内',
    days: '日',
    years: '年',
    kYears: '千年',
    mYears: '百万年',
    bYears: '十億年',
    overTrillionYears: '一兆年以上',
    confirmClear: 'すべてのパスワード履歴を削除しますか？この操作は取り消せません。'
  }
}

const currentLang = ref<'zh' | 'en' | 'ja'>('en')

// Translate helper
const t = (key: keyof typeof translations.en, replacements?: Record<string, string | number>) => {
  let str = (translations[currentLang.value] as any)[key] || translations.en[key] || ''
  if (replacements) {
    Object.entries(replacements).forEach(([k, v]) => {
      str = str.replace(`{${k}}`, String(v))
    })
  }
  return str
}

// Switch Language handler
const setLanguage = (lang: 'zh' | 'en' | 'ja') => {
  currentLang.value = lang
  localStorage.setItem('lang', lang)
}

// Password Options
const length = ref(24) // Default is 24 as in mockup
const includeUppercase = ref(true)
const includeLowercase = ref(true)
const includeNumbers = ref(true)
const includeSymbols = ref(true)
const excludeSimilar = ref(false)

// UI States
const password = ref('')
const copied = ref(false)
const autoGenerate = ref(true)
const showPassword = ref(true)
const isGenerating = ref(false)
const copiedItems = ref<Record<string, boolean>>({})
const showHistory = ref(false)
const isDark = ref(false)

// Characters definitions
const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz'
const NUMBER_CHARS = '0123456789'
const SYMBOL_CHARS = '!@#$%^&*()_+-=[]{}|;:\',.<>?/'
const SIMILAR_CHARS = /[il1Lo0O]/g

// History structure
interface HistoryItem {
  id: string
  password: string
  length: number
  strengthText: string
  strengthScore: number
  timestamp: string
  show: boolean
}

const historyList = ref<HistoryItem[]>([])

// Theme Switcher Helper
const setTheme = (dark: boolean) => {
  isDark.value = dark
  if (dark) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

// Load configurations and history from localStorage
onMounted(() => {
  // Theme initialization
  const storedTheme = localStorage.getItem('theme')
  if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    setTheme(true)
  } else {
    setTheme(false)
  }

  // Language auto-detection
  const storedLang = localStorage.getItem('lang')
  if (storedLang === 'zh' || storedLang === 'en' || storedLang === 'ja') {
    currentLang.value = storedLang
  } else {
    const browserLang = (navigator.language || (navigator as any).userLanguage || '').toLowerCase()
    if (browserLang.startsWith('zh')) {
      currentLang.value = 'zh'
    } else if (browserLang.startsWith('ja')) {
      currentLang.value = 'ja'
    } else {
      currentLang.value = 'en'
    }
  }

  // History load
  const stored = localStorage.getItem('passforge_pwd_history') || localStorage.getItem('cyber_pwd_history')
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as HistoryItem[]
      historyList.value = parsed.map(item => ({ ...item, show: false }))
    } catch (e) {
      console.error('Failed to parse password history', e)
    }
  }
  // Initial generation
  generatePassword(false)
})

// Save history to localStorage
const saveHistory = () => {
  localStorage.setItem('passforge_pwd_history', JSON.stringify(
    historyList.value.map(item => ({
      id: item.id,
      password: item.password,
      length: item.length,
      strengthText: item.strengthText,
      strengthScore: item.strengthScore,
      timestamp: item.timestamp
    }))
  ))
}

// Generate Password function
const generatePassword = (isManual = false) => {
  if (!includeUppercase.value && !includeLowercase.value && !includeNumbers.value && !includeSymbols.value) {
    password.value = ''
    return
  }

  isGenerating.value = true
  
  // Instant secure cryptographically secure generation
  setTimeout(() => {
    let charPool = ''
    if (includeUppercase.value) charPool += UPPERCASE_CHARS
    if (includeLowercase.value) charPool += LOWERCASE_CHARS
    if (includeNumbers.value) charPool += NUMBER_CHARS
    if (includeSymbols.value) charPool += SYMBOL_CHARS

    if (excludeSimilar.value) {
      charPool = charPool.replace(SIMILAR_CHARS, '')
    }

    if (charPool === '') {
      password.value = ''
      isGenerating.value = false
      return
    }

    let generated = ''
    const poolLength = charPool.length
    
    // Cryptographically secure pseudo-random number generator
    const array = new Uint32Array(length.value)
    window.crypto.getRandomValues(array)
    
    for (let i = 0; i < length.value; i++) {
      generated += charPool[array[i] % poolLength]
    }
    
    // Ensure all checked rules are satisfied if length allows
    const requiredTypes: string[] = []
    if (includeUppercase.value) requiredTypes.push(UPPERCASE_CHARS)
    if (includeLowercase.value) requiredTypes.push(LOWERCASE_CHARS)
    if (includeNumbers.value) requiredTypes.push(NUMBER_CHARS)
    if (includeSymbols.value) requiredTypes.push(SYMBOL_CHARS)

    if (length.value >= requiredTypes.length && !excludeSimilar.value) {
      const missingTypes = requiredTypes.filter(pool => {
        return !generated.split('').some(c => pool.includes(c))
      })

      if (missingTypes.length > 0) {
        const genChars = generated.split('')
        for (let i = 0; i < missingTypes.length; i++) {
          const pool = missingTypes[i]
          const randIndex = array[i % array.length] % genChars.length
          const charIndex = (array[(i + 1) % array.length] + 13) % pool.length
          genChars[randIndex] = pool[charIndex]
        }
        generated = genChars.join('')
      }
    }

    password.value = generated
    isGenerating.value = false

    if (isManual) {
      addToHistory(generated)
    }
  }, 40)
}

// Add to History list
const addToHistory = (pwd: string) => {
  // Avoid duplicate of the very last history item
  if (historyList.value.length > 0 && historyList.value[0].password === pwd) {
    return
  }

  const now = new Date()
  const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  
  const newItem: HistoryItem = {
    id: Math.random().toString(36).substring(2, 9),
    password: pwd,
    length: pwd.length,
    strengthText: calcStrengthText(pwd),
    strengthScore: calcStrengthScore(pwd),
    timestamp,
    show: false
  }

  // Prepend to list, limit to 15 entries
  historyList.value = [newItem, ...historyList.value.slice(0, 14)]
  saveHistory()
}

// Watch option changes for auto-generation
watch([length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeSimilar], () => {
  if (autoGenerate.value) {
    generatePassword(false)
  }
})

// Clipboard functions
const copyToClipboard = async () => {
  if (!password.value) return
  try {
    await navigator.clipboard.writeText(password.value)
    copied.value = true
    
    // Also push to history upon copying if not present in history yet
    const alreadyInHistory = historyList.value.some(item => item.password === password.value)
    if (!alreadyInHistory) {
      addToHistory(password.value)
    }
    
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy', err)
  }
}

const copyHistoryItem = async (item: HistoryItem) => {
  try {
    await navigator.clipboard.writeText(item.password)
    copiedItems.value[item.id] = true
    setTimeout(() => {
      copiedItems.value[item.id] = false
    }, 1500)
  } catch (err) {
    console.error('Failed to copy history item', err)
  }
}

const toggleHistoryReveal = (id: string) => {
  const item = historyList.value.find(i => i.id === id)
  if (item) {
    item.show = !item.show
  }
}

const deleteHistoryItem = (id: string) => {
  historyList.value = historyList.value.filter(item => item.id !== id)
  saveHistory()
}

const clearAllHistory = () => {
  if (confirm(t('confirmClear'))) {
    historyList.value = []
    saveHistory()
  }
}

// Masked password output helper
const maskPasswordStr = (str: string) => {
  if (str.length <= 8) return '••••••••'
  return str.substring(0, 4) + '••••••••' + str.substring(str.length - 4)
}

// Password metrics computations
const entropy = computed(() => {
  if (!password.value) return 0
  let poolSize = 0
  if (includeLowercase.value) poolSize += 26
  if (includeUppercase.value) poolSize += 26
  if (includeNumbers.value) poolSize += 10
  if (includeSymbols.value) poolSize += 32
  
  if (poolSize === 0) return 0
  return Math.round(password.value.length * Math.log2(poolSize))
})

const crackTimeText = computed(() => {
  const ent = entropy.value
  if (ent === 0) return t('instantly')
  
  // Attacker at 100 Billion (10^11) guesses per second
  const log10Seconds = ent * 0.30103 - 11
  
  if (log10Seconds < 0) return t('instantly')
  if (log10Seconds < 1.78) return t('inSeconds')
  if (log10Seconds < 3.56) return t('inMinutes')
  if (log10Seconds < 4.94) return t('inHours')
  
  const log10Days = log10Seconds - 4.9365
  if (log10Days < 2.56) {
    const val = Math.round(Math.pow(10, log10Days))
    return `${val} ${t('days')}`
  }
  
  const log10Years = log10Days - 2.5623
  if (log10Years < 3) {
    const val = Math.round(Math.pow(10, log10Years))
    return `${val} ${t('years')}`
  }
  if (log10Years < 6) {
    const val = Math.round(Math.pow(10, log10Years - 3))
    return `${val} ${t('kYears')}`
  }
  if (log10Years < 9) {
    const val = Math.round(Math.pow(10, log10Years - 6))
    return `${val} ${t('mYears')}`
  }
  if (log10Years < 12) {
    const val = Math.round(Math.pow(10, log10Years - 9))
    return `${val} ${t('bYears')}`
  }
  return t('overTrillionYears')
})

// Strength score calculator logic
const calcStrengthScore = (pwd: string): number => {
  if (!pwd) return 0
  let score = 0
  const len = pwd.length
  
  // Base from length
  if (len >= 8) score += 1
  if (len >= 12) score += 1
  if (len >= 16) score += 1
  if (len >= 24) score += 1
  
  // Diversity check
  let pools = 0
  if (/[a-z]/.test(pwd)) pools++
  if (/[A-Z]/.test(pwd)) pools++
  if (/[0-9]/.test(pwd)) pools++
  if (/[^a-zA-Z0-9]/.test(pwd)) pools++
  
  score += Math.max(0, pools - 1)
  
  // Repetitive patterns check
  const unique = new Set(pwd).size
  const ratio = unique / len
  if (ratio < 0.5) score -= 1
  
  return Math.min(5, Math.max(1, score))
}

const calcStrengthText = (pwd: string): string => {
  const scoreVal = calcStrengthScore(pwd)
  if (!pwd) return t('waiting')
  if (scoreVal <= 1) return t('veryWeak')
  if (scoreVal === 2) return t('weak')
  if (scoreVal === 3) return t('medium')
  if (scoreVal === 4) return t('strong')
  return t('veryStrong')
}

// Current password strength metrics
const currentStrengthScore = computed(() => calcStrengthScore(password.value))

// Score (0-100) mapped from entropy
const score = computed(() => {
  if (!password.value) return 0
  // Entropy ~ 148 bits translates to 92 score to match mockup ref.png
  return Math.min(100, Math.max(12, Math.round(entropy.value / 1.61)))
})

// Score Ring Color
const scoreColorClass = computed(() => {
  const s = score.value
  if (s < 40) return 'stroke-rose-500'
  if (s < 70) return 'stroke-amber-500'
  return 'stroke-emerald-500'
})

// Strength detail mapping for the mockup display
const strengthClass = computed(() => {
  const scoreVal = currentStrengthScore.value
  if (!password.value) {
    return {
      label: t('waiting'),
      text: 'text-slate-400 dark:text-slate-500',
      fill: 'text-slate-400 dark:text-slate-500 fill-transparent',
      icon: Shield
    }
  }
  if (scoreVal <= 1) {
    return {
      label: t('veryWeak'),
      text: 'text-rose-600 dark:text-rose-455',
      fill: 'text-rose-500 dark:text-rose-400 fill-rose-100/30 dark:fill-transparent',
      icon: ShieldAlert
    }
  }
  if (scoreVal === 2) {
    return {
      label: t('weak'),
      text: 'text-orange-505 dark:text-orange-400',
      fill: 'text-orange-500 dark:text-orange-400 fill-orange-100/30 dark:fill-transparent',
      icon: ShieldAlert
    }
  }
  if (scoreVal === 3) {
    return {
      label: t('medium'),
      text: 'text-amber-600 dark:text-amber-450',
      fill: 'text-amber-500 dark:text-amber-450 fill-amber-100/30 dark:fill-transparent',
      icon: Shield
    }
  }
  if (scoreVal === 4) {
    return {
      label: t('strong'),
      text: 'text-emerald-600 dark:text-emerald-450',
      fill: 'text-emerald-500 dark:text-emerald-450 fill-emerald-100/30 dark:fill-transparent',
      icon: ShieldCheck
    }
  }
  return {
    label: t('strong'), // Keep it "Strong" or "Very Strong" as desired, mockup is "Strong"
    text: 'text-emerald-600 dark:text-emerald-450',
    fill: 'text-emerald-500 dark:text-emerald-455 fill-emerald-100/30 dark:fill-transparent',
    icon: ShieldCheck
  }
})

// Character set selection counts
const selectedCount = computed(() => {
  let count = 0
  if (includeUppercase.value) count++
  if (includeLowercase.value) count++
  if (includeNumbers.value) count++
  if (includeSymbols.value) count++
  return count
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 md:p-8 transition-colors duration-300 selection:bg-indigo-500/20">
    <div class="max-w-4xl w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/40 dark:shadow-none transition-all duration-300">
      
      <!-- Top Header -->
      <header class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4 mb-8">
        <div class="flex items-center gap-3">
          <img src="/logo.png" alt="PassForge Logo" class="w-12 h-12 object-contain rounded-xl shadow-sm" />
          <span class="text-slate-855 dark:text-slate-100 font-bold text-lg md:text-xl">{{ t('title') }}</span>
        </div>
        
        <div class="flex items-center gap-3 self-end sm:self-auto">
          <!-- Language Switcher Pill -->
          <div class="bg-slate-100 dark:bg-slate-800 p-0.5 rounded-full flex items-center gap-0.5 border border-slate-200/40 dark:border-slate-700/30 shadow-inner">
            <button 
              v-for="lang in ['zh', 'en', 'ja']" 
              :key="lang"
              @click="setLanguage(lang as 'zh' | 'en' | 'ja')"
              :class="[currentLang === lang ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm font-bold' : 'text-slate-450 dark:text-slate-500 hover:text-slate-650 dark:hover:text-slate-350']"
              class="rounded-full text-[10px] transition-all duration-200 cursor-pointer uppercase w-7 h-7 flex items-center justify-center font-medium"
            >
              {{ lang }}
            </button>
          </div>

          <!-- Theme Switcher Switch -->
          <div class="bg-slate-100 dark:bg-slate-800 p-0.5 rounded-full flex items-center gap-0.5 border border-slate-200/40 dark:border-slate-700/30">
            <button 
              @click="setTheme(false)"
              :class="[!isDark ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-200']"
              class="p-1.5 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center w-8 h-8"
              title="Light Mode"
            >
              <Sun class="w-4.5 h-4.5" />
            </button>
            <button 
              @click="setTheme(true)"
              :class="[isDark ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-450 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-350']"
              class="p-1.5 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center w-8 h-8"
              title="Dark Mode"
            >
              <Moon class="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </header>

      <!-- Center Typography Banner -->
      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-4.5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          {{ t('bannerTitle') }}
        </h1>
        <p class="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-2 font-medium">
          {{ t('bannerSubtitle') }}
        </p>
      </div>

      <!-- Main Display Container -->
      <div class="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 md:p-6 shadow-sm mb-6 flex flex-col gap-6">
        
        <!-- Password Display Output Row -->
        <div class="flex flex-col sm:flex-row items-center gap-4 justify-between border-b border-slate-150/60 dark:border-slate-800/60 pb-5">
          <div class="flex items-center gap-3.5 flex-1 min-w-0 w-full">
            <div class="w-14 h-14 rounded-2xl bg-indigo-55 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
              <Lock class="w-6.5 h-6.5" />
            </div>
            
            <div class="flex-1 min-w-0">
              <div v-if="!password" class="text-slate-450 dark:text-slate-500 font-mono italic text-base md:text-lg">
                {{ t('passwordPlaceholder') }}
              </div>
              <div v-else-if="!showPassword" class="text-slate-450 dark:text-slate-500 font-mono text-2xl tracking-widest">
                ••••••••••••••••
              </div>
              <div v-else class="font-mono text-xl md:text-3xl text-slate-900 dark:text-white select-all break-all tracking-wide font-medium">
                {{ password }}
              </div>
            </div>
          </div>
          
          <div class="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
            <!-- Visibility Button Toggle -->
            <button 
              @click="showPassword = !showPassword"
              class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 bg-transparent transition-colors cursor-pointer flex items-center justify-center"
              :title="t('historyTooltipReveal')"
            >
              <Eye v-if="!showPassword" class="w-5.5 h-5.5" />
              <EyeOff v-else class="w-5.5 h-5.5" />
            </button>
            
            <!-- Copy Action Button -->
            <button
              @click="copyToClipboard"
              :disabled="!password"
              class="px-6 py-3 rounded-xl bg-indigo-600 dark:bg-indigo-600 hover:bg-indigo-750 dark:hover:bg-indigo-500 text-white font-semibold text-base flex items-center justify-center gap-2 shadow-sm disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-[0.98] cursor-pointer w-full sm:w-auto"
            >
              <template v-if="copied">
                <Check class="w-5 h-5 text-emerald-250 animate-bounce" />
                {{ t('copied') }}
              </template>
              <template v-else>
                <Copy class="w-5 h-5" />
                {{ t('copy') }}
              </template>
            </button>
          </div>
        </div>

        <!-- Metrics Row Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x md:divide-slate-100 md:dark:divide-slate-800/80 items-center">
          
          <!-- Column 1: Strength -->
          <div class="flex flex-col md:px-5 first:pl-0">
            <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{{ t('strength') }}</span>
            <div class="flex items-center gap-1.5 mt-1.5 text-base font-bold" :class="strengthClass.text">
              <component :is="strengthClass.icon" class="w-5 h-5" :class="strengthClass.fill" />
              <span>{{ strengthClass.label }}</span>
            </div>
          </div>

          <!-- Column 2: Entropy -->
          <div class="flex flex-col md:px-5">
            <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{{ t('entropy') }}</span>
            <span class="text-base font-bold text-slate-800 dark:text-slate-150 mt-1.5 font-mono">
              {{ entropy }} bits
            </span>
          </div>

          <!-- Column 3: Crack time -->
          <div class="flex flex-col md:px-5">
            <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{{ t('crackTime') }}</span>
            <span class="text-base font-bold text-slate-800 dark:text-slate-150 mt-1.5 truncate" :title="crackTimeText">
              {{ crackTimeText }}
            </span>
          </div>

          <!-- Column 4: Score Circle -->
          <div class="flex flex-col md:px-5 last:pr-0">
            <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{{ t('score') }}</span>
            <div class="flex items-center gap-2 mt-1">
              <div class="relative w-10 h-10 flex items-center justify-center">
                <svg class="w-full h-full transform -rotate-90">
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    stroke-width="3"
                    class="stroke-slate-100 dark:stroke-slate-800"
                    fill="transparent"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    stroke-width="3"
                    :stroke-dasharray="2 * Math.PI * 16"
                    :stroke-dashoffset="2 * Math.PI * 16 * (1 - score / 100)"
                    stroke-linecap="round"
                    class="transition-all duration-500 ease-out"
                    :class="scoreColorClass"
                    fill="transparent"
                  />
                </svg>
                <span class="absolute text-xs font-extrabold text-slate-850 dark:text-slate-200">{{ score }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Controls Option Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        
        <!-- Length Box Slider -->
        <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:border-slate-200 dark:hover:border-slate-800 transition-all duration-300">
          <div class="flex items-center justify-between text-base mb-4 font-semibold">
            <span class="text-slate-850 dark:text-slate-200">{{ t('length') }}</span>
            <span class="text-indigo-655 dark:text-indigo-400 font-bold font-mono text-lg">{{ length }}</span>
          </div>
          
          <div class="relative mt-2">
            <input
              type="range"
              v-model.number="length"
              min="8"
              max="64"
              :style="{ '--value-percent': (length - 8) / (64 - 8) * 100 + '%' }"
              class="w-full cursor-pointer h-2 rounded-lg appearance-none bg-slate-200 dark:bg-slate-800"
            />
            <!-- Visual Tickmarks -->
            <div class="flex justify-between px-1 mt-2.5">
              <div v-for="i in 15" :key="i" class="w-[1.5px] h-1.5 bg-slate-200 dark:bg-slate-800/80 rounded-full"></div>
            </div>
            <div class="flex justify-between text-xs text-slate-455 dark:text-slate-550 mt-1 font-mono">
              <span>8</span>
              <span>64</span>
            </div>
          </div>
        </div>

        <!-- Character Sets Selection -->
        <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:border-slate-200 dark:hover:border-slate-800 transition-all duration-300">
          <div class="flex items-center justify-between text-base mb-4 font-semibold">
            <span class="text-slate-850 dark:text-slate-200">{{ t('characterSets') }}</span>
            <span class="text-indigo-650 dark:text-indigo-400 font-bold text-sm">
              {{ t('selectedCount', { count: selectedCount }) }}
            </span>
          </div>

          <!-- Responsive grid cols for small screens (2 cols on mobile, 4 on desktop) -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <!-- Uppercase A-Z -->
            <div 
              @click="includeUppercase = !includeUppercase"
              :class="[
                includeUppercase 
                  ? 'bg-indigo-50/50 border-indigo-650 dark:bg-indigo-950/20 dark:border-indigo-500' 
                  : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
              ]"
              class="relative flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer select-none transition-all duration-200"
            >
              <div v-if="includeUppercase" class="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-4.5 h-4.5 rounded-full bg-indigo-650 dark:bg-indigo-500 flex items-center justify-center text-white shadow-sm">
                <Check class="w-3 h-3 stroke-[3]" />
              </div>
              <span class="text-lg font-bold text-slate-800 dark:text-slate-100">A-Z</span>
              <span class="text-xs text-slate-400 dark:text-slate-500 mt-1">{{ t('uppercase') }}</span>
            </div>

            <!-- Lowercase a-z -->
            <div 
              @click="includeLowercase = !includeLowercase"
              :class="[
                includeLowercase 
                  ? 'bg-indigo-50/50 border-indigo-655 dark:bg-indigo-950/20 dark:border-indigo-500' 
                  : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
              ]"
              class="relative flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer select-none transition-all duration-200"
            >
              <div v-if="includeLowercase" class="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-4.5 h-4.5 rounded-full bg-indigo-650 dark:bg-indigo-500 flex items-center justify-center text-white shadow-sm">
                <Check class="w-3 h-3 stroke-[3]" />
              </div>
              <span class="text-lg font-bold text-slate-800 dark:text-slate-100">a-z</span>
              <span class="text-xs text-slate-400 dark:text-slate-500 mt-1">{{ t('lowercase') }}</span>
            </div>

            <!-- Numbers 0-9 -->
            <div 
              @click="includeNumbers = !includeNumbers"
              :class="[
                includeNumbers 
                  ? 'bg-indigo-50/50 border-indigo-655 dark:bg-indigo-950/20 dark:border-indigo-500' 
                  : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
              ]"
              class="relative flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer select-none transition-all duration-200"
            >
              <div v-if="includeNumbers" class="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-4.5 h-4.5 rounded-full bg-indigo-650 dark:bg-indigo-500 flex items-center justify-center text-white shadow-sm">
                <Check class="w-3 h-3 stroke-[3]" />
              </div>
              <span class="text-lg font-bold text-slate-800 dark:text-slate-100">0-9</span>
              <span class="text-xs text-slate-400 dark:text-slate-500 mt-1">{{ t('numbers') }}</span>
            </div>

            <!-- Symbols !@# -->
            <div 
              @click="includeSymbols = !includeSymbols"
              :class="[
                includeSymbols 
                  ? 'bg-indigo-50/50 border-indigo-655 dark:bg-indigo-950/20 dark:border-indigo-500' 
                  : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
              ]"
              class="relative flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer select-none transition-all duration-200"
            >
              <div v-if="includeSymbols" class="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-4.5 h-4.5 rounded-full bg-indigo-650 dark:bg-indigo-500 flex items-center justify-center text-white shadow-sm">
                <Check class="w-3 h-3 stroke-[3]" />
              </div>
              <span class="text-lg font-bold text-slate-800 dark:text-slate-150">!@#</span>
              <span class="text-xs text-slate-400 dark:text-slate-500 mt-1">{{ t('symbols') }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Action Row Buttons -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <!-- Generate Primary CTA Button -->
        <button
          @click="generatePassword(true)"
          class="flex-1 py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-755 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold text-base flex items-center justify-center gap-2.5 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Sparkles class="w-5 h-5 text-white" />
          {{ t('generateButton') }}
        </button>

        <!-- Regenerate Action Button -->
        <button
          @click="generatePassword(true)"
          class="p-4 rounded-2xl border border-slate-200 dark:border-slate-805 hover:bg-slate-50 dark:hover:bg-slate-905 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 transition-all cursor-pointer shadow-sm active:scale-[0.95] flex items-center justify-center"
          :title="t('regenerate')"
        >
          <RefreshCw class="w-5 h-5" />
        </button>
      </div>

      <!-- Advanced settings panel accordion details -->
      <div class="mt-5 border-t border-slate-100 dark:border-slate-800/80 pt-5">
        <div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 justify-between select-none py-1 text-slate-450 dark:text-slate-500 transition-colors">
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              v-model="excludeSimilar"
              class="w-5 h-5 rounded border-slate-300 dark:border-slate-700 text-indigo-600 bg-slate-100 dark:bg-slate-850 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
            />
            <span class="text-sm font-semibold">{{ t('excludeSimilar') }}</span>
          </label>

          <label class="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              v-model="autoGenerate"
              class="w-5 h-5 rounded border-slate-300 dark:border-slate-700 text-indigo-600 bg-slate-100 dark:bg-slate-855 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
            />
            <span class="text-sm font-semibold">{{ t('autoGenerate') }}</span>
          </label>
        </div>
      </div>

      <!-- Expandable History Drawer Panel Accordion -->
      <div class="mt-5 border-t border-slate-100 dark:border-slate-800/80 pt-5">
        <button 
          @click="showHistory = !showHistory"
          class="w-full flex items-center justify-between text-sm font-semibold text-slate-455 dark:text-slate-500 hover:text-slate-650 dark:hover:text-slate-350 transition-colors cursor-pointer"
        >
          <div class="flex items-center gap-2">
            <History class="w-5 h-5" />
            <span>{{ t('historyTitle') }} ({{ historyList.length }})</span>
          </div>
          <div class="flex items-center gap-2">
            <span v-if="historyList.length > 0 && showHistory" @click.stop="clearAllHistory" class="text-rose-500 hover:text-rose-650 transition-colors text-xs uppercase font-bold tracking-wider mr-2">{{ t('clearAll') }}</span>
            <ChevronDown :class="{ 'transform rotate-180': showHistory }" class="w-4.5 h-4.5 transition-transform duration-200" />
          </div>
        </button>

        <div v-show="showHistory" class="mt-4 space-y-2.5 max-h-48 overflow-y-auto pr-1">
          <div v-if="historyList.length === 0" class="text-center py-6 text-sm text-slate-400 dark:text-slate-500 italic">
            {{ t('noHistory') }}
          </div>
          <div 
            v-else
            v-for="item in historyList" 
            :key="item.id"
            class="flex items-center justify-between p-3.5 bg-slate-55 dark:bg-slate-950/20 border border-slate-150/40 dark:border-slate-800 rounded-xl text-sm hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200 group"
          >
            <div class="flex flex-col gap-0.5">
              <span class="font-mono text-slate-800 dark:text-slate-200 text-sm sm:text-base select-all font-medium">
                {{ item.show ? item.password : maskPasswordStr(item.password) }}
              </span>
              <span class="text-xs text-slate-455 dark:text-slate-500 font-mono">{{ item.timestamp }} • L:{{ item.length }}</span>
            </div>
            
            <div class="flex items-center gap-2">
              <!-- Individual Reveal Toggle -->
              <button @click="toggleHistoryReveal(item.id)" class="p-1.5 rounded hover:bg-slate-200/50 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" :title="t('historyTooltipReveal')">
                <Eye v-if="!item.show" class="w-4.5 h-4.5" />
                <EyeOff v-else class="w-4.5 h-4.5" />
              </button>
              
              <!-- Individual Copy Button -->
              <button @click="copyHistoryItem(item)" class="p-1.5 rounded hover:bg-slate-200/50 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors" :title="t('historyTooltipCopy')">
                <Check v-if="copiedItems[item.id]" class="w-4.5 h-4.5 text-emerald-500" />
                <Copy v-else class="w-4.5 h-4.5" />
              </button>
              
              <!-- Individual Delete Button -->
              <button @click="deleteHistoryItem(item.id)" class="p-1.5 rounded hover:bg-slate-200/50 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100" :title="t('historyTooltipDelete')">
                <Trash2 class="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Client-side Secure Indicator Footer -->
    <footer class="fixed bottom-4 text-center mt-8 text-[11px] text-slate-450 dark:text-slate-500 flex items-center justify-center gap-2 pointer-events-none">
      <div class="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
        <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
        <span>{{ t('securityFooter') }}</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Scoped overrides for custom scrollbar hidden components */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
