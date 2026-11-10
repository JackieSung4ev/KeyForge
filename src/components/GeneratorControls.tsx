import React from "react";
import { BookOpen, Check, Hash, KeyRound, Minus, Plus, RefreshCw, Sparkles } from "lucide-react";
import type { GeneratorMode, PasswordOptions, SeparatorType } from "../types/password";
import type { TranslationKey } from "../i18n/translations";

interface GeneratorControlsProps {
  options: PasswordOptions;
  onUpdateOptions: (partial: Partial<PasswordOptions>) => void;
  onGenerateManual: () => void;
  isGenerating: boolean;
  t: (key: TranslationKey, replacements?: Record<string, string | number>) => string;
}

const LENGTH_PRESETS = [8, 12, 16, 24, 30, 48, 64];
const WORD_PRESETS = [3, 4, 5, 6, 8];
const PIN_PRESETS = [4, 6, 8, 10, 12];

export const GeneratorControls: React.FC<GeneratorControlsProps> = ({ options, onUpdateOptions, onGenerateManual, isGenerating, t }) => {
  const selectedCharSetsCount = (options.includeUppercase ? 1 : 0) + (options.includeLowercase ? 1 : 0) + (options.includeNumbers ? 1 : 0) + (options.includeSymbols ? 1 : 0);

  const modes: { id: GeneratorMode; label: string; Icon: React.ElementType }[] = [
    { id: "random", label: t("modeRandom"), Icon: KeyRound },
    { id: "passphrase", label: t("modePassphrase"), Icon: BookOpen },
    { id: "pin", label: t("modePin"), Icon: Hash },
  ];

  const separators: { value: SeparatorType; label: string }[] = [
    { value: "-", label: t("sepHyphen") },
    { value: ".", label: t("sepDot") },
    { value: "_", label: t("sepUnderscore") },
    { value: " ", label: t("sepSpace") },
  ];

  const lengthPercent = ((options.length - 8) / (64 - 8)) * 100;
  const wordPercent = ((options.wordCount - 3) / (8 - 3)) * 100;
  const pinPercent = ((options.pinLength - 4) / (12 - 4)) * 100;

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100/90 dark:bg-slate-800/70 rounded-2xl border border-slate-200/70 dark:border-slate-800" role="tablist">
        {modes.map(({ id, label, Icon }) => {
          const active = options.mode === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onUpdateOptions({ mode: id })}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                active
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200/60 dark:border-slate-700/80"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Mode: RANDOM PASSWORD */}
      {options.mode === "random" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Card: Length Slider + Stepper + Quick Presets */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 lg:p-7 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-800 dark:text-slate-200 font-bold text-sm sm:text-base">{t("length")}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onUpdateOptions({ length: Math.max(8, options.length - 1) })}
                    disabled={options.length <= 8}
                    className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer transition-colors"
                    aria-label="Decrease length"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="min-w-10 text-center text-indigo-600 dark:text-indigo-400 font-extrabold font-mono text-lg">{options.length}</span>
                  <button
                    type="button"
                    onClick={() => onUpdateOptions({ length: Math.min(64, options.length + 1) })}
                    disabled={options.length >= 64}
                    className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer transition-colors"
                    aria-label="Increase length"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="relative mt-2">
                <input
                  type="range"
                  min={8}
                  max={64}
                  value={options.length}
                  onChange={(e) => onUpdateOptions({ length: Number(e.target.value) })}
                  style={
                    {
                      "--value-percent": `${lengthPercent}%`,
                    } as React.CSSProperties
                  }
                  className="w-full cursor-pointer"
                />
                {/* Visual Tickmarks */}
                <div className="flex justify-between px-1 mt-2.5">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className="w-[1.5px] h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-1 font-mono">
                  <span>8</span>
                  <span>36</span>
                  <span>64</span>
                </div>
              </div>
            </div>

            {/* Quick Length Preset Pills */}
            <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mr-1">{t("quickLength")}</span>
              <div className="flex items-center gap-1 flex-wrap">
                {LENGTH_PRESETS.map((preset) => {
                  const active = options.length === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => onUpdateOptions({ length: preset })}
                      className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        active ? "bg-indigo-600 text-white shadow-2xs" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Card: Character Sets Selection */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 lg:p-7 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-800 dark:text-slate-200 font-bold text-sm sm:text-base">{t("characterSets")}</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold text-xs sm:text-sm">{t("selectedCount", { count: selectedCharSetsCount })}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 my-auto">
              {[
                {
                  key: "includeUppercase" as const,
                  badge: "A-Z",
                  label: t("uppercase"),
                  checked: options.includeUppercase,
                },
                {
                  key: "includeLowercase" as const,
                  badge: "a-z",
                  label: t("lowercase"),
                  checked: options.includeLowercase,
                },
                {
                  key: "includeNumbers" as const,
                  badge: "0-9",
                  label: t("numbers"),
                  checked: options.includeNumbers,
                },
                {
                  key: "includeSymbols" as const,
                  badge: "!@#",
                  label: t("symbols"),
                  checked: options.includeSymbols,
                },
              ].map(({ key, badge, label, checked }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => onUpdateOptions({ [key]: !checked })}
                  className={`relative flex flex-col items-center justify-center py-4 px-3 rounded-xl border cursor-pointer select-none transition-all duration-200 ${
                    checked
                      ? "bg-indigo-50/70 dark:bg-indigo-950/35 border-indigo-600 dark:border-indigo-500 shadow-2xs"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  {checked && (
                    <span className="absolute top-1.5 right-1.5 w-4.5 h-4.5 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shadow-2xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                  <span className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-slate-100 font-mono">{badge}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium truncate max-w-full">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mode: PASSPHRASE */}
      {options.mode === "passphrase" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Word Count Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 lg:p-7 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-800 dark:text-slate-200 font-bold text-sm sm:text-base">{t("wordCount")}</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold font-mono text-lg">
                  {options.wordCount} <span className="text-xs font-sans font-semibold text-slate-500">{t("wordsUnit")}</span>
                </span>
              </div>

              <input
                type="range"
                min={3}
                max={8}
                value={options.wordCount}
                onChange={(e) => onUpdateOptions({ wordCount: Number(e.target.value) })}
                style={
                  {
                    "--value-percent": `${wordPercent}%`,
                  } as React.CSSProperties
                }
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-2 font-mono">
                <span>3</span>
                <span>5</span>
                <span>8</span>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">{t("quickLength")}</span>
              <div className="flex items-center gap-1.5">
                {WORD_PRESETS.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => onUpdateOptions({ wordCount: w })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      options.wordCount === w ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Separator Choice Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 lg:p-7 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-800 dark:text-slate-200 font-bold text-sm sm:text-base">{t("separator")}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 my-auto">
              {separators.map(({ value, label }) => {
                const active = options.separator === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => onUpdateOptions({ separator: value })}
                    className={`py-3 px-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                      active
                        ? "bg-indigo-50/70 dark:bg-indigo-950/35 border-indigo-600 dark:border-indigo-500 text-indigo-700 dark:text-indigo-300"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <span>{label}</span>
                    {active && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mode: PIN CODE */}
      {options.mode === "pin" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 lg:p-7 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-800 dark:text-slate-200 font-bold text-sm sm:text-base">{t("pinLength")}</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-extrabold font-mono text-lg">
                {options.pinLength} <span className="text-xs font-sans font-semibold text-slate-500">{t("digitsUnit")}</span>
              </span>
            </div>

            <input
              type="range"
              min={4}
              max={12}
              value={options.pinLength}
              onChange={(e) => onUpdateOptions({ pinLength: Number(e.target.value) })}
              style={
                {
                  "--value-percent": `${pinPercent}%`,
                } as React.CSSProperties
              }
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-2 font-mono">
              <span>4</span>
              <span>8</span>
              <span>12</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 lg:p-7 shadow-2xs flex flex-col justify-between">
            <span className="text-slate-800 dark:text-slate-200 font-bold text-sm sm:text-base mb-3">{t("quickLength")}</span>
            <div className="grid grid-cols-5 gap-2.5 my-auto">
              {PIN_PRESETS.map((len) => {
                const active = options.pinLength === len;
                return (
                  <button
                    key={len}
                    type="button"
                    onClick={() => onUpdateOptions({ pinLength: len })}
                    className={`py-3 rounded-xl border font-mono font-bold text-sm transition-all cursor-pointer ${
                      active ? "bg-indigo-600 border-indigo-600 text-white shadow-xs" : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400"
                    }`}
                  >
                    {len}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Primary Action Row */}
      <div className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={onGenerateManual}
          className="flex-1 py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md shadow-indigo-600/15 hover:shadow-indigo-600/25 active:scale-[0.99] transition-all cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-white" />
          <span>{t("generateButton")}</span>
        </button>

        <button
          type="button"
          onClick={onGenerateManual}
          className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 transition-all cursor-pointer shadow-2xs active:scale-[0.95] flex items-center justify-center"
          title={t("regenerate")}
          aria-label={t("regenerate")}
        >
          <RefreshCw className={`w-5 h-5 transition-transform duration-300 ${isGenerating ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Bottom Option Toggles */}
      <div className="border-t border-slate-200/70 dark:border-slate-800/80 pt-5 lg:pt-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 justify-between select-none text-slate-600 dark:text-slate-400">
        {options.mode === "random" && (
          <button
            type="button"
            role="switch"
            aria-checked={options.excludeSimilar}
            onClick={() => onUpdateOptions({ excludeSimilar: !options.excludeSimilar })}
            className="flex items-center gap-3 cursor-pointer group text-left"
          >
            <span
              className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out ${
                options.excludeSimilar
                  ? "bg-indigo-600 dark:bg-indigo-500"
                  : "bg-slate-200 dark:bg-slate-700/80"
              }`}
            >
              <span
                className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out ${
                  options.excludeSimilar ? "translate-x-5.5" : "translate-x-0.5"
                }`}
              />
            </span>
            <span className="text-xs sm:text-sm font-semibold group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
              {t("excludeSimilar")}
            </span>
          </button>
        )}

        {options.mode === "passphrase" && (
          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              role="switch"
              aria-checked={options.capitalizeWords}
              onClick={() => onUpdateOptions({ capitalizeWords: !options.capitalizeWords })}
              className="flex items-center gap-3 cursor-pointer group text-left"
            >
              <span
                className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out ${
                  options.capitalizeWords
                    ? "bg-indigo-600 dark:bg-indigo-500"
                    : "bg-slate-200 dark:bg-slate-700/80"
                }`}
              >
                <span
                  className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out ${
                    options.capitalizeWords ? "translate-x-5.5" : "translate-x-0.5"
                  }`}
                />
              </span>
              <span className="text-xs sm:text-sm font-semibold group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                {t("capitalizeWords")}
              </span>
            </button>

            <button
              type="button"
              role="switch"
              aria-checked={options.includePassphraseNumber}
              onClick={() =>
                onUpdateOptions({ includePassphraseNumber: !options.includePassphraseNumber })
              }
              className="flex items-center gap-3 cursor-pointer group text-left"
            >
              <span
                className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out ${
                  options.includePassphraseNumber
                    ? "bg-indigo-600 dark:bg-indigo-500"
                    : "bg-slate-200 dark:bg-slate-700/80"
                }`}
              >
                <span
                  className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out ${
                    options.includePassphraseNumber ? "translate-x-5.5" : "translate-x-0.5"
                  }`}
                />
              </span>
              <span className="text-xs sm:text-sm font-semibold group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                {t("includePassphraseNumber")}
              </span>
            </button>
          </div>
        )}

        {options.mode === "pin" && (
          <button
            type="button"
            role="switch"
            aria-checked={options.avoidRepeatingPin}
            onClick={() => onUpdateOptions({ avoidRepeatingPin: !options.avoidRepeatingPin })}
            className="flex items-center gap-3 cursor-pointer group text-left"
          >
            <span
              className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out ${
                options.avoidRepeatingPin
                  ? "bg-indigo-600 dark:bg-indigo-500"
                  : "bg-slate-200 dark:bg-slate-700/80"
              }`}
            >
              <span
                className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out ${
                  options.avoidRepeatingPin ? "translate-x-5.5" : "translate-x-0.5"
                }`}
              />
            </span>
            <span className="text-xs sm:text-sm font-semibold group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
              {t("avoidRepeatingPin")}
            </span>
          </button>
        )}

        <button
          type="button"
          role="switch"
          aria-checked={options.autoGenerate}
          onClick={() => onUpdateOptions({ autoGenerate: !options.autoGenerate })}
          className="flex items-center gap-3 cursor-pointer group sm:ml-auto text-left"
        >
          <span
            className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out ${
              options.autoGenerate
                ? "bg-indigo-600 dark:bg-indigo-500"
                : "bg-slate-200 dark:bg-slate-700/80"
            }`}
          >
            <span
              className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out ${
                options.autoGenerate ? "translate-x-5.5" : "translate-x-0.5"
              }`}
            />
          </span>
          <span className="text-xs sm:text-sm font-semibold group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
            {t("autoGenerate")}
          </span>
        </button>
      </div>
    </div>
  );
};
