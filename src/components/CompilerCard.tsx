import React, { useState } from 'react';
import {
  Cpu,
  Sparkles,
  Layers,
  Clock,
  HardDrive,
  Info,
  RotateCcw,
  Zap,
  CheckCircle2,
  AlertCircle,
  Terminal,
  ArrowDown,
  Box
} from 'lucide-react';
import { PipelineCompilationData, LLMPipelineData } from '../types';

interface CompilerCardProps {
  type: 'traditional' | 'llm';
  title: string;
  subtitle: string;
  badge: string;
  presetOrModel: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  data?: PipelineCompilationData | LLMPipelineData;
  errorMessage?: string;
  onViewIR: () => void;
  isRunning?: boolean;
  onNavigateTo3D?: () => void;
}

export const CompilerCard: React.FC<CompilerCardProps> = ({
  type,
  title,
  subtitle,
  badge,
  presetOrModel,
  status,
  data,
  errorMessage,
  onViewIR,
  isRunning,
  onNavigateTo3D,
}) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const isLLM = type === 'llm';

  const formatMs = (ms?: number) => {
    if (ms === undefined || ms === null) return '—';
    if (ms < 1) return `${(ms * 1000).toFixed(0)} µs`;
    return `${ms.toFixed(2)} ms`;
  };

  const formatBytes = (bytes?: number) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="w-full perspective-1200 group">
      <div
        className={`relative w-full transition-transform duration-700 preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* ================= FRONT FACE: APPLE METRIC WIDGET ================= */}
        <div className={`relative backface-hidden w-full min-h-[450px] rounded-3xl apple-glass p-4 sm:p-6 flex flex-col justify-between overflow-hidden ${isFlipped ? 'pointer-events-none' : 'pointer-events-auto'}`}>
          {/* Card Header */}
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-sm transition-transform duration-300 ${
                    isLLM
                      ? 'bg-black dark:bg-white text-white dark:text-black border-transparent'
                      : 'bg-black/[0.04] dark:bg-white/[0.06] text-black dark:text-white border-black/[0.05] dark:border-white/[0.08]'
                  }`}
                >
                  {isLLM ? (
                    <div className="relative">
                      <Cpu className="w-5 h-5" />
                      <Sparkles className="w-2.5 h-2.5 absolute -top-1 -right-1" />
                    </div>
                  ) : (
                    <Cpu className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-sm sm:text-base text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
                      {title}
                    </h3>
                    <span
                      className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ${
                        isLLM
                          ? 'bg-black dark:bg-white text-white dark:text-black'
                          : 'bg-black/[0.06] dark:bg-white/[0.08] text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {badge}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {subtitle}
                  </p>
                </div>
              </div>

              {/* 3D Flip Info Button */}
              <button
                onClick={() => setIsFlipped(true)}
                title="Inspect Pipeline (3D Flip)"
                className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-black dark:hover:text-white apple-glass-pill transition-all cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Config & Status Strip */}
            <div className="mt-3.5 px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05] flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-zinc-600 dark:text-zinc-400 font-semibold text-xs">
                    {isLLM ? 'Mode:' : 'Setting:'}
                  </span>
                  <span className="font-mono font-bold text-zinc-950 dark:text-white text-xs">
                    {presetOrModel}
                  </span>
                </div>

              <div className="flex items-center space-x-1.5">
                {status === 'running' ? (
                  <span className="inline-flex items-center text-zinc-950 dark:text-white font-mono text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-zinc-950 dark:bg-white mr-1.5 animate-ping" />
                    Optimizing...
                  </span>
                ) : status === 'completed' ? (
                  <span className="inline-flex items-center text-zinc-950 dark:text-white font-mono text-[11px] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Ready & Verified
                  </span>
                ) : status === 'error' ? (
                  <span className="inline-flex items-center text-red-600 font-mono text-[11px] font-semibold">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" />
                    Failed
                  </span>
                ) : (
                  <span className="inline-flex items-center text-zinc-600 dark:text-zinc-400 font-mono text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mr-1.5" />
                    Ready to Test
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Center Hero Metric: Execution Time */}
          <div className="my-auto py-2 flex flex-col justify-center">
            <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-700 dark:text-zinc-300 flex items-center">
                  <Clock className="w-3 h-3 mr-1.5 text-zinc-600 dark:text-zinc-400" />
                  App Run Speed
                </span>
                {data?.benchmark && (
                  <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400">
                    {data.benchmark.iterations} test runs
                  </span>
                )}
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-mono font-extrabold tracking-tight text-zinc-950 dark:text-white">
                  {status === 'running' ? (
                    <span className="animate-pulse text-zinc-500">Measuring...</span>
                  ) : data?.benchmark ? (
                    formatMs(data.benchmark.medianMs)
                  ) : (
                    '—'
                  )}
                </span>
              </div>
            </div>

            {/* 3 Micro Stats Grid: Compilation, Optimization Pass Time, Binary Footprint */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mt-2 text-xs">
              <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06]">
                <span className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 block">Total Build</span>
                <span className="text-xs font-mono font-bold text-zinc-950 dark:text-[#F5F5F7]">
                  {formatMs(data?.compilationTimeMs)}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06]">
                <span className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 block">Optimization</span>
                <span className="text-xs font-mono font-bold text-zinc-950 dark:text-[#F5F5F7]">
                  {formatMs(data?.optimizationTimeMs)}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06]">
                <span className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 block">File Size</span>
                <span className="text-xs font-mono font-bold text-zinc-950 dark:text-[#F5F5F7]">
                  {formatBytes(data?.binarySizeBytes)}
                </span>
              </div>
            </div>

            {/* Passes Strip (for LLM panel) */}
            {isLLM && (
              <div className="mt-2 p-2.5 rounded-xl bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.06]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200 flex items-center">
                    <Zap className="w-2.5 h-2.5 mr-1" />
                    Targeted Tools Applied ({('recommendedPasses' in (data || {}) ? (data as any).recommendedPasses?.length : 0) || 7})
                  </span>
                  {(data as any)?.confidenceScore && (
                    <span className="text-[9px] font-mono text-zinc-600 dark:text-zinc-400">
                      {(data as any).confidenceScore}% confidence
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 max-h-12 overflow-y-auto">
                  {((data as any)?.recommendedPasses || ['mem2reg', 'instcombine', 'loop-unroll', 'dce']).map(
                    (pass: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 rounded-md text-[9.5px] font-mono font-semibold bg-zinc-200 dark:bg-white/[0.1] text-zinc-950 dark:text-[#F5F5F7]"
                      >
                        -{pass}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Card Footer */}
          <div className="pt-3 border-t border-zinc-200 dark:border-white/[0.08] flex items-center justify-between">
            <button
              onClick={onViewIR}
              disabled={!data?.irCode}
              className={`flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl apple-glass-pill transition-all ${
                data?.irCode
                  ? 'text-zinc-950 dark:text-[#F5F5F7] hover:bg-zinc-200 dark:hover:bg-white/[0.1] cursor-pointer'
                  : 'text-zinc-400 opacity-50 cursor-not-allowed'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 mr-1" />
              <span>Inspect Code Blueprint</span>
            </button>

            {onNavigateTo3D ? (
              <button
                onClick={onNavigateTo3D}
                className="flex items-center space-x-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                <Box className="w-3.5 h-3.5 mr-1" />
                <span>3D Flow</span>
              </button>
            ) : (
              <button
                onClick={() => setIsFlipped(true)}
                className="flex items-center space-x-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:underline cursor-pointer"
              >
                <span>Pipeline Steps</span>
                <Info className="w-3 h-3 ml-0.5" />
              </button>
            )}
          </div>
        </div>

        {/* ================= BACK FACE: OPTIMIZATION PIPELINE FLOW ================= */}
        <div className={`absolute inset-0 backface-hidden rotate-y-180 w-full h-full rounded-3xl apple-glass p-4 sm:p-6 flex flex-col justify-between overflow-y-auto ${isFlipped ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          {/* Back Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/[0.08] pb-2.5">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-xl bg-zinc-200 dark:bg-white/[0.08] flex items-center justify-center">
                <Layers className="w-3.5 h-3.5 text-zinc-950 dark:text-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-950 dark:text-[#F5F5F7]">
                  {isLLM ? 'AI Targeted Steps' : 'Standard Compiler Steps'}
                </h4>
              </div>
            </div>

            <button
              onClick={() => setIsFlipped(false)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-semibold apple-glass-pill text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              <span>Back</span>
            </button>
          </div>

          {/* Pipeline Stages Vertical Flow */}
          <div className="my-2 flex-1 overflow-y-auto pr-1 space-y-1.5 text-xs">
            {isLLM ? (
              [
                { num: 1, title: 'Lexical Analysis (Scanner)', desc: 'Reads code into words and symbols' },
                { num: 2, title: 'Syntax Analysis (Parser)', desc: 'Checks grammar and builds program tree' },
                { num: 3, title: 'Semantic Analysis', desc: 'Verifies data types and variable rules' },
                { num: 4, title: 'Intermediate Code Generation', desc: 'Builds a universal code blueprint' },
                { num: 5, title: 'Code Optimization (AI-Guided)', desc: 'AI picks ~7 targeted tools and skips 113 useless checks' },
                { num: 6, title: 'Target Code Generation', desc: 'Generates CPU code and verifies identical output' },
              ].map((s) => (
                <div key={s.num} className="p-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.05] flex items-center space-x-2.5">
                  <span className="w-4 h-4 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-black flex items-center justify-center text-[9px] font-mono font-bold shrink-0">
                    {s.num}
                  </span>
                  <div>
                    <span className="font-bold text-[11px] text-zinc-950 dark:text-[#F5F5F7] block">
                      {s.title}
                    </span>
                    <span className="text-[10px] text-zinc-600 dark:text-zinc-400 block">
                      {s.desc}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              [
                { num: 1, title: 'Lexical Analysis (Scanner)', desc: 'Reads code into words and symbols' },
                { num: 2, title: 'Syntax Analysis (Parser)', desc: 'Checks grammar and builds program tree' },
                { num: 3, title: 'Semantic Analysis', desc: 'Verifies data types and variable rules' },
                { num: 4, title: 'Intermediate Code Generation', desc: 'Builds a universal code blueprint' },
                { num: 5, title: 'Code Optimization', desc: 'Runs 120+ fixed checks blindly in sequence' },
                { num: 6, title: 'Target Code Generation', desc: 'Generates final runnable CPU instructions' },
              ].map((s) => (
                <div key={s.num} className="p-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.05] flex items-center space-x-2.5">
                  <span className="w-4 h-4 rounded-full bg-zinc-300 dark:bg-white/[0.2] text-zinc-950 dark:text-white flex items-center justify-center text-[9px] font-mono font-bold shrink-0">
                    {s.num}
                  </span>
                  <div>
                    <span className="font-bold text-[11px] text-zinc-950 dark:text-[#F5F5F7] block">
                      {s.title}
                    </span>
                    <span className="text-[10px] text-zinc-600 dark:text-zinc-400 block">
                      {s.desc}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-zinc-200 dark:border-white/[0.08] flex items-center justify-between text-xs">
            <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">
              {isLLM ? 'Diagnoses Before Checking' : 'Runs All 120+ Checks Blindly'}
            </span>
            <button
              onClick={() => setIsFlipped(false)}
              className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white cursor-pointer"
            >
              Return to Metrics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
