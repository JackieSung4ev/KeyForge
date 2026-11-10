import React from 'react'
import { KeyRound, Moon, Sun, ShieldCheck } from 'lucide-react'
import type { Language } from '../types/password'
import type { TranslationKey } from '../i18n/translations'

interface HeaderProps {
  currentLang: Language
  onSelectLang: (lang: Language) => void
  isDark: boolean
  onToggleTheme: (dark: boolean) => void
  t: (key: TranslationKey, replacements?: Record<string, string | number>) => string
}

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'zh', label: 'ZH' },
  { code: 'ja', label: 'JA' },
]

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onSelectLang,
  isDark,
  onToggleTheme,
  t,
}) => {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 lg:pb-8 lg:mb-10 border-b border-slate-200/80 dark:border-slate-800/80">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20 ring-1 ring-white/20 flex-shrink-0">
          <KeyRound className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.2]" />
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 flex items-center justify-center">
            <ShieldCheck className="w-2.5 h-2.5 text-white stroke-[2.5]" />
          </span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-slate-900 dark:text-white font-extrabold text-base sm:text-lg tracking-tight">
              {t('title')}
            </span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
              v2.0
            </span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {t('brandSub')}
          </span>
        </div>
      </div>

      {/* Right Controls: Language & Theme */}
      <div className="flex items-center gap-2 sm:gap-2.5 ml-auto">
        {/* Language Switcher Pill */}
        <div
          className="bg-slate-100 dark:bg-slate-800/90 p-1 rounded-full flex items-center gap-0.5 border border-slate-200/70 dark:border-slate-700/60"
          role="group"
          aria-label="Language switcher"
        >
          {LANGUAGES.map(({ code, label }) => {
            const active = currentLang === code
            return (
              <button
                key={code}
                type="button"
                onClick={() => onSelectLang(code)}
                className={`rounded-full text-[11px] transition-all duration-200 cursor-pointer uppercase px-2.5 h-7 flex items-center justify-center font-bold tracking-wider ${
                  active
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Theme Switcher Pill */}
        <div
          className="bg-slate-100 dark:bg-slate-800/90 p-1 rounded-full flex items-center gap-0.5 border border-slate-200/70 dark:border-slate-700/60"
          role="group"
          aria-label="Theme switcher"
        >
          <button
            type="button"
            onClick={() => onToggleTheme(false)}
            className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center w-7 h-7 ${
              !isDark
                ? 'bg-white text-amber-500 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={t('themeLight')}
            aria-label={t('themeLight')}
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onToggleTheme(true)}
            className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center w-7 h-7 ${
              isDark
                ? 'bg-slate-700 text-indigo-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title={t('themeDark')}
            aria-label={t('themeDark')}
          >
            <Moon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
