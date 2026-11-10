import React from 'react'
import {
  Check,
  Copy,
  Eye,
  EyeOff,
  Lock,
  PenLine,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  WandSparkles,
} from 'lucide-react'
import type { PasswordMetrics } from '../types/password'
import type { TranslationKey } from '../i18n/translations'

interface PasswordDisplayProps {
  password: string
  showPassword: boolean
  onToggleShow: () => void
  copied: boolean
  onCopy: () => void
  onRegenerate: () => void
  isGenerating: boolean
  isCustomEdit: boolean
  onToggleCustomEdit: () => void
  onExitCustomEdit: () => void
  onCustomPasswordChange: (val: string) => void
  metrics: PasswordMetrics
  t: (key: TranslationKey, replacements?: Record<string, string | number>) => string
}

export const PasswordDisplay: React.FC<PasswordDisplayProps> = ({
  password,
  showPassword,
  onToggleShow,
  copied,
  onCopy,
  onRegenerate,
  isGenerating,
  isCustomEdit,
  onToggleCustomEdit,
  onExitCustomEdit,
  onCustomPasswordChange,
  metrics,
  t,
}) => {
  // Format crack time string
  const crackTimeDisplay = React.useMemo(() => {
    if (metrics.crackTimeValue !== undefined) {
      return `${metrics.crackTimeValue} ${t(metrics.crackTimeKey)}`
    }
    return t(metrics.crackTimeKey)
  }, [metrics.crackTimeKey, metrics.crackTimeValue, t])

  // Strength presentation metadata
  const strengthMeta = React.useMemo(() => {
    switch (metrics.strengthLevel) {
      case 'waiting':
        return {
          label: t('waiting'),
          textClass: 'text-slate-400 dark:text-slate-500',
          badgeBg: 'bg-slate-100 dark:bg-slate-800/60',
          Icon: Shield,
        }
      case 'veryWeak':
        return {
          label: t('veryWeak'),
          textClass: 'text-rose-600 dark:text-rose-400',
          badgeBg: 'bg-rose-50 dark:bg-rose-950/40',
          Icon: ShieldAlert,
        }
      case 'weak':
        return {
          label: t('weak'),
          textClass: 'text-orange-600 dark:text-orange-400',
          badgeBg: 'bg-orange-50 dark:bg-orange-950/40',
          Icon: ShieldAlert,
        }
      case 'medium':
        return {
          label: t('medium'),
          textClass: 'text-amber-600 dark:text-amber-400',
          badgeBg: 'bg-amber-50 dark:bg-amber-950/40',
          Icon: Shield,
        }
      case 'strong':
        return {
          label: t('strong'),
          textClass: 'text-emerald-600 dark:text-emerald-400',
          badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40',
          Icon: ShieldCheck,
        }
      case 'veryStrong':
        return {
          label: t('veryStrong'),
          textClass: 'text-emerald-600 dark:text-emerald-400',
          badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40',
          Icon: ShieldCheck,
        }
    }
  }, [metrics.strengthLevel, t])

  const scoreRingStroke = React.useMemo(() => {
    if (metrics.score < 40) return 'stroke-rose-500'
    if (metrics.score < 70) return 'stroke-amber-500'
    return 'stroke-emerald-500'
  }, [metrics.score])

  // Render color-coded password characters for high legibility
  const renderColoredPassword = (pwd: string) => {
    return pwd.split('').map((char, index) => {
      if (/[0-9]/.test(char)) {
        return (
          <span
            key={index}
            className="text-indigo-600 dark:text-indigo-400 font-semibold"
          >
            {char}
          </span>
        )
      }
      if (/[^a-zA-Z0-9]/.test(char)) {
        return (
          <span
            key={index}
            className="text-emerald-600 dark:text-emerald-400 font-semibold"
          >
            {char}
          </span>
        )
      }
      return (
        <span key={index} className="text-slate-900 dark:text-white">
          {char}
        </span>
      )
    })
  }

  const StrengthIcon = strengthMeta.Icon
  const circumference = 2 * Math.PI * 16

  return (
    <div className="bg-slate-50/80 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/90 rounded-2xl p-5 sm:p-7 lg:p-8 shadow-xs mb-7 lg:mb-9 flex flex-col gap-6 lg:gap-7">
      {/* Top Row: Password Output + Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 lg:gap-6 justify-between border-b border-slate-200/70 dark:border-slate-800/80 pb-6">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
            <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <div className="flex-1 min-w-0">
            {isCustomEdit ? (
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={password}
                  onChange={(e) => onCustomPasswordChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape' || e.key === 'Enter') {
                      e.preventDefault()
                      onExitCustomEdit()
                    }
                  }}
                  placeholder={t('customInputPlaceholder')}
                  autoFocus
                  className="w-full bg-white dark:bg-slate-900 border border-indigo-400 dark:border-indigo-500 rounded-xl pl-3.5 pr-16 py-2.5 font-mono text-lg sm:text-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
                <button
                  type="button"
                  onClick={onExitCustomEdit}
                  className="absolute right-2.5 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 cursor-pointer transition-colors"
                  title={t('exitEdit')}
                >
                  ESC
                </button>
              </div>
            ) : !password ? (
              <div className="text-slate-400 dark:text-slate-500 font-mono italic text-sm sm:text-base">
                {t('passwordPlaceholder')}
              </div>
            ) : !showPassword ? (
              <div className="text-slate-400 dark:text-slate-500 font-mono text-xl sm:text-2xl tracking-widest select-none truncate">
                {'•'.repeat(Math.min(24, Math.max(12, password.length)))}
              </div>
            ) : (
              <div className="font-mono text-lg sm:text-2xl md:text-[26px] leading-snug select-all break-all tracking-wide font-medium">
                {renderColoredPassword(password)}
              </div>
            )}

            {/* Subtle Color Legend & Character Count */}
            {password && showPassword && !isCustomEdit && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                <span>{t('colorLegend')}</span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-700 dark:bg-slate-200" />
                  {t('legendLetter')}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  {t('legendNumber')}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {t('legendSymbol')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons Group */}
        <div className="flex items-center gap-2 flex-shrink-0 justify-end">
          {/* Toggle Custom Input / Test Mode */}
          <button
            type="button"
            onClick={onToggleCustomEdit}
            className={`p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
              isCustomEdit
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                : 'border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
            title={isCustomEdit ? t('exitEdit') : t('editPassword')}
            aria-label={isCustomEdit ? t('exitEdit') : t('editPassword')}
          >
            {isCustomEdit ? (
              <WandSparkles className="w-5 h-5" />
            ) : (
              <PenLine className="w-5 h-5" />
            )}
          </button>

          {/* Toggle Visibility */}
          {!isCustomEdit && (
            <button
              type="button"
              onClick={onToggleShow}
              className="p-2.5 sm:p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer flex items-center justify-center"
              title={t('historyTooltipReveal')}
              aria-label={t('historyTooltipReveal')}
            >
              {!showPassword ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </button>
          )}

          {/* Quick Regenerate Button */}
          {!isCustomEdit && (
            <button
              type="button"
              onClick={onRegenerate}
              className="p-2.5 sm:p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors cursor-pointer flex items-center justify-center"
              title={t('regenerate')}
              aria-label={t('regenerate')}
            >
              <RefreshCw
                className={`w-5 h-5 transition-transform duration-300 ${
                  isGenerating ? 'rotate-180' : ''
                }`}
              />
            </button>
          )}

          {/* Primary Copy Button */}
          <button
            type="button"
            onClick={onCopy}
            disabled={!password}
            className="flex-1 sm:flex-initial px-5 py-2.5 sm:py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm shadow-indigo-500/20 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-[0.98] cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4.5 h-4.5 text-emerald-300 animate-bounce" />
                <span>{t('copied')}</span>
              </>
            ) : (
              <>
                <Copy className="w-4.5 h-4.5" />
                <span>{t('copyShort')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Metrics Row Grid (2 cols on mobile, 4 cols on tablet/desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 sm:divide-x sm:divide-slate-200/70 dark:sm:divide-slate-800/80 items-center">
        {/* Column 1: Strength */}
        <div className="flex flex-col sm:px-4 first:pl-0">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {t('strength')}
          </span>
          <div
            className={`flex items-center gap-1.5 mt-1.5 text-sm sm:text-base font-bold ${strengthMeta.textClass}`}
          >
            <StrengthIcon className="w-4.5 h-4.5 flex-shrink-0" />
            <span className="truncate">{strengthMeta.label}</span>
          </div>
        </div>

        {/* Column 2: Entropy */}
        <div className="flex flex-col sm:px-4">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {t('entropy')}
          </span>
          <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 mt-1.5 font-mono">
            {metrics.entropy} <span className="text-xs font-normal text-slate-500">bits</span>
          </span>
        </div>

        {/* Column 3: Crack time */}
        <div className="flex flex-col sm:px-4">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {t('crackTime')}
          </span>
          <span
            className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 mt-1.5 truncate"
            title={crackTimeDisplay}
          >
            {crackTimeDisplay}
          </span>
        </div>

        {/* Column 4: Score Circle */}
        <div className="flex items-center justify-between sm:justify-start gap-3 sm:px-4 last:pr-0">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {t('score')}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
              {metrics.score} / 100
            </span>
          </div>
          <div className="relative w-11 h-11 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 40 40">
              <circle
                cx="20"
                cy="20"
                r="16"
                strokeWidth="3.5"
                className="stroke-slate-200 dark:stroke-slate-800"
                fill="transparent"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                strokeWidth="3.5"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - metrics.score / 100)}
                strokeLinecap="round"
                className={`transition-all duration-500 ease-out ${scoreRingStroke}`}
                fill="transparent"
              />
            </svg>
            <span className="absolute text-xs font-extrabold text-slate-800 dark:text-slate-100 font-mono">
              {metrics.score}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
