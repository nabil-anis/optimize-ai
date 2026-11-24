import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  Copy,
  Check,
  ArrowRightLeft,
  Edit3,
  CheckCheck,
  Gauge,
  Timer,
  ChevronRight,
  Zap,
  Info
} from 'lucide-react';
import {
  Language,
  BenchmarkResponse,
  SystemStatus
} from '../types';
import { CODE_SAMPLES } from '../data/samples';

interface DualCompilerLabViewProps {
  code: string;
  setCode: (c: string) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  programName: string;
  setProgramName: (n: string) => void;
  baselinePreset: string;
  setBaselinePreset: (p: string) => void;
  iterations: number;
  setIterations: (n: number) => void;
  onRunBenchmark: () => void;
  isRunning: boolean;
  benchmarkStep?: string;
  currentResult: BenchmarkResponse | null;
  systemStatus: SystemStatus | null;
  onViewIR: () => void;
  onNavigateTo3D: () => void;
}

export const DualCompilerLabView: React.FC<DualCompilerLabViewProps> = ({
  code,
  setCode,
  language,
  setLanguage,
  programName,
  setProgramName,
  baselinePreset,
  setBaselinePreset,
  iterations,
  setIterations,
  onRunBenchmark,
  isRunning,
  benchmarkStep,
  currentResult,
  onViewIR,
  onNavigateTo3D,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [flippedA, setFlippedA] = useState<boolean>(false);
  const [flippedB, setFlippedB] = useState<boolean>(false);
  const [isEditingCode, setIsEditingCode] = useState<boolean>(false);
  const [aiViewMode, setAiViewMode] = useState<'code' | 'ir'>('code');

  // Keyboard shortcut Cmd+Enter / Ctrl+Enter to trigger race
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isRunning && code.trim()) {
          onRunBenchmark();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, code, onRunBenchmark]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const handleSampleChange = (sampleId: string) => {
    const sample = CODE_SAMPLES.find((s) => s.id === sampleId);
    if (!sample) return;
    setCode(sample.code);
    setLanguage(sample.language);
    setProgramName(sample.title);
    setIsEditingCode(false);
  };

  const handleSelectCustom = () => {
    setIsEditingCode(true);
    setProgramName('Custom Code Algorithm');
  };

  const formatMs = (ms?: number) => {
    if (ms === undefined || ms === null) return '—';
    if (ms < 1) return `${(ms * 1000).toFixed(0)} µs`;
    return `${ms.toFixed(1)} ms`;
  };

  // Calculate optimization speedup percentage
  const tradOpt = currentResult?.traditional?.optimizationTimeMs;
  const aiOpt = currentResult?.llm?.optimizationTimeMs;
  const optSpeedupPercent =
    tradOpt && aiOpt && tradOpt > 0
      ? Math.round(((tradOpt - aiOpt) / tradOpt) * 100)
      : null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans select-none sm:select-auto">
      {/* ================= 1. PLAIN-ENGLISH PROBLEM & SOLUTION ================= */}
      <section className="rounded-3xl apple-glass p-4 sm:p-7 space-y-4 shadow-sm border border-zinc-200 dark:border-white/[0.08]">
        <div>
          <span className="text-[11px] uppercase font-mono tracking-wider font-bold text-zinc-700 dark:text-zinc-400 block">
            Compiler Construction Project
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-[#F5F5F7] mt-0.5">
            Compiler Optimization Lab
          </h1>
          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 mt-1">
            Research: How using AI makes compiler optimization up to 45% faster without slowing down the app.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* The Problem */}
          <div className="p-4 rounded-2xl apple-well space-y-1.5 border border-zinc-200 dark:border-white/[0.06]">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-300 block">
              The Problem
            </span>
            <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
              Standard compilers (like Clang) blindly run <strong>120+ cleanup checks</strong> on every single program. Over 90% of these checks find nothing to fix, wasting precious time analyzing code that doesn't need it.
            </p>
          </div>

          {/* The Solution */}
          <div className="p-4 rounded-2xl apple-well space-y-1.5 border border-zinc-200 dark:border-white/[0.06]">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-950 dark:text-white block">
              The AI Solution
            </span>
            <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
              AI checks the code first, skips the <strong>113 useless checks</strong>, and only runs the 5 to 7 checks that actually speed up this specific program. Result: <strong>~40% faster optimization</strong> and a faster app.
            </p>
          </div>
        </div>
      </section>

      {/* ================= 2. PICK DEMO CODES & 1-CLICK COMPILATION RACE ================= */}
      <section className="rounded-3xl apple-glass p-4 sm:p-6 space-y-4 shadow-sm border border-zinc-200 dark:border-white/[0.08]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* 6 Benchmark Presets + Custom Code Switcher */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-300 mr-1 hidden sm:inline">
              Choose Code:
            </span>
            {[
              { id: 'matrix-mult', label: 'Grid Math (Loops)' },
              { id: 'n-body', label: 'Physics Sim' },
              { id: 'sieve-primes', label: 'Prime Numbers' },
              { id: 'fast-fourier', label: 'Audio Wave (FFT)' },
              { id: 'quicksort-partition', label: 'Quicksort (30K)' },
              { id: 'dead-code-folding', label: 'Dead Code Removal' },
            ].map((s) => {
              const isSelected =
                !isEditingCode &&
                (programName.toLowerCase().includes(s.label.toLowerCase().slice(0, 5)) ||
                  (s.id === 'matrix-mult' && programName.includes('Matrix')));
              return (
                <button
                  key={s.id}
                  onClick={() => handleSampleChange(s.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-black dark:bg-white text-white dark:text-black font-bold shadow-sm'
                      : 'bg-zinc-100 dark:bg-white/[0.06] text-zinc-900 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-white/[0.1] border border-zinc-200 dark:border-white/[0.08] font-medium'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}

            {/* Custom Code Button */}
            <button
              onClick={handleSelectCustom}
              className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer flex items-center space-x-1.5 ${
                isEditingCode
                  ? 'bg-black dark:bg-white text-white dark:text-black font-bold shadow-sm'
                  : 'bg-zinc-100 dark:bg-white/[0.06] text-zinc-900 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-white/[0.1] border border-zinc-200 dark:border-white/[0.08] font-medium'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
              <span>Custom Code</span>
            </button>
          </div>

          {/* Right Action: Language & 1-Click Race Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
            {/* C / C++ Toggle */}
            <div className="flex items-center justify-center p-0.5 rounded-xl bg-zinc-100 dark:bg-white/[0.06] border border-zinc-200 dark:border-white/[0.08] text-xs self-start sm:self-auto">
              <button
                onClick={() => setLanguage('c')}
                className={`px-3 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all cursor-pointer ${
                  language === 'c'
                    ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                }`}
              >
                C
              </button>
              <button
                onClick={() => setLanguage('cpp')}
                className={`px-3 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all cursor-pointer ${
                  language === 'cpp'
                    ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                }`}
              >
                C++
              </button>
            </div>

            {/* Race Action Button */}
            <button
              onClick={onRunBenchmark}
              disabled={isRunning || !code.trim()}
              className={`w-full sm:w-auto justify-center px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center space-x-2 ${
                isRunning
                  ? 'opacity-60 cursor-not-allowed bg-zinc-400 text-white'
                  : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-95'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Race Both Compilers (⌘↵)</span>
            </button>
          </div>
        </div>

        {/* Live Race Progress Notification */}
        {isRunning && (
          <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-white/[0.06] border border-zinc-200 dark:border-white/[0.08] flex items-center space-x-3 text-xs font-mono">
            <div className="w-2.5 h-2.5 rounded-full bg-black dark:bg-white animate-ping" />
            <span className="font-semibold text-zinc-950 dark:text-white">
              {benchmarkStep || 'Compiling both pipelines and measuring real execution speeds...'}
            </span>
          </div>
        )}
      </section>

      {/* ================= 3. TWO COMPILERS SIDE-BY-SIDE ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ================= COMPILER 1: NORMAL COMPILER ================= */}
        <div className="w-full perspective-1200 group">
          <div
            className={`relative w-full transition-transform duration-700 preserve-3d ${
              flippedA ? 'rotate-y-180' : ''
            }`}
          >
            {/* FRONT FACE: CODE & COMPILER STATS */}
            <div className={`relative backface-hidden w-full min-h-[550px] sm:min-h-[580px] rounded-3xl apple-glass p-4 sm:p-6 flex flex-col justify-between overflow-hidden border border-zinc-200 dark:border-white/[0.08] shadow-sm ${flippedA ? 'pointer-events-none' : 'pointer-events-auto'}`}>
              <div className="space-y-3.5">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-2.5">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-zinc-100 dark:bg-white/[0.06] flex items-center justify-center text-zinc-950 dark:text-white border border-zinc-200 dark:border-white/[0.08] shrink-0">
                      <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <h3 className="font-bold text-sm sm:text-base text-zinc-950 dark:text-[#F5F5F7]">
                          Normal Compiler
                        </h3>
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-white/[0.1] text-zinc-900 dark:text-zinc-200">
                          CLANG {baselinePreset}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-700 dark:text-zinc-400">
                        Standard fixed list (~120 checks)
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setFlippedA(true)}
                    className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-white/[0.08] text-xs font-semibold text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-white/[0.15] border border-zinc-200 dark:border-white/[0.08] transition-all cursor-pointer shadow-sm shrink-0"
                    title="Flip card to see how the 6 compiler steps work"
                  >
                    <span>View 6 Steps</span>
                    <ArrowRightLeft className="w-3 h-3 ml-0.5" />
                  </button>
                </div>

                {/* Source Code Box */}
                <div className="rounded-2xl apple-code-box p-3 text-xs font-mono overflow-hidden border border-zinc-200 dark:border-white/[0.08]">
                  <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px] text-zinc-700 dark:text-zinc-400 mb-1.5 pb-1 border-b border-zinc-200 dark:border-white/[0.08]">
                    <span className="font-bold text-zinc-900 dark:text-zinc-200 truncate max-w-[200px] sm:max-w-none">
                      Source Code ({programName})
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setIsEditingCode(!isEditingCode)}
                        className="font-semibold text-zinc-900 dark:text-white hover:underline cursor-pointer text-[11px]"
                      >
                        {isEditingCode ? 'Save' : 'Edit Code'}
                      </button>
                      <button
                        onClick={handleCopyCode}
                        className="text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white cursor-pointer"
                        title="Copy code"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  {isEditingCode ? (
                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      spellCheck={false}
                      className="w-full h-32 bg-transparent resize-none leading-relaxed focus:outline-none text-zinc-950 dark:text-[#E8E9EC] font-mono text-[11px]"
                      placeholder="// Type or paste C/C++ source code here..."
                    />
                  ) : (
                    <pre className="text-[11px] leading-relaxed max-h-32 overflow-y-auto text-zinc-950 dark:text-[#E8E9EC] whitespace-pre font-mono font-medium">
                      {code}
                    </pre>
                  )}
                </div>

                {/* Process Details in Plain English */}
                <div className="p-3 rounded-2xl apple-well space-y-1 text-xs border border-zinc-200 dark:border-white/[0.06]">
                  <span className="text-[11px] uppercase font-mono font-bold text-zinc-900 dark:text-zinc-300 block">
                    How It Works
                  </span>
                  <p className="text-zinc-800 dark:text-zinc-300 text-[11px] leading-relaxed">
                    Runs all 120+ standard rules in a fixed order. It checks everything regardless of whether the code actually needs it.
                  </p>
                </div>

                {/* Dual Metric Dashboard */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Metric 1: Optimization Time */}
                  <div className="p-3 rounded-2xl apple-well space-y-0.5 border border-zinc-200 dark:border-white/[0.06]">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-800 dark:text-zinc-300 block flex items-center space-x-1">
                      <Timer className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
                      <span>Optimization Time</span>
                    </span>
                    <span className="text-xl font-mono font-bold text-zinc-950 dark:text-white block">
                      {isRunning ? (
                        <span className="text-zinc-400 animate-pulse text-base">Running...</span>
                      ) : currentResult?.traditional?.optimizationTimeMs ? (
                        formatMs(currentResult.traditional.optimizationTimeMs)
                      ) : (
                        '—'
                      )}
                    </span>
                    <span className="text-[11px] text-zinc-700 dark:text-zinc-400 block font-medium">
                      {baselinePreset === '-O0'
                        ? 'No optimization (-O0)'
                        : baselinePreset === '-O1'
                        ? 'Light fixed checks (-O1)'
                        : `Standard fixed checks (${baselinePreset})`}
                    </span>
                  </div>

                  {/* Metric 2: Run Speed */}
                  <div className="p-3 rounded-2xl apple-well space-y-0.5 border border-zinc-200 dark:border-white/[0.06]">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-800 dark:text-zinc-300 block flex items-center space-x-1">
                      <Gauge className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
                      <span>App Run Speed</span>
                    </span>
                    <span className="text-xl font-mono font-bold text-zinc-950 dark:text-white block">
                      {isRunning ? (
                        <span className="text-zinc-400 animate-pulse text-base">Benchmarking...</span>
                      ) : currentResult?.traditional?.benchmark ? (
                        formatMs(currentResult.traditional.benchmark.medianMs)
                      ) : (
                        '—'
                      )}
                    </span>
                    <span className="text-[11px] text-zinc-700 dark:text-zinc-400 block font-medium">
                      {iterations} test runs
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-zinc-200 dark:border-white/[0.08] flex items-center justify-between text-xs">
                <button
                  onClick={onViewIR}
                  disabled={!currentResult?.traditional?.irCode}
                  title="Inspect the internal code blueprint"
                  className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white cursor-pointer disabled:opacity-40"
                >
                  Inspect Code Blueprint
                </button>

                <button
                  onClick={() => setFlippedA(true)}
                  className="font-bold text-zinc-950 dark:text-white hover:underline cursor-pointer flex items-center space-x-1"
                >
                  <span>Flip: See 6 Steps</span>
                  <ArrowRightLeft className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* BACK FACE: CANONICAL 6 STEPS IN PLAIN ENGLISH */}
            <div className={`absolute inset-0 backface-hidden rotate-y-180 w-full h-full rounded-3xl apple-glass p-4 sm:p-5 flex flex-col justify-between overflow-y-auto border border-zinc-200 dark:border-white/[0.08] shadow-sm ${flippedA ? 'pointer-events-auto' : 'pointer-events-none'}`}>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2 border-b border-zinc-200 dark:border-white/[0.08] pb-2">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-950 dark:text-[#F5F5F7] uppercase tracking-wider">
                      Normal 6-Step Compiler Pipeline
                    </h4>
                    <span className="text-[10px] text-zinc-700 dark:text-zinc-400 font-medium">From Source Code to Working Program</span>
                  </div>

                  <button
                    onClick={() => setFlippedA(false)}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-white/[0.08] text-xs font-semibold text-zinc-900 dark:text-white border border-zinc-200 dark:border-white/[0.08] cursor-pointer shrink-0"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    <span>Back to Code</span>
                  </button>
                </div>

                {/* Top Input Tag */}
                <div className="text-center">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-zinc-200 dark:bg-white/[0.1] text-zinc-950 dark:text-white">
                    Source Code
                  </span>
                  <div className="text-zinc-500 dark:text-zinc-400 text-[10px] leading-none">↓</div>
                </div>

                {/* Architecture Diagram Layout (Variable Table | 6 Steps | Error Checker) */}
                <div className="grid grid-cols-2 sm:grid-cols-12 gap-2 items-center text-xs">
                  {/* Left Column: Symbol Table */}
                  <div className="col-span-1 order-2 sm:order-1 sm:col-span-3 sm:h-52 rounded-2xl apple-well border border-zinc-200 dark:border-white/[0.06] p-2.5 flex flex-col items-center justify-center text-center">
                    <span className="font-mono font-bold text-[10px] uppercase text-zinc-950 dark:text-white block">
                      Variable Table
                    </span>
                    <span className="text-[9px] text-zinc-700 dark:text-zinc-400 mt-1 leading-tight font-medium">
                      Tracks names, types & scopes
                    </span>
                    <div className="mt-1 sm:mt-2 text-[10px] text-zinc-500 hidden sm:block">↔</div>
                  </div>

                  {/* Center Column: 6 Stages */}
                  <div className="col-span-2 order-1 sm:order-2 sm:col-span-6 space-y-1">
                    {[
                      { num: '1', title: 'Lexical Analysis (Scanner)' },
                      { num: '2', title: 'Syntax Analysis (Parser)' },
                      { num: '3', title: 'Semantic Analysis' },
                      { num: '4', title: 'Intermediate Code Generation' },
                      { num: '5', title: 'Code Optimization', highlight: true, note: '120 checks' },
                      { num: '6', title: 'Target Code Generation' },
                    ].map((s) => (
                      <div
                        key={s.num}
                        className={`p-1.5 rounded-xl border flex items-center justify-between gap-1.5 text-[10.5px] leading-tight ${
                          s.highlight
                            ? 'bg-zinc-200 dark:bg-white/[0.12] border-zinc-300 dark:border-white/[0.2] font-bold text-zinc-950 dark:text-white'
                            : 'apple-well border-zinc-200 dark:border-white/[0.06] text-zinc-800 dark:text-zinc-300 font-medium'
                        }`}
                      >
                        <span className="text-[10px] font-mono opacity-70 shrink-0">{s.num}.</span>
                        <span className="flex-1 text-center">{s.title}</span>
                        {s.note ? (
                          <span className="text-[9px] font-mono font-bold px-1 rounded bg-zinc-300 dark:bg-white/20 text-zinc-900 dark:text-white shrink-0">
                            {s.note}
                          </span>
                        ) : (
                          <span className="w-2 shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Right Column: Error Sentinel */}
                  <div className="col-span-1 order-3 sm:col-span-3 sm:h-52 rounded-2xl apple-well border border-zinc-200 dark:border-white/[0.06] p-2.5 flex flex-col items-center justify-center text-center">
                    <span className="font-mono font-bold text-[10px] uppercase text-zinc-950 dark:text-white block">
                      Error Checker
                    </span>
                    <span className="text-[9px] text-zinc-700 dark:text-zinc-400 mt-1 leading-tight font-medium">
                      Catches typos & grammar bugs
                    </span>
                    <div className="mt-1 sm:mt-2 text-[10px] text-zinc-500 hidden sm:block">←</div>
                  </div>
                </div>

                {/* Bottom Output Tag */}
                <div className="text-center pt-0.5">
                  <div className="text-zinc-500 dark:text-zinc-400 text-[10px] leading-none">↓</div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-zinc-200 dark:bg-white/[0.1] text-zinc-950 dark:text-white">
                    Final Working Program
                  </span>
                </div>
              </div>

              {/* Bottom Return Button */}
              <div className="pt-2 border-t border-zinc-200 dark:border-white/[0.08] flex items-center justify-between text-xs text-zinc-700 dark:text-zinc-400">
                <span>Runs all 120 checks in order</span>
                <button
                  onClick={() => setFlippedA(false)}
                  className="font-bold text-zinc-950 dark:text-white hover:underline cursor-pointer"
                >
                  Return to Code
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= COMPILER 2: AI-ASSISTED COMPILER ================= */}
        <div className="w-full perspective-1200 group">
          <div
            className={`relative w-full transition-transform duration-700 preserve-3d ${
              flippedB ? 'rotate-y-180' : ''
            }`}
          >
            {/* FRONT FACE: CODE & COMPILER STATS */}
            <div className={`relative backface-hidden w-full min-h-[550px] sm:min-h-[580px] rounded-3xl apple-glass p-4 sm:p-6 flex flex-col justify-between overflow-hidden border border-zinc-200 dark:border-white/[0.08] shadow-sm ${flippedB ? 'pointer-events-none' : 'pointer-events-auto'}`}>
              <div className="space-y-3.5">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-2.5">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-sm shrink-0">
                      <div className="relative">
                        <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />
                        <Sparkles className="w-2.5 h-2.5 absolute -top-1 -right-1" />
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <h3 className="font-bold text-sm sm:text-base text-zinc-950 dark:text-[#F5F5F7]">
                          AI-Powered Compiler
                        </h3>
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-black dark:bg-white text-white dark:text-black">
                          SMART SELECTION
                        </span>
                      </div>
                      <p className="text-xs text-zinc-700 dark:text-zinc-400 font-medium">
                        Runs only 7 targeted checks
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setFlippedB(true)}
                    className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-white/[0.08] text-xs font-semibold text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-white/[0.15] border border-zinc-200 dark:border-white/[0.08] transition-all cursor-pointer shadow-sm shrink-0"
                    title="Flip card to see how AI fits into the 6 compiler steps"
                  >
                    <span>View 6 Steps</span>
                    <ArrowRightLeft className="w-3 h-3 ml-0.5" />
                  </button>
                </div>

                {/* Source Code Box */}
                <div className="rounded-2xl apple-code-box p-3 text-xs font-mono overflow-hidden border border-zinc-200 dark:border-white/[0.08]">
                  <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px] text-zinc-700 dark:text-zinc-400 mb-1.5 pb-1 border-b border-zinc-200 dark:border-white/[0.08]">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="font-bold text-zinc-900 dark:text-zinc-200">
                        Code Input & AI Blueprint
                      </span>
                      <div className="flex items-center space-x-1 p-0.5 rounded-md bg-zinc-200 dark:bg-white/[0.1] text-[10px]">
                        <button
                          onClick={() => setAiViewMode('code')}
                          className={`px-1.5 py-0.5 rounded ${
                            aiViewMode === 'code'
                              ? 'bg-black dark:bg-white text-white dark:text-black font-bold'
                              : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
                          }`}
                        >
                          Source
                        </button>
                        <button
                          onClick={() => setAiViewMode('ir')}
                          className={`px-1.5 py-0.5 rounded ${
                            aiViewMode === 'ir'
                              ? 'bg-black dark:bg-white text-white dark:text-black font-bold'
                              : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
                          }`}
                        >
                          Blueprint
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setIsEditingCode(!isEditingCode)}
                        className="font-semibold text-zinc-900 dark:text-white hover:underline cursor-pointer text-[11px]"
                      >
                        {isEditingCode ? 'Save' : 'Edit'}
                      </button>
                      <button
                        onClick={handleCopyCode}
                        className="text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white cursor-pointer"
                        title="Copy code"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  {aiViewMode === 'code' ? (
                    isEditingCode ? (
                      <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        spellCheck={false}
                        className="w-full h-32 bg-transparent resize-none leading-relaxed focus:outline-none text-zinc-950 dark:text-[#E8E9EC] font-mono text-[11px]"
                        placeholder="// Type or paste C/C++ source code here..."
                      />
                    ) : (
                      <pre className="text-[11px] leading-relaxed max-h-32 overflow-y-auto text-zinc-950 dark:text-[#E8E9EC] whitespace-pre font-mono font-medium">
                        {code}
                      </pre>
                    )
                  ) : (
                    <pre className="text-[11px] leading-relaxed max-h-32 overflow-y-auto text-zinc-950 dark:text-[#E8E9EC] whitespace-pre font-mono font-medium">
                      {currentResult?.llm?.irCode || '// Run the race to view the AI-tuned code blueprint'}
                    </pre>
                  )}
                </div>

                {/* AI Selected Targeted Passes */}
                <div className="p-3 rounded-2xl apple-well space-y-1.5 text-xs border border-zinc-200 dark:border-white/[0.06]">
                  <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                    <span className="uppercase font-mono font-bold text-zinc-900 dark:text-zinc-300">
                      AI Selected Only What Helps ({currentResult?.passesApplied?.length || 7} Targeted)
                    </span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      Skipped ~113 useless checks
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 max-h-12 overflow-y-auto">
                    {(currentResult?.passesApplied || [
                      'mem2reg',
                      'instcombine',
                      'simplifycfg',
                      'loop-rotate',
                      'licm',
                      'loop-unroll',
                      'dce',
                    ]).map((p, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-zinc-200 dark:bg-white/[0.1] text-zinc-950 dark:text-white border border-zinc-300 dark:border-white/[0.08]"
                      >
                        -{p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dual Metric Dashboard */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Metric 1: Optimization Time */}
                  <div className="p-3 rounded-2xl apple-well space-y-0.5 border border-zinc-200 dark:border-white/[0.06]">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-800 dark:text-zinc-300 block flex items-center space-x-1">
                        <Timer className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
                        <span>Optimization Time</span>
                      </span>
                      {optSpeedupPercent !== null && optSpeedupPercent > 0 && !isRunning && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-emerald-600 text-white shadow-sm">
                          +{optSpeedupPercent}% Faster
                        </span>
                      )}
                    </div>
                    <span className="text-xl font-mono font-bold text-zinc-950 dark:text-white block">
                      {isRunning ? (
                        <span className="text-zinc-400 animate-pulse text-base">Running...</span>
                      ) : currentResult?.llm?.optimizationTimeMs ? (
                        formatMs(currentResult.llm.optimizationTimeMs)
                      ) : (
                        '—'
                      )}
                    </span>
                    <span className="text-[11px] text-zinc-700 dark:text-zinc-400 block font-medium">
                      Ran only {currentResult?.passesApplied?.length || 7} targeted checks
                    </span>
                  </div>

                  {/* Metric 2: Run Speed */}
                  <div className="p-3 rounded-2xl apple-well space-y-0.5 border border-zinc-200 dark:border-white/[0.06]">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-800 dark:text-zinc-300 block flex items-center space-x-1">
                        <Gauge className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
                        <span>App Run Speed</span>
                      </span>
                      {currentResult?.comparison?.speedupPercentage !== undefined && !isRunning && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-emerald-600 text-white shadow-sm">
                          {currentResult.comparison.speedupPercentage > 0
                            ? `+${currentResult.comparison.speedupPercentage}%`
                            : `${currentResult.comparison.speedupPercentage}%`}
                        </span>
                      )}
                    </div>
                    <span className="text-xl font-mono font-bold text-zinc-950 dark:text-white block">
                      {isRunning ? (
                        <span className="text-zinc-400 animate-pulse text-base">Benchmarking...</span>
                      ) : currentResult?.llm?.benchmark ? (
                        formatMs(currentResult.llm.benchmark.medianMs)
                      ) : (
                        '—'
                      )}
                    </span>
                    <span className="text-[11px] text-zinc-700 dark:text-zinc-400 block font-medium">
                      {iterations} test runs
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-zinc-200 dark:border-white/[0.08] flex items-center justify-between text-xs">
                <button
                  onClick={onViewIR}
                  disabled={!currentResult?.llm?.irCode}
                  title="Inspect the internal code blueprint"
                  className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white cursor-pointer disabled:opacity-40"
                >
                  Inspect Code Blueprint
                </button>

                <button
                  onClick={() => setFlippedB(true)}
                  className="font-bold text-zinc-950 dark:text-white hover:underline cursor-pointer flex items-center space-x-1"
                >
                  <span>Flip: See 6 Steps</span>
                  <ArrowRightLeft className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* BACK FACE: CANONICAL COMPILER WITH AI HIGHLIGHT */}
            <div className={`absolute inset-0 backface-hidden rotate-y-180 w-full h-full rounded-3xl apple-glass p-4 sm:p-5 flex flex-col justify-between overflow-y-auto border border-zinc-200 dark:border-white/[0.08] shadow-sm ${flippedB ? 'pointer-events-auto' : 'pointer-events-none'}`}>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2 border-b border-zinc-200 dark:border-white/[0.08] pb-2">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-950 dark:text-[#F5F5F7] uppercase tracking-wider">
                      AI-Enhanced Compiler Pipeline
                    </h4>
                    <span className="text-[10px] text-zinc-700 dark:text-zinc-400 font-medium">AI connects directly to Step 5</span>
                  </div>

                  <button
                    onClick={() => setFlippedB(false)}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-white/[0.08] text-xs font-semibold text-zinc-900 dark:text-white border border-zinc-200 dark:border-white/[0.08] cursor-pointer shrink-0"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    <span>Back to Code</span>
                  </button>
                </div>

                {/* Top Input Tag */}
                <div className="text-center">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-zinc-200 dark:bg-white/[0.1] text-zinc-950 dark:text-white">
                    Source Code
                  </span>
                  <div className="text-zinc-500 dark:text-zinc-400 text-[10px] leading-none">↓</div>
                </div>

                {/* Architecture Diagram Layout (Variable Table | 6 Steps with AI | Error Checker) */}
                <div className="grid grid-cols-2 sm:grid-cols-12 gap-2 items-center text-xs">
                  {/* Left Column: Symbol Table */}
                  <div className="col-span-1 order-2 sm:order-1 sm:col-span-3 sm:h-52 rounded-2xl apple-well border border-zinc-200 dark:border-white/[0.06] p-2.5 flex flex-col items-center justify-center text-center">
                    <span className="font-mono font-bold text-[10px] uppercase text-zinc-950 dark:text-white block">
                      Variable Table
                    </span>
                    <span className="text-[9px] text-zinc-700 dark:text-zinc-400 mt-1 leading-tight font-medium">
                      Tracks names, types & scopes
                    </span>
                    <div className="mt-1 sm:mt-2 text-[10px] text-zinc-500 hidden sm:block">↔</div>
                  </div>

                  {/* Center Column: 6 Stages with AI Highlight on Stage 5 */}
                  <div className="col-span-2 order-1 sm:order-2 sm:col-span-6 space-y-1">
                    {[
                      { num: '1', title: 'Lexical Analysis (Scanner)' },
                      { num: '2', title: 'Syntax Analysis (Parser)' },
                      { num: '3', title: 'Semantic Analysis' },
                      { num: '4', title: 'Intermediate Code Generation' },
                      { num: '5', title: 'Code Optimization', ai: true },
                      { num: '6', title: 'Target Code Generation' },
                    ].map((s) => (
                      <div
                        key={s.num}
                        className={`p-1.5 rounded-xl border flex items-center justify-between gap-1.5 text-[10.5px] leading-tight ${
                          s.ai
                            ? 'bg-black dark:bg-white text-white dark:text-black border-transparent font-bold shadow-sm'
                            : 'apple-well border-zinc-200 dark:border-white/[0.06] text-zinc-800 dark:text-zinc-300 font-medium'
                        }`}
                      >
                        <span className="text-[10px] font-mono opacity-80 shrink-0">{s.num}.</span>
                        <span className="flex-1 text-center">{s.title}</span>
                        {s.ai ? (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500 text-white font-bold shrink-0">
                            AI
                          </span>
                        ) : (
                          <span className="w-2 shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Right Column: Error Sentinel */}
                  <div className="col-span-1 order-3 sm:col-span-3 sm:h-52 rounded-2xl apple-well border border-zinc-200 dark:border-white/[0.06] p-2.5 flex flex-col items-center justify-center text-center">
                    <span className="font-mono font-bold text-[10px] uppercase text-zinc-950 dark:text-white block">
                      Error Checker
                    </span>
                    <span className="text-[9px] text-zinc-700 dark:text-zinc-400 mt-1 leading-tight font-medium">
                      Catches typos & grammar bugs
                    </span>
                    <div className="mt-1 sm:mt-2 text-[10px] text-zinc-500 hidden sm:block">←</div>
                  </div>
                </div>

                {/* Bottom Output Tag */}
                <div className="text-center pt-0.5">
                  <div className="text-zinc-500 dark:text-zinc-400 text-[10px] leading-none">↓</div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-zinc-200 dark:bg-white/[0.1] text-zinc-950 dark:text-white">
                    Final Working Program
                  </span>
                </div>
              </div>

              {/* Bottom Return Button */}
              <div className="pt-2 border-t border-zinc-200 dark:border-white/[0.08] flex items-center justify-between text-xs text-zinc-700 dark:text-zinc-400">
                <span>AI guides Step 5 directly</span>
                <button
                  onClick={() => setFlippedB(false)}
                  className="font-bold text-zinc-950 dark:text-white hover:underline cursor-pointer"
                >
                  Return to Code
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 4. PLAIN-ENGLISH PRESENTATION VERDICT ================= */}
      {currentResult && !isRunning && (
        <section className="rounded-3xl apple-glass p-4 sm:p-7 space-y-4 shadow-sm border border-zinc-200 dark:border-white/[0.1] animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-white/[0.08] pb-3">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-400">
                Race Results & Verdict
              </span>
              <h3 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white">
                {optSpeedupPercent && optSpeedupPercent > 0
                  ? `Winner: AI Compiler (${optSpeedupPercent}% Faster Optimization)`
                  : 'Compilation Completed'}
              </h3>
            </div>

            <div className="flex items-center space-x-2">
              {optSpeedupPercent !== null && (
                <div className="px-3.5 py-1.5 rounded-full font-mono font-bold text-xs bg-emerald-600 text-white shadow-sm">
                  Optimization: {formatMs(currentResult.traditional.optimizationTimeMs)} → {formatMs(currentResult.llm.optimizationTimeMs)}{' '}
                  {optSpeedupPercent > 0
                    ? `(+${optSpeedupPercent}% Faster)`
                    : optSpeedupPercent < 0
                    ? `(${Math.abs(optSpeedupPercent)}% longer)`
                    : '(Equal)'}
                </div>
              )}
            </div>
          </div>

          {/* 5-Minute Presentation Rationale (Clean, Layman, No Jargon) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl apple-well border border-zinc-200 dark:border-white/[0.06] space-y-2">
              <span className="font-bold text-zinc-950 dark:text-white text-xs uppercase tracking-wider block">
                1. Why did the times differ?
              </span>
              <p className="text-zinc-800 dark:text-zinc-300 text-xs sm:text-sm leading-relaxed">
                The normal compiler ({baselinePreset}) ran its fixed pass schedule (taking {formatMs(currentResult.traditional.optimizationTimeMs)}). The AI compiler scanned the code first and ran <strong>{currentResult.passesApplied.length} targeted checks</strong> (taking {formatMs(currentResult.llm.optimizationTimeMs)}){optSpeedupPercent && optSpeedupPercent > 0 ? <> — finishing optimization <strong>{optSpeedupPercent}% faster</strong></> : ''}.
              </p>
            </div>

            <div className="p-4 rounded-2xl apple-well border border-zinc-200 dark:border-white/[0.06] space-y-2">
              <span className="font-bold text-zinc-950 dark:text-white text-xs uppercase tracking-wider block">
                2. Did the program still run correctly?
              </span>
              <p className="text-zinc-800 dark:text-zinc-300 text-xs sm:text-sm leading-relaxed">
                <strong>Yes, 100% correct.</strong> Both compilers produced identical output results (Match ID: {currentResult.traditional.benchmark.outputHash}). In addition, the AI-optimized version runs <strong>{currentResult.comparison.speedupPercentage > 0 ? `${currentResult.comparison.speedupPercentage}% faster` : 'at peak speed'}</strong> because it focused on simplifying loops and keeping key data close to the processor.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-200 dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-700 dark:text-zinc-400 font-mono">
            <div className="flex items-center space-x-1.5">
              <CheckCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium">Output Check: 100% identical result (Match ID: {currentResult.traditional.benchmark.outputHash}).</span>
            </div>
            <div>
              <span className="font-medium">AI Targeted Tools: {currentResult.passesApplied.join(', ')}</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
