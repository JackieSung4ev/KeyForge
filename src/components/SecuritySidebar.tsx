import React, { useState } from 'react'
import {
  Activity,
  Check,
  ChevronDown,
  Copy,
  Eye,
  EyeOff,
  History,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from 'lucide-react'
import type { HistoryItem, PasswordMetrics } from '../types/password'
import type { TranslationKey } from '../i18n/translations'
import { maskPassword } from '../utils/password'

interface SecuritySidebarProps {
  password: string
  metrics: PasswordMetrics
  historyList: HistoryItem[]
  onCopyHistoryItem: (item: HistoryItem) => void
  onDeleteHistoryItem: (id: string) => void
  onClearHistory: () => void
  copiedHistoryIds: Record<string, boolean>
  t: (key: TranslationKey, replacements?: Record<string, string | number>) => string
}

export const SecuritySidebar: React.FC<SecuritySidebarProps> = ({
  password,
  metrics,
  historyList,
  onCopyHistoryItem,
  onDeleteHistoryItem,
  onClearHistory,
  copiedHistoryIds,
  t,
}) => {
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({})
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false)

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const totalChars = Math.max(1, password.length)
  const upperPct = Math.round((metrics.counts.uppercase / totalChars) * 100)
  const lowerPct = Math.round((metrics.counts.lowercase / totalChars) * 100)
  const numPct = Math.round((metrics.counts.numbers / totalChars) * 100)
  const symPct = Math.round((metrics.counts.symbols / totalChars) * 100)

  const auditTip =
    metrics.score >= 75
      ? t('auditTipStrong')
      : metrics.score >= 45
        ? t('auditTipMedium')
        : t('auditTipWeak')

  return (
    <aside className="flex flex-col gap-6 lg:gap-8">
      {/* Card 1: Password Anatomy & Character Distribution */}
      <div className="bg-slate-50/80 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/90 rounded-2xl p-6 lg:p-7">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {t('securityAudit')}
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
            L = {password.length}
          </span>
        </div>

        {/* Multi-segment Distribution Bar */}
        <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex gap-0.5 p-0.5 mb-3.5">
          {password.length > 0 && (
            <>
              {metrics.counts.uppercase > 0 && (
                <div
                  style={{ width: `${upperPct}%` }}
                  className="h-full bg-violet-500 rounded-l-full transition-all duration-300"
                  title={`A-Z: ${metrics.counts.uppercase}`}
                />
              )}
              {metrics.counts.lowercase > 0 && (
                <div
                  style={{ width: `${lowerPct}%` }}
                  className="h-full bg-slate-600 dark:bg-slate-300 transition-all duration-300"
                  title={`a-z: ${metrics.counts.lowercase}`}
                />
              )}
              {metrics.counts.numbers > 0 && (
                <div
                  style={{ width: `${numPct}%` }}
                  className="h-full bg-indigo-500 transition-all duration-300"
                  title={`0-9: ${metrics.counts.numbers}`}
                />
              )}
              {metrics.counts.symbols > 0 && (
                <div
                  style={{ width: `${symPct}%` }}
                  className="h-full bg-emerald-500 rounded-r-full transition-all duration-300"
                  title={`!@#: ${metrics.counts.symbols}`}
                />
              )}
            </>
          )}
        </div>

        {/* 4 Breakdown Pills */}
        <div className="grid grid-cols-4 gap-2.5 lg:gap-3.5 mb-5">
          {[
            {
              label: 'A-Z',
              count: metrics.counts.uppercase,
              dot: 'bg-violet-500',
            },
            {
              label: 'a-z',
              count: metrics.counts.lowercase,
              dot: 'bg-slate-600 dark:bg-slate-300',
            },
            {
              label: '0-9',
              count: metrics.counts.numbers,
              dot: 'bg-indigo-500',
            },
            {
              label: '!@#',
              count: metrics.counts.symbols,
              dot: 'bg-emerald-500',
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-xl px-3 py-2.5 flex flex-col items-center"
            >
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                <span>{item.label}</span>
              </div>
              <span className="text-sm font-extrabold font-mono text-slate-800 dark:text-slate-100 mt-1">
                {item.count}
              </span>
            </div>
          ))}
        </div>

        {/* Security Advice Callout */}
        <div
          className={`flex items-start gap-2.5 p-3.5 rounded-xl text-xs leading-relaxed border ${
            metrics.score >= 75
              ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/70 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300'
              : metrics.score >= 45
                ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/70 dark:border-amber-900/50 text-amber-800 dark:text-amber-300'
                : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200/70 dark:border-rose-900/50 text-rose-800 dark:text-rose-300'
          }`}
        >
          {metrics.score >= 75 ? (
            <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
          ) : (
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
          )}
          <span>{auditTip}</span>
        </div>
      </div>

      {/* Card 2: Password History (Always expanded on lg+ screens, collapsible drawer on <lg) */}
      <div className="bg-slate-50/80 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/90 rounded-2xl p-6 lg:p-7 flex flex-col">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMobileHistoryOpen((prev) => !prev)}
            className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100 cursor-pointer lg:cursor-default"
          >
            <History className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
            <span>
              {t('historyTitle')} ({historyList.length})
            </span>
          </button>

          <div className="flex items-center gap-2">
            {historyList.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors text-xs font-bold tracking-wide cursor-pointer"
              >
                {t('clearAll')}
              </button>
            )}
            <button
              type="button"
              onClick={() => setMobileHistoryOpen((prev) => !prev)}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              aria-label="Toggle history"
            >
              <ChevronDown
                className={`w-4.5 h-4.5 transition-transform duration-200 ${
                  mobileHistoryOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* History List Body */}
        <div
          className={`${
            mobileHistoryOpen ? 'block' : 'hidden'
          } lg:block mt-5 space-y-3 max-h-80 lg:max-h-[400px] overflow-y-auto pr-1`}
        >
          {historyList.length === 0 ? (
            <div className="text-center py-8 px-4 text-xs sm:text-sm text-slate-400 dark:text-slate-500 italic bg-white/50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
              {t('noHistory')}
            </div>
          ) : (
            historyList.map((item) => {
              const isShown = !!revealedIds[item.id]
              const isItemCopied = !!copiedHistoryIds[item.id]
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 p-3 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-xl text-sm hover:border-indigo-300 dark:hover:border-slate-700 transition-all duration-200"
                >
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <span className="font-mono text-slate-800 dark:text-slate-200 text-xs sm:text-sm select-all font-medium truncate">
                      {isShown ? item.password : maskPassword(item.password)}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                      <span>{item.timestamp}</span>
                      <span>•</span>
                      <span>L:{item.length}</span>
                      {item.entropy ? (
                        <>
                          <span>•</span>
                          <span>{item.entropy}b</span>
                        </>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleReveal(item.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                      title={t('historyTooltipReveal')}
                      aria-label={t('historyTooltipReveal')}
                    >
                      {!isShown ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onCopyHistoryItem(item)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                      title={t('historyTooltipCopy')}
                      aria-label={t('historyTooltipCopy')}
                    >
                      {isItemCopied ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteHistoryItem(item.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                      title={t('historyTooltipDelete')}
                      aria-label={t('historyTooltipDelete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Storage Footer Info */}
        <div
          className={`${
            mobileHistoryOpen ? 'flex' : 'hidden'
          } lg:flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/70`}
        >
          <span>{t('storageInfo')}</span>
          <span>{t('capacityInfo')}</span>
        </div>
      </div>
    </aside>
  )
}
