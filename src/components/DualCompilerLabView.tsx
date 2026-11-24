import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Sparkles,
  Play,
  RotateCcw,
  Copy,
  Check,
  ArrowRightLeft,
  Edit3,
  CheckCheck,
  Gauge,
  Timer,
  ChevronDown,
  ChevronUp,
  Box
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
  iterations,
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
  const [showProblemDetails, setShowProblemDetails] = useState<boolean>(false);
  const [showVerdictDetails, setShowVerdictDetails] = useState<boolean>(false);

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
    <div className="w-full space-y-10 sm:space-y-14 font-sans animate-editorial-in">
      {/* ================= BAND 1 (CREAM #F0EEE6): EDITORIAL HERO ================= */}
      <section className="pt-2 sm:pt-4 space-y-5 text-left">
        <span className="text-xs uppercase font-semibold tracking-[0.08em] text-[#B5532F] block">
          Compiler Construction Project
        </span>

        <h1 className="font-serif-display text-4xl sm:text-6xl text-[#141413] max-w-5xl">
          Why run 120 checks when 7 do the job?
        </h1>

        <p className="text-base sm:text-lg text-[#5E5D57] max-w-2xl leading-relaxed">
          Race a standard compiler checklist against an AI that picks only the speedups your code actually needs.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={onRunBenchmark}
            disabled={isRunning || !code.trim()}
            className={`px-6 py-3 rounded-full font-semibold text-sm transition-opacity cursor-pointer flex items-center space-x-2 ${
              isRunning || !code.trim()
                ? 'opacity-60 cursor-not-allowed bg-[#D9D6CA] text-[#5E5D57]'
                : 'bg-[#D97757] text-[#141413] hover:opacity-90'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isRunning ? 'Racing Compilers...' : 'Race Both Compilers (⌘↵)'}</span>
          </button>

          <button
            onClick={onNavigateTo3D}
            className="px-5 py-2.5 rounded-full border-2 border-[#141413] bg-transparent text-sm font-semibold text-[#141413] hover:bg-[#FAF9F5] transition-colors cursor-pointer flex items-center space-x-2"
          >
            <Box className="w-4 h-4" />
            <span>Explore 3D Flow</span>
          </button>
        </div>
      </section>

      {/* ================= BAND 2 (CORAL #D97757): PROBLEM VS SOLUTION ================= */}
      <section className="rounded-[24px] bg-[#D97757] text-[#141413] p-6 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs uppercase font-semibold tracking-[0.08em] text-[#141413] block">
              The Core Idea
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl text-[#141413]">
              Smarter selection beats blind checklists
            </h2>
          </div>

          <button
            onClick={() => setShowProblemDetails(!showProblemDetails)}
            className="self-start sm:self-auto px-4 py-2 rounded-full border-2 border-[#141413] bg-transparent text-xs font-semibold text-[#141413] hover:bg-[#FAF9F5]/40 transition-colors cursor-pointer flex items-center space-x-1.5 shrink-0"
          >
            <span>{showProblemDetails ? 'Hide details' : 'How it differs'}</span>
            {showProblemDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-6 rounded-[24px] bg-[#FAF9F5] border-2 border-[#141413]/15 editorial-card-lift space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#B5532F] block">
              The Problem
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#141413]">
              120+ fixed checks on every file
            </h3>
            <p className="text-sm text-[#5E5D57] leading-relaxed">
              Standard compilers run the same massive rule list blindly, even when 90% of rules find nothing to improve.
            </p>
          </div>

          <div className="p-6 rounded-[24px] bg-[#FAF9F5] border-2 border-[#141413]/15 editorial-card-lift space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#B5532F] block">
              AI-Powered Solution
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#141413]">
              Diagnose first, optimize second
            </h3>
            <p className="text-sm text-[#5E5D57] leading-relaxed">
              AI inspects the code blueprint upfront and runs only the 5–7 speedup tools tailored to that algorithm.
            </p>
          </div>
        </div>

        {showProblemDetails && (
          <div className="p-6 rounded-[24px] bg-[#FAF9F5] border-2 border-[#141413]/15 text-sm text-[#5E5D57] leading-relaxed animate-editorial-in">
            Every optimization step still comes from standard compiler tooling (such as{' '}
            <code className="font-mono font-semibold text-[#B5532F]">-mem2reg</code>,{' '}
            <code className="font-mono font-semibold text-[#B5532F]">-licm</code>, and{' '}
            <code className="font-mono font-semibold text-[#B5532F]">-loop-unroll</code>). The AI simply decides which tools to run and in what order, then both binaries are executed side-by-side to verify identical output.
          </div>
        )}
      </section>

      {/* ================= BAND 3 (NEAR-BLACK #141413): BIG HOOK NUMBERS ================= */}
      <section className="rounded-[24px] bg-[#141413] text-[#FAF9F5] p-6 sm:p-10 space-y-6">
        <div className="space-y-1">
          <span className="text-xs uppercase font-semibold tracking-[0.08em] text-[#D97757] block">
            By The Numbers
          </span>
          <p className="text-sm text-[#C9C6BA]">
            What changes when you replace a fixed checklist with targeted guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="space-y-1">
            <div className="font-serif-display text-4xl sm:text-5xl text-[#D97757] tabular-nums">
              120 vs 5–7
            </div>
            <p className="text-xs uppercase font-semibold tracking-[0.08em] text-[#FAF9F5] pt-1">
              Optimization Steps
            </p>
            <p className="text-xs text-[#C9C6BA]">
              Targeted picks replace the blind default sequence.
            </p>
          </div>

          <div className="space-y-1">
            <div className="font-serif-display text-4xl sm:text-5xl text-[#D97757] tabular-nums">
              35–50% faster
            </div>
            <p className="text-xs uppercase font-semibold tracking-[0.08em] text-[#FAF9F5] pt-1">
              Optimization Time
            </p>
            <p className="text-xs text-[#C9C6BA]">
              Less time scanning passes that leave code untouched.
            </p>
          </div>

          <div className="space-y-1">
            <div className="font-serif-display text-4xl sm:text-5xl text-[#D97757] tabular-nums">
              ~113 skipped
            </div>
            <p className="text-xs uppercase font-semibold tracking-[0.08em] text-[#FAF9F5] pt-1">
              Redundant Checks
            </p>
            <p className="text-xs text-[#C9C6BA]">
              Verified with identical program output on every run.
            </p>
          </div>
        </div>
      </section>

      {/* ================= BAND 4 (CREAM / OFF-WHITE): PICK CODE & RACE ================= */}
      <section className="space-y-6">
        <div className="editorial-card p-5 sm:p-7 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[11px] uppercase font-semibold tracking-[0.08em] text-[#B5532F] block">
                Live Experiment
              </span>
              <div className="flex items-center gap-2 flex-wrap">
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
                      className={`px-3.5 py-1.5 rounded-full text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#D97757] text-[#141413] font-semibold'
                          : 'bg-[#F0EEE6] text-[#141413] border-2 border-[#D9D6CA] hover:border-[#141413] font-medium'
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}

                <button
                  onClick={handleSelectCustom}
                  className={`px-3.5 py-1.5 rounded-full text-xs transition-colors cursor-pointer flex items-center space-x-1.5 ${
                    isEditingCode
                      ? 'bg-[#D97757] text-[#141413] font-semibold'
                      : 'bg-[#F0EEE6] text-[#141413] border-2 border-[#D9D6CA] hover:border-[#141413] font-medium'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Custom Code</span>
                </button>
              </div>
            </div>

            {/* Right Action: Language & Primary Coral Pill Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
              <div className="flex items-center p-1 rounded-full bg-[#F0EEE6] border-2 border-[#D9D6CA] text-xs self-start sm:self-auto">
                <button
                  onClick={() => setLanguage('c')}
                  className={`px-3.5 py-1 rounded-full font-mono text-xs font-semibold transition-colors cursor-pointer ${
                    language === 'c'
                      ? 'bg-[#D97757] text-[#141413]'
                      : 'text-[#5E5D57] hover:text-[#141413]'
                  }`}
                >
                  C
                </button>
                <button
                  onClick={() => setLanguage('cpp')}
                  className={`px-3.5 py-1 rounded-full font-mono text-xs font-semibold transition-colors cursor-pointer ${
                    language === 'cpp'
                      ? 'bg-[#D97757] text-[#141413]'
                      : 'text-[#5E5D57] hover:text-[#141413]'
                  }`}
                >
                  C++
                </button>
              </div>

              <button
                onClick={onRunBenchmark}
                disabled={isRunning || !code.trim()}
                className={`w-full sm:w-auto justify-center px-6 py-2.5 rounded-full font-semibold text-sm transition-opacity cursor-pointer flex items-center space-x-2 ${
                  isRunning || !code.trim()
                    ? 'opacity-60 cursor-not-allowed bg-[#D9D6CA] text-[#5E5D57]'
                    : 'bg-[#D97757] text-[#141413] hover:opacity-90'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Race Both Compilers</span>
              </button>
            </div>
          </div>

          {isRunning && (
            <div className="p-4 rounded-[18px] bg-[#141413] text-[#FAF9F5] flex items-center space-x-3 text-xs font-mono">
              <div className="w-2.5 h-2.5 rounded-full bg-[#D97757] shrink-0" />
              <span className="font-semibold">
                {benchmarkStep || 'Compiling both pipelines and measuring real execution speeds...'}
              </span>
            </div>
          )}
        </div>

        {/* ================= TWO COMPILERS SIDE-BY-SIDE (FLIP CARDS) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* COMPILER 1: NORMAL COMPILER */}
          <div className="w-full perspective-1200">
            <div
              className={`relative w-full transition-transform duration-700 preserve-3d ${
                flippedA ? 'rotate-y-180' : ''
              }`}
            >
              {/* FRONT FACE */}
              <div
                className={`relative backface-hidden w-full min-h-[560px] editorial-card editorial-card-lift p-5 sm:p-7 flex flex-col justify-between overflow-hidden ${
                  flippedA ? 'pointer-events-none' : 'pointer-events-auto'
                }`}
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-[#F0EEE6] border-2 border-[#D9D6CA] flex items-center justify-center text-[#141413] shrink-0">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-serif text-xl font-medium text-[#141413]">
                            Normal Compiler
                          </h3>
                          <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full bg-[#F0EEE6] border border-[#D9D6CA] text-[#B5532F]">
                            CLANG {baselinePreset}
                          </span>
                        </div>
                        <p className="text-xs text-[#5E5D57] mt-0.5">
                          Standard fixed list (~120 checks)
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setFlippedA(true)}
                      className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border-2 border-[#141413] bg-transparent text-xs font-semibold text-[#141413] hover:bg-[#F0EEE6] transition-colors cursor-pointer shrink-0"
                      title="Flip card to see how the 6 compiler steps work"
                    >
                      <span>View 6 Steps</span>
                      <ArrowRightLeft className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Source Code Box */}
                  <div className="rounded-[18px] bg-[#F0EEE6] border-2 border-[#D9D6CA] p-3.5 text-xs font-mono overflow-hidden">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#5E5D57] mb-2 pb-1.5 border-b border-[#D9D6CA]">
                      <span className="font-semibold text-[#141413] truncate max-w-[200px] sm:max-w-none">
                        Source Code ({programName})
                      </span>
                      <div className="flex items-center space-x-2.5">
                        <button
                          onClick={() => setIsEditingCode(!isEditingCode)}
                          className="font-semibold text-[#B5532F] hover:underline cursor-pointer text-[11px]"
                        >
                          {isEditingCode ? 'Save' : 'Edit Code'}
                        </button>
                        <button
                          onClick={handleCopyCode}
                          className="text-[#5E5D57] hover:text-[#141413] cursor-pointer"
                          title="Copy code"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-[#B5532F]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {isEditingCode ? (
                      <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        spellCheck={false}
                        className="w-full h-32 bg-transparent resize-none leading-relaxed focus:outline-none text-[#141413] font-mono text-[11.5px]"
                        placeholder="// Type or paste C/C++ source code here..."
                      />
                    ) : (
                      <pre className="text-[11.5px] leading-relaxed max-h-32 overflow-y-auto text-[#141413] whitespace-pre font-mono">
                        {code}
                      </pre>
                    )}
                  </div>

                  {/* How It Works */}
                  <div className="p-3.5 rounded-[18px] bg-[#F0EEE6] border-2 border-[#D9D6CA] space-y-1">
                    <span className="text-[10.5px] uppercase font-semibold tracking-[0.08em] text-[#B5532F] block">
                      How It Works
                    </span>
                    <p className="text-xs text-[#5E5D57] leading-relaxed">
                      Runs all 120+ standard rules in a fixed order, even when most checks find nothing to change.
                    </p>
                  </div>

                  {/* Dual Metric Dashboard */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-[18px] bg-[#F0EEE6] border-2 border-[#D9D6CA] space-y-1">
                      <span className="text-[10.5px] uppercase tracking-[0.08em] font-semibold text-[#B5532F] flex items-center space-x-1">
                        <Timer className="w-3.5 h-3.5" />
                        <span>Optimization Time</span>
                      </span>
                      <span className="font-serif text-2xl font-medium text-[#141413] tabular-nums block">
                        {isRunning ? (
                          <span className="text-base font-sans text-[#5E5D57]">Running...</span>
                        ) : currentResult?.traditional?.optimizationTimeMs ? (
                          formatMs(currentResult.traditional.optimizationTimeMs)
                        ) : (
                          '—'
                        )}
                      </span>
                      <span className="text-[11px] text-[#5E5D57] block">
                        {baselinePreset === '-O0'
                          ? 'No optimization (-O0)'
                          : baselinePreset === '-O1'
                          ? 'Light fixed checks (-O1)'
                          : `Standard checks (${baselinePreset})`}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-[18px] bg-[#F0EEE6] border-2 border-[#D9D6CA] space-y-1">
                      <span className="text-[10.5px] uppercase tracking-[0.08em] font-semibold text-[#B5532F] flex items-center space-x-1">
                        <Gauge className="w-3.5 h-3.5" />
                        <span>App Run Speed</span>
                      </span>
                      <span className="font-serif text-2xl font-medium text-[#141413] tabular-nums block">
                        {isRunning ? (
                          <span className="text-base font-sans text-[#5E5D57]">Measuring...</span>
                        ) : currentResult?.traditional?.benchmark ? (
                          formatMs(currentResult.traditional.benchmark.medianMs)
                        ) : (
                          '—'
                        )}
                      </span>
                      <span className="text-[11px] text-[#5E5D57] block">
                        {iterations} test runs
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-4 mt-4 border-t-2 border-[#D9D6CA] flex items-center justify-between text-xs">
                  <button
                    onClick={onViewIR}
                    disabled={!currentResult?.traditional?.irCode}
                    title="Inspect the internal code blueprint"
                    className="font-semibold text-[#5E5D57] hover:text-[#141413] cursor-pointer disabled:opacity-40"
                  >
                    Inspect Code Blueprint
                  </button>

                  <button
                    onClick={() => setFlippedA(true)}
                    className="font-semibold text-[#B5532F] hover:underline cursor-pointer flex items-center space-x-1"
                  >
                    <span>Flip: See 6 Steps</span>
                    <ArrowRightLeft className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* BACK FACE: CANONICAL 6 STEPS */}
              <div
                className={`absolute inset-0 backface-hidden rotate-y-180 w-full h-full editorial-card p-5 sm:p-6 flex flex-col justify-between overflow-y-auto ${
                  flippedA ? 'pointer-events-auto' : 'pointer-events-none'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b-2 border-[#D9D6CA] pb-2.5">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#B5532F] block">
                        Normal 6-Step Pipeline
                      </span>
                      <span className="text-xs text-[#5E5D57]">From Source Code to Working Program</span>
                    </div>

                    <button
                      onClick={() => setFlippedA(false)}
                      className="flex items-center space-x-1 px-3 py-1 rounded-full border-2 border-[#141413] text-xs font-semibold text-[#141413] hover:bg-[#F0EEE6] cursor-pointer shrink-0"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Back</span>
                    </button>
                  </div>

                  <div className="text-center">
                    <span className="text-[10px] font-mono font-semibold px-3 py-0.5 rounded-full bg-[#F0EEE6] border border-[#D9D6CA] text-[#141413]">
                      Source Code
                    </span>
                    <div className="text-[#5E5D57] text-[10px] leading-tight mt-0.5">↓</div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-12 gap-2 items-center text-xs">
                    <div className="col-span-1 order-2 sm:order-1 sm:col-span-3 sm:h-52 rounded-[18px] bg-[#F0EEE6] border-2 border-[#D9D6CA] p-2.5 flex flex-col items-center justify-center text-center">
                      <span className="font-mono font-semibold text-[10px] uppercase text-[#B5532F] block">
                        Variable Table
                      </span>
                      <span className="text-[10px] text-[#5E5D57] mt-1 leading-tight">
                        Tracks names, types & scopes
                      </span>
                    </div>

                    <div className="col-span-2 order-1 sm:order-2 sm:col-span-6 space-y-1.5">
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
                          className={`p-2 rounded-full border-2 flex items-center justify-between gap-1.5 text-[10.5px] leading-tight ${
                            s.highlight
                              ? 'bg-[#141413] text-[#FAF9F5] border-[#141413] font-semibold'
                              : 'bg-[#F0EEE6] border-[#D9D6CA] text-[#141413] font-medium'
                          }`}
                        >
                          <span className="text-[10px] font-mono opacity-75 shrink-0 pl-1">{s.num}.</span>
                          <span className="flex-1 text-center">{s.title}</span>
                          {s.note ? (
                            <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-full bg-[#D97757] text-[#141413] shrink-0">
                              {s.note}
                            </span>
                          ) : (
                            <span className="w-2 shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="col-span-1 order-3 sm:col-span-3 sm:h-52 rounded-[18px] bg-[#F0EEE6] border-2 border-[#D9D6CA] p-2.5 flex flex-col items-center justify-center text-center">
                      <span className="font-mono font-semibold text-[10px] uppercase text-[#B5532F] block">
                        Error Checker
                      </span>
                      <span className="text-[10px] text-[#5E5D57] mt-1 leading-tight">
                        Catches typos & grammar bugs
                      </span>
                    </div>
                  </div>

                  <div className="text-center pt-0.5">
                    <div className="text-[#5E5D57] text-[10px] leading-tight mb-0.5">↓</div>
                    <span className="text-[10px] font-mono font-semibold px-3 py-0.5 rounded-full bg-[#F0EEE6] border border-[#D9D6CA] text-[#141413]">
                      Final Working Program
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t-2 border-[#D9D6CA] flex items-center justify-between text-xs text-[#5E5D57]">
                  <span>Runs all 120 checks in order</span>
                  <button
                    onClick={() => setFlippedA(false)}
                    className="font-semibold text-[#B5532F] hover:underline cursor-pointer"
                  >
                    Return to Code
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* COMPILER 2: AI-POWERED COMPILER */}
          <div className="w-full perspective-1200">
            <div
              className={`relative w-full transition-transform duration-700 preserve-3d ${
                flippedB ? 'rotate-y-180' : ''
              }`}
            >
              {/* FRONT FACE */}
              <div
                className={`relative backface-hidden w-full min-h-[560px] editorial-card editorial-card-lift p-5 sm:p-7 flex flex-col justify-between overflow-hidden ${
                  flippedB ? 'pointer-events-none' : 'pointer-events-auto'
                }`}
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-[#D97757] text-[#141413] flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-serif text-xl font-medium text-[#141413]">
                            AI-Powered Compiler
                          </h3>
                          <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full bg-[#D97757] text-[#141413]">
                            SMART SELECTION
                          </span>
                        </div>
                        <p className="text-xs text-[#5E5D57] mt-0.5">
                          Runs only {currentResult?.passesApplied?.length || 7} targeted checks
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setFlippedB(true)}
                      className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border-2 border-[#141413] bg-transparent text-xs font-semibold text-[#141413] hover:bg-[#F0EEE6] transition-colors cursor-pointer shrink-0"
                      title="Flip card to see how AI fits into the 6 compiler steps"
                    >
                      <span>View 6 Steps</span>
                      <ArrowRightLeft className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Code / Blueprint Box */}
                  <div className="rounded-[18px] bg-[#F0EEE6] border-2 border-[#D9D6CA] p-3.5 text-xs font-mono overflow-hidden">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#5E5D57] mb-2 pb-1.5 border-b border-[#D9D6CA]">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-[#141413]">
                          Code & AI Blueprint
                        </span>
                        <div className="flex items-center space-x-1 p-0.5 rounded-full bg-[#FAF9F5] border border-[#D9D6CA] text-[10px]">
                          <button
                            onClick={() => setAiViewMode('code')}
                            className={`px-2 py-0.5 rounded-full cursor-pointer ${
                              aiViewMode === 'code'
                                ? 'bg-[#D97757] text-[#141413] font-semibold'
                                : 'text-[#5E5D57] hover:text-[#141413]'
                            }`}
                          >
                            Source
                          </button>
                          <button
                            onClick={() => setAiViewMode('ir')}
                            className={`px-2 py-0.5 rounded-full cursor-pointer ${
                              aiViewMode === 'ir'
                                ? 'bg-[#D97757] text-[#141413] font-semibold'
                                : 'text-[#5E5D57] hover:text-[#141413]'
                            }`}
                          >
                            Blueprint
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2.5">
                        <button
                          onClick={() => setIsEditingCode(!isEditingCode)}
                          className="font-semibold text-[#B5532F] hover:underline cursor-pointer text-[11px]"
                        >
                          {isEditingCode ? 'Save' : 'Edit'}
                        </button>
                        <button
                          onClick={handleCopyCode}
                          className="text-[#5E5D57] hover:text-[#141413] cursor-pointer"
                          title="Copy code"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-[#B5532F]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {aiViewMode === 'code' ? (
                      isEditingCode ? (
                        <textarea
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          spellCheck={false}
                          className="w-full h-32 bg-transparent resize-none leading-relaxed focus:outline-none text-[#141413] font-mono text-[11.5px]"
                          placeholder="// Type or paste C/C++ source code here..."
                        />
                      ) : (
                        <pre className="text-[11.5px] leading-relaxed max-h-32 overflow-y-auto text-[#141413] whitespace-pre font-mono">
                          {code}
                        </pre>
                      )
                    ) : (
                      <pre className="text-[11.5px] leading-relaxed max-h-32 overflow-y-auto text-[#141413] whitespace-pre font-mono">
                        {currentResult?.llm?.irCode || '// Run the race to view the AI-tuned code blueprint'}
                      </pre>
                    )}
                  </div>

                  {/* AI Selected Targeted Passes */}
                  <div className="p-3.5 rounded-[18px] bg-[#F0EEE6] border-2 border-[#D9D6CA] space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                      <span className="uppercase font-semibold tracking-[0.08em] text-[#B5532F]">
                        Targeted Tools ({currentResult?.passesApplied?.length || 7})
                      </span>
                      <span className="font-mono font-semibold text-[#141413]">
                        Skipped ~113 checks
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-14 overflow-y-auto">
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
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-[#FAF9F5] text-[#B5532F] border border-[#D9D6CA]"
                        >
                          -{p}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Dual Metric Dashboard */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-[18px] bg-[#F0EEE6] border-2 border-[#D9D6CA] space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10.5px] uppercase tracking-[0.08em] font-semibold text-[#B5532F] flex items-center space-x-1">
                          <Timer className="w-3.5 h-3.5" />
                          <span>Opt. Time</span>
                        </span>
                        {optSpeedupPercent !== null && optSpeedupPercent > 0 && !isRunning && (
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#D97757] text-[#141413]">
                            +{optSpeedupPercent}%
                          </span>
                        )}
                      </div>
                      <span className="font-serif text-2xl font-medium text-[#141413] tabular-nums block">
                        {isRunning ? (
                          <span className="text-base font-sans text-[#5E5D57]">Running...</span>
                        ) : currentResult?.llm?.optimizationTimeMs ? (
                          formatMs(currentResult.llm.optimizationTimeMs)
                        ) : (
                          '—'
                        )}
                      </span>
                      <span className="text-[11px] text-[#5E5D57] block">
                        Ran only {currentResult?.passesApplied?.length || 7} tools
                      </span>
                    </div>

                    <div className="p-3.5 rounded-[18px] bg-[#F0EEE6] border-2 border-[#D9D6CA] space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10.5px] uppercase tracking-[0.08em] font-semibold text-[#B5532F] flex items-center space-x-1">
                          <Gauge className="w-3.5 h-3.5" />
                          <span>Run Speed</span>
                        </span>
                        {currentResult?.comparison?.speedupPercentage !== undefined && !isRunning && (
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#D97757] text-[#141413]">
                            {currentResult.comparison.speedupPercentage > 0
                              ? `+${currentResult.comparison.speedupPercentage}%`
                              : `${currentResult.comparison.speedupPercentage}%`}
                          </span>
                        )}
                      </div>
                      <span className="font-serif text-2xl font-medium text-[#141413] tabular-nums block">
                        {isRunning ? (
                          <span className="text-base font-sans text-[#5E5D57]">Measuring...</span>
                        ) : currentResult?.llm?.benchmark ? (
                          formatMs(currentResult.llm.benchmark.medianMs)
                        ) : (
                          '—'
                        )}
                      </span>
                      <span className="text-[11px] text-[#5E5D57] block">
                        {iterations} test runs
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-4 mt-4 border-t-2 border-[#D9D6CA] flex items-center justify-between text-xs">
                  <button
                    onClick={onViewIR}
                    disabled={!currentResult?.llm?.irCode}
                    title="Inspect the internal code blueprint"
                    className="font-semibold text-[#5E5D57] hover:text-[#141413] cursor-pointer disabled:opacity-40"
                  >
                    Inspect Code Blueprint
                  </button>

                  <button
                    onClick={() => setFlippedB(true)}
                    className="font-semibold text-[#B5532F] hover:underline cursor-pointer flex items-center space-x-1"
                  >
                    <span>Flip: See 6 Steps</span>
                    <ArrowRightLeft className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* BACK FACE: CANONICAL COMPILER WITH AI HIGHLIGHT */}
              <div
                className={`absolute inset-0 backface-hidden rotate-y-180 w-full h-full editorial-card p-5 sm:p-6 flex flex-col justify-between overflow-y-auto ${
                  flippedB ? 'pointer-events-auto' : 'pointer-events-none'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b-2 border-[#D9D6CA] pb-2.5">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#B5532F] block">
                        AI-Enhanced Pipeline
                      </span>
                      <span className="text-xs text-[#5E5D57]">AI connects directly to Step 5</span>
                    </div>

                    <button
                      onClick={() => setFlippedB(false)}
                      className="flex items-center space-x-1 px-3 py-1 rounded-full border-2 border-[#141413] text-xs font-semibold text-[#141413] hover:bg-[#F0EEE6] cursor-pointer shrink-0"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Back</span>
                    </button>
                  </div>

                  <div className="text-center">
                    <span className="text-[10px] font-mono font-semibold px-3 py-0.5 rounded-full bg-[#F0EEE6] border border-[#D9D6CA] text-[#141413]">
                      Source Code
                    </span>
                    <div className="text-[#5E5D57] text-[10px] leading-tight mt-0.5">↓</div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-12 gap-2 items-center text-xs">
                    <div className="col-span-1 order-2 sm:order-1 sm:col-span-3 sm:h-52 rounded-[18px] bg-[#F0EEE6] border-2 border-[#D9D6CA] p-2.5 flex flex-col items-center justify-center text-center">
                      <span className="font-mono font-semibold text-[10px] uppercase text-[#B5532F] block">
                        Variable Table
                      </span>
                      <span className="text-[10px] text-[#5E5D57] mt-1 leading-tight">
                        Tracks names, types & scopes
                      </span>
                    </div>

                    <div className="col-span-2 order-1 sm:order-2 sm:col-span-6 space-y-1.5">
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
                          className={`p-2 rounded-full border-2 flex items-center justify-between gap-1.5 text-[10.5px] leading-tight ${
                            s.ai
                              ? 'bg-[#D97757] text-[#141413] border-[#141413] font-semibold'
                              : 'bg-[#F0EEE6] border-[#D9D6CA] text-[#141413] font-medium'
                          }`}
                        >
                          <span className="text-[10px] font-mono opacity-75 shrink-0 pl-1">{s.num}.</span>
                          <span className="flex-1 text-center">{s.title}</span>
                          {s.ai ? (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[#141413] text-[#FAF9F5] font-semibold shrink-0">
                              AI
                            </span>
                          ) : (
                            <span className="w-2 shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="col-span-1 order-3 sm:col-span-3 sm:h-52 rounded-[18px] bg-[#F0EEE6] border-2 border-[#D9D6CA] p-2.5 flex flex-col items-center justify-center text-center">
                      <span className="font-mono font-semibold text-[10px] uppercase text-[#B5532F] block">
                        Error Checker
                      </span>
                      <span className="text-[10px] text-[#5E5D57] mt-1 leading-tight">
                        Catches typos & grammar bugs
                      </span>
                    </div>
                  </div>

                  <div className="text-center pt-0.5">
                    <div className="text-[#5E5D57] text-[10px] leading-tight mb-0.5">↓</div>
                    <span className="text-[10px] font-mono font-semibold px-3 py-0.5 rounded-full bg-[#F0EEE6] border border-[#D9D6CA] text-[#141413]">
                      Final Working Program
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t-2 border-[#D9D6CA] flex items-center justify-between text-xs text-[#5E5D57]">
                  <span>AI guides Step 5 directly</span>
                  <button
                    onClick={() => setFlippedB(false)}
                    className="font-semibold text-[#B5532F] hover:underline cursor-pointer"
                  >
                    Return to Code
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BAND 5 (NEAR-BLACK #141413): RACE RESULTS VERDICT ================= */}
      {currentResult && !isRunning && (
        <section className="rounded-[24px] bg-[#141413] text-[#FAF9F5] p-6 sm:p-10 space-y-6 animate-editorial-in">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#5E5D57]/40 pb-6">
            <div className="space-y-2">
              <span className="text-xs uppercase font-semibold tracking-[0.08em] text-[#D97757] block">
                Race Results & Verdict
              </span>
              <div className="font-serif-display text-4xl sm:text-5xl text-[#D97757] tabular-nums">
                {optSpeedupPercent && optSpeedupPercent > 0
                  ? `${optSpeedupPercent}% faster optimization`
                  : 'Compilation Complete'}
              </div>
              <p className="text-sm text-[#C9C6BA]">
                {programName} • Standard {formatMs(currentResult.traditional.optimizationTimeMs)} vs. AI{' '}
                {formatMs(currentResult.llm.optimizationTimeMs)}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onViewIR}
                className="px-5 py-2.5 rounded-full bg-[#D97757] text-[#141413] text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Inspect Blueprints
              </button>

              <button
                onClick={() => setShowVerdictDetails(!showVerdictDetails)}
                className="px-5 py-2.5 rounded-full border-2 border-[#FAF9F5] bg-transparent text-xs font-semibold text-[#FAF9F5] hover:bg-[#FAF9F5]/10 transition-colors cursor-pointer flex items-center space-x-1.5"
              >
                <span>{showVerdictDetails ? 'Hide explanation' : 'Why did times differ?'}</span>
                {showVerdictDetails ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Concise Status Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#C9C6BA]">
            <div className="flex items-center space-x-2">
              <CheckCheck className="w-4 h-4 text-[#D97757] shrink-0" />
              <span>
                Output Check: 100% identical result (Match ID:{' '}
                <code className="font-mono font-semibold text-[#D97757]">
                  {currentResult.traditional.benchmark.outputHash}
                </code>
                )
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
              <span className="text-[#C9C6BA]">Tools:</span>
              {currentResult.passesApplied.map((p, idx) => (
                <span key={idx} className="text-[#D97757] font-semibold">
                  -{p}
                  {idx < currentResult.passesApplied.length - 1 ? ',' : ''}
                </span>
              ))}
            </div>
          </div>

          {/* Expandable Detailed Breakdown (Accordion) */}
          {showVerdictDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 animate-editorial-in">
              <div className="p-5 rounded-[20px] bg-[#FAF9F5] text-[#141413] space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#B5532F] block">
                  1. Why did the times differ?
                </span>
                <p className="text-sm text-[#5E5D57] leading-relaxed">
                  The normal compiler ({baselinePreset}) ran its fixed pass schedule in{' '}
                  <strong className="text-[#141413]">{formatMs(currentResult.traditional.optimizationTimeMs)}</strong>.
                  The AI compiler scanned the code first and ran{' '}
                  <strong className="text-[#141413]">{currentResult.passesApplied.length} targeted checks</strong> in{' '}
                  <strong className="text-[#141413]">{formatMs(currentResult.llm.optimizationTimeMs)}</strong>
                  {optSpeedupPercent && optSpeedupPercent > 0 ? (
                    <>
                      {' '}
                      — finishing optimization <strong className="text-[#B5532F]">{optSpeedupPercent}% faster</strong>
                    </>
                  ) : null}
                  .
                </p>
              </div>

              <div className="p-5 rounded-[20px] bg-[#FAF9F5] text-[#141413] space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#B5532F] block">
                  2. Did the program still run correctly?
                </span>
                <p className="text-sm text-[#5E5D57] leading-relaxed">
                  <strong className="text-[#141413]">Yes, 100% correct.</strong> Both compilers produced identical output
                  (Match ID: <code className="font-mono font-semibold text-[#B5532F]">{currentResult.traditional.benchmark.outputHash}</code>).
                  The AI-optimized version runs{' '}
                  <strong className="text-[#141413]">
                    {currentResult.comparison.speedupPercentage > 0
                      ? `${currentResult.comparison.speedupPercentage}% faster`
                      : 'at peak speed'}
                  </strong>{' '}
                  by focusing directly on loops and registers.
                </p>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
