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
    <div className="w-full h-[460px] perspective-1200 group">
      <div
        className={`relative w-full h-full transition-transform duration-700 preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* ================= FRONT FACE: APPLE METRIC WIDGET ================= */}
        <div className="absolute inset-0 backface-hidden w-full h-full rounded-3xl apple-glass p-6 flex flex-col justify-between overflow-hidden">
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
                <span className="text-zinc-400 font-normal">
                  {isLLM ? 'Model:' : 'Preset:'}
                </span>
                <span className="font-mono font-semibold text-black dark:text-white text-xs">
                  {presetOrModel}
                </span>
              </div>

              <div className="flex items-center space-x-1.5">
                {status === 'running' ? (
                  <span className="inline-flex items-center text-black dark:text-white font-mono text-[11px] font-medium">
                    <span className="w-2 h-2 rounded-full bg-black dark:bg-white mr-1.5 animate-ping" />
                    Optimizing...
                  </span>
                ) : status === 'completed' ? (
                  <span className="inline-flex items-center text-black dark:text-white font-mono text-[11px] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Verified
                  </span>
                ) : status === 'error' ? (
                  <span className="inline-flex items-center text-zinc-500 font-mono text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" />
                    Failed
                  </span>
                ) : (
                  <span className="inline-flex items-center text-zinc-400 font-mono text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mr-1.5" />
                    Ready
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Center Hero Metric: Execution Time */}
          <div className="my-auto py-2 flex flex-col justify-center">
            <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 flex items-center">
                  <Clock className="w-3 h-3 mr-1.5 text-zinc-400" />
                  Execution Latency (Median)
                </span>
                {data?.benchmark && (
                  <span className="text-[10px] font-mono text-zinc-400">
                    {data.benchmark.iterations} runs
                  </span>
                )}
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-mono font-bold tracking-tight text-[#1D1D1F] dark:text-white">
                  {status === 'running' ? (
                    <span className="animate-pulse text-zinc-400">Benchmarking...</span>
                  ) : data?.benchmark ? (
                    formatMs(data.benchmark.medianMs)
                  ) : (
                    '—'
                  )}
                </span>
              </div>
            </div>

            {/* 3 Micro Stats Grid: Compilation, Optimization Pass Time, Binary Footprint */}
            <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
              <div className="p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05]">
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">Compilation</span>
                <span className="text-xs font-mono font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  {formatMs(data?.compilationTimeMs)}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05]">
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">Pass Runtime</span>
                <span className="text-xs font-mono font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  {formatMs(data?.optimizationTimeMs)}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05]">
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">Binary Size</span>
                <span className="text-xs font-mono font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  {formatBytes(data?.binarySizeBytes)}
                </span>
              </div>
            </div>

            {/* Passes Strip (for LLM panel) */}
            {isLLM && (
              <div className="mt-2 p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 flex items-center">
                    <Zap className="w-2.5 h-2.5 mr-1" />
                    Applied Passes ({('recommendedPasses' in (data || {}) ? (data as any).recommendedPasses?.length : 0) || 0})
                  </span>
                  {(data as any)?.confidenceScore && (
                    <span className="text-[9px] font-mono text-zinc-400">
                      {(data as any).confidenceScore}% confidence
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 max-h-12 overflow-y-auto">
                  {((data as any)?.recommendedPasses || ['mem2reg', 'instcombine', 'loop-unroll', 'dce']).map(
                    (pass: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.2 rounded-md text-[9.5px] font-mono bg-black/[0.04] dark:bg-white/[0.08] text-[#1D1D1F] dark:text-[#F5F5F7]"
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
          <div className="pt-3 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between">
            <button
              onClick={onViewIR}
              disabled={!data?.irCode}
              className={`flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-xl apple-glass-pill transition-all ${
                data?.irCode
                  ? 'text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] cursor-pointer'
                  : 'text-zinc-400 opacity-50 cursor-not-allowed'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 mr-1" />
              <span>Inspect IR</span>
            </button>

            {onNavigateTo3D ? (
              <button
                onClick={onNavigateTo3D}
                className="flex items-center space-x-1 text-xs text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                <Box className="w-3.5 h-3.5 mr-1" />
                <span>3D Pipeline</span>
              </button>
            ) : (
              <button
                onClick={() => setIsFlipped(true)}
                className="flex items-center space-x-1 text-xs text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:underline cursor-pointer"
              >
                <span>Pipeline Steps</span>
                <Info className="w-3 h-3 ml-0.5" />
              </button>
            )}
          </div>
        </div>

        {/* ================= BACK FACE: OPTIMIZATION PIPELINE FLOW ================= */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 w-full h-full rounded-3xl apple-glass p-6 flex flex-col justify-between overflow-hidden">
          {/* Back Header */}
          <div className="flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.06] pb-2.5">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-xl bg-black/[0.04] dark:bg-white/[0.08] flex items-center justify-center">
                <Layers className="w-3.5 h-3.5 text-black dark:text-white" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  {isLLM ? 'LLM Optimization Sequence' : 'Standard Clang / LLVM Flow'}
                </h4>
              </div>
            </div>

            <button
              onClick={() => setIsFlipped(false)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-medium apple-glass-pill text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              <span>Back</span>
            </button>
          </div>

          {/* Pipeline Stages Vertical Flow */}
          <div className="my-2 flex-1 overflow-y-auto pr-1 space-y-1 text-xs">
            {isLLM ? (
              [
                { num: 1, title: 'Source Ingestion', desc: 'Normalized C/C++ translation unit' },
                { num: 2, title: 'Clang Unoptimized Emission', desc: 'Emits raw IR (-O0 -disable-O0-optnone)' },
                { num: 3, title: 'SSA IR Analysis', desc: 'Analyzes CFG branch density & memory allocas' },
                { num: 4, title: 'Gemini 3.8 Flash Synthesis', desc: 'Synthesizes targeted minimal pass order' },
                { num: 5, title: 'LLVM Opt Pass Engine', desc: 'Applies selected passes to mutate IR' },
                { num: 6, title: 'CodeGen & Multi-Run Verify', desc: 'Emits binary and verifies SHA-256 hash' },
              ].map((s) => (
                <div key={s.num} className="p-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.03] dark:border-white/[0.04] flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-[9px] font-mono font-bold shrink-0">
                    {s.num}
                  </span>
                  <div>
                    <span className="font-semibold text-[11px] text-[#1D1D1F] dark:text-[#F5F5F7] block">
                      {s.title}
                    </span>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">
                      {s.desc}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              [
                { num: 1, title: 'Source Input', desc: 'C / C++ source program input' },
                { num: 2, title: 'Clang Frontend', desc: 'Lexing, Parsing, AST & Semantics' },
                { num: 3, title: 'LLVM IR Lowering', desc: 'Lowered to target-independent IR' },
                { num: 4, title: 'Static Passes (-O2)', desc: 'Standard fixed ~120 pass pipeline' },
                { num: 5, title: 'Machine CodeGen', desc: 'Instruction selection & register allocation' },
                { num: 6, title: 'Executable Output', desc: 'Linked native ELF binary' },
              ].map((s) => (
                <div key={s.num} className="p-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.03] dark:border-white/[0.04] flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-black/[0.08] dark:bg-white/[0.1] text-black dark:text-white flex items-center justify-center text-[9px] font-mono font-bold shrink-0">
                    {s.num}
                  </span>
                  <div>
                    <span className="font-semibold text-[11px] text-[#1D1D1F] dark:text-[#F5F5F7] block">
                      {s.title}
                    </span>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">
                      {s.desc}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-[10px] text-zinc-400">
              {isLLM ? 'Adaptive IR Synthesis' : 'Static Pass Pipeline'}
            </span>
            <button
              onClick={() => setIsFlipped(false)}
              className="text-xs text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white cursor-pointer"
            >
              Return to Metrics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
