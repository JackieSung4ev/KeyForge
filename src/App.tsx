import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Keyboard, Shield } from 'lucide-react'
import type { HistoryItem, Language, PasswordOptions } from './types/password'
import { createTranslator } from './i18n/translations'
import {
  calculatePasswordMetrics,
  generatePasswordFromOptions,
} from './utils/password'
import { Header } from './components/Header'
import { PasswordDisplay } from './components/PasswordDisplay'
import { GeneratorControls } from './components/GeneratorControls'
import { SecuritySidebar } from './components/SecuritySidebar'

const HISTORY_STORAGE_KEY = 'passforge_pwd_history'
const MAX_HISTORY_ITEMS = 20

const DEFAULT_OPTIONS: PasswordOptions = {
  mode: 'random',
  length: 30,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeSimilar: false,
  wordCount: 4,
  separator: '-',
  capitalizeWords: true,
  includePassphraseNumber: true,
  pinLength: 6,
  avoidRepeatingPin: true,
  autoGenerate: true,
}

const LANG_STORAGE_KEY = 'keyforge_lang'

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en'
  const stored = localStorage.getItem(LANG_STORAGE_KEY)
  if (stored === 'zh' || stored === 'en' || stored === 'ja') {
    return stored
  }
  return 'en'
}

function getInitialTheme(): boolean {
  if (typeof window === 'undefined') return false
  const stored = localStorage.getItem('theme')
  if (stored === 'dark') return true
  if (stored === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function getInitialHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return []
  const raw =
    localStorage.getItem(HISTORY_STORAGE_KEY) ||
    localStorage.getItem('cyber_pwd_history')
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.slice(0, MAX_HISTORY_ITEMS).map((item: any) => ({
      id: String(item.id || Math.random().toString(36).slice(2, 9)),
      password: String(item.password || ''),
      mode: item.mode || 'random',
      length: Number(item.length || (item.password ? item.password.length : 0)),
      entropy: Number(item.entropy || 0),
      strengthLevel: item.strengthLevel || 'strong',
      strengthScore: Number(item.strengthScore || 80),
      timestamp: String(item.timestamp || ''),
    }))
  } catch {
    return []
  }
}

export const App: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<Language>(getInitialLanguage)
  const [isDark, setIsDark] = useState<boolean>(getInitialTheme)
  const [options, setOptions] = useState<PasswordOptions>(DEFAULT_OPTIONS)
  const [password, setPassword] = useState<string>(() =>
    generatePasswordFromOptions(DEFAULT_OPTIONS)
  )
  const [showPassword, setShowPassword] = useState<boolean>(true)
  const [isCustomEdit, setIsCustomEdit] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [historyList, setHistoryList] = useState<HistoryItem[]>(getInitialHistory)
  const [copiedHistoryIds, setCopiedHistoryIds] = useState<Record<string, boolean>>({})

  const copyTimeoutRef = useRef<number | null>(null)
  const t = useMemo(() => createTranslator(currentLang), [currentLang])

  // Sync theme with <html>
  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  // Sync language with <html> and localStorage
  useEffect(() => {
    document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : currentLang
    localStorage.setItem(LANG_STORAGE_KEY, currentLang)
  }, [currentLang])

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(historyList))
    } catch (e) {
      console.error('Failed to persist password history', e)
    }
  }, [historyList])

  // Calculate current password metrics
  const metrics = useMemo(
    () => calculatePasswordMetrics(password, options, isCustomEdit),
    [password, options, isCustomEdit]
  )

  // Add a password to history
  const pushToHistory = useCallback(
    (pwd: string, currentOpts: PasswordOptions) => {
      if (!pwd) return
      setHistoryList((prev) => {
        if (prev.length > 0 && prev[0].password === pwd) {
          return prev
        }
        const m = calculatePasswordMetrics(pwd, currentOpts, false)
        const now = new Date()
        const timestamp = now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
        const newItem: HistoryItem = {
          id: Math.random().toString(36).substring(2, 9),
          password: pwd,
          mode: currentOpts.mode,
          length: pwd.length,
          entropy: m.entropy,
          strengthLevel: m.strengthLevel,
          strengthScore: m.score,
          timestamp,
        }
        return [newItem, ...prev.filter((item) => item.password !== pwd)].slice(
          0,
          MAX_HISTORY_ITEMS
        )
      })
    },
    []
  )

  // Trigger password generation
  const triggerGenerate = useCallback(
    (nextOptions: PasswordOptions, saveToHistory: boolean) => {
      setIsGenerating(true)
      setIsCustomEdit(false)
      const generated = generatePasswordFromOptions(nextOptions)
      setPassword(generated)
      if (saveToHistory && generated) {
        pushToHistory(generated, nextOptions)
      }
      window.setTimeout(() => {
        setIsGenerating(false)
      }, 180)
    },
    [pushToHistory]
  )

  // Update options handler
  const handleUpdateOptions = useCallback(
    (partial: Partial<PasswordOptions>) => {
      setOptions((prev) => {
        const next = { ...prev, ...partial }
        if (next.autoGenerate) {
          const generated = generatePasswordFromOptions(next)
          setPassword(generated)
          setIsCustomEdit(false)
        }
        return next
      })
    },
    []
  )

  // Copy active password to clipboard
  const handleCopy = useCallback(async () => {
    if (!password) return
    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      pushToHistory(password, options)
      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current)
      }
      copyTimeoutRef.current = window.setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy password', err)
    }
  }, [password, options, pushToHistory])

  // Copy history item
  const handleCopyHistoryItem = useCallback(async (item: HistoryItem) => {
    try {
      await navigator.clipboard.writeText(item.password)
      setCopiedHistoryIds((prev) => ({ ...prev, [item.id]: true }))
      window.setTimeout(() => {
        setCopiedHistoryIds((prev) => ({ ...prev, [item.id]: false }))
      }, 1500)
    } catch (err) {
      console.error('Failed to copy history item', err)
    }
  }, [])

  // Delete single history item
  const handleDeleteHistoryItem = useCallback((id: string) => {
    setHistoryList((prev) => prev.filter((item) => item.id !== id))
  }, [])

  // Clear all history
  const handleClearHistory = useCallback(() => {
    if (window.confirm(t('confirmClear'))) {
      setHistoryList([])
    }
  }, [t])

  // Keyboard shortcuts: ESC to exit edit mode, R to regenerate, C to copy
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCustomEdit) {
        e.preventDefault()
        setIsCustomEdit(false)
        if (!password) {
          setPassword(generatePasswordFromOptions(options))
        }
        return
      }

      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return

      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault()
        triggerGenerate(options, true)
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault()
        handleCopy()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isCustomEdit, password, options, triggerGenerate, handleCopy])

  const handleToggleCustomEdit = useCallback(() => {
    setIsCustomEdit((prev) => {
      const next = !prev
      if (!next && !password) {
        setPassword(generatePasswordFromOptions(options))
      }
      return next
    })
  }, [password, options])

  return (
    <div className="min-h-screen flex flex-col justify-between px-4 py-5 sm:px-8 sm:py-8 lg:px-12 lg:py-10 xl:px-16 xl:py-12 transition-colors duration-300 selection:bg-indigo-500/20">
      {/* Main Adaptive Wrapper:
          - Full width up to 1760px on ultra-wide / large desktop monitors
          - Generous internal padding and module spacing */}
      <main className="w-full max-w-[1760px] mx-auto my-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/90 rounded-3xl p-5 sm:p-8 md:p-10 lg:p-12 xl:p-14 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300">
        {/* Top Header */}
        <Header
          currentLang={currentLang}
          onSelectLang={setCurrentLang}
          isDark={isDark}
          onToggleTheme={setIsDark}
          t={t}
        />

        {/* Hero Banner */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            {t('bannerTitle')}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-slate-400 mt-3 font-medium">
            {t('bannerSubtitle')}
          </p>
        </div>

        {/* Adaptive 12-Column Grid for Desktop & Large Monitors */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
          {/* Left / Primary Generator Column (7 cols on lg, 8 cols on xl) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
            <PasswordDisplay
              password={password}
              showPassword={showPassword}
              onToggleShow={() => setShowPassword((prev) => !prev)}
              copied={copied}
              onCopy={handleCopy}
              onRegenerate={() => triggerGenerate(options, true)}
              isGenerating={isGenerating}
              isCustomEdit={isCustomEdit}
              onToggleCustomEdit={handleToggleCustomEdit}
              onExitCustomEdit={() => {
                setIsCustomEdit(false)
                if (!password) {
                  setPassword(generatePasswordFromOptions(options))
                }
              }}
              onCustomPasswordChange={setPassword}
              metrics={metrics}
              t={t}
            />

            <GeneratorControls
              options={options}
              onUpdateOptions={handleUpdateOptions}
              onGenerateManual={() => triggerGenerate(options, true)}
              isGenerating={isGenerating}
              t={t}
            />
          </div>

          {/* Right / Security Anatomy & History Column (5 cols on lg, 4 cols on xl) */}
          <div className="lg:col-span-5 xl:col-span-4">
            <SecuritySidebar
              password={password}
              metrics={metrics}
              historyList={historyList}
              onCopyHistoryItem={handleCopyHistoryItem}
              onDeleteHistoryItem={handleDeleteHistoryItem}
              onClearHistory={handleClearHistory}
              copiedHistoryIds={copiedHistoryIds}
              t={t}
            />
          </div>
        </div>
      </main>

      {/* Bottom Security & Keyboard Shortcut Footer (Non-overlapping on mobile & desktop) */}
      <footer className="w-full max-w-[1760px] mx-auto mt-8 pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200/70 dark:border-slate-800 shadow-2xs">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse flex-shrink-0" />
          <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span className="truncate">{t('securityFooter')}</span>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200/70 dark:border-slate-800 shadow-2xs font-mono">
          <Keyboard className="w-3.5 h-3.5 text-indigo-500" />
          <span>{t('shortcutHint')}</span>
        </div>
      </footer>
    </div>
  )
}

export default App
