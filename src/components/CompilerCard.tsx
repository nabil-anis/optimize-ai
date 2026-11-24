import React, { useState } from 'react';
import {
  Cpu,
  Sparkles,
  Layers,
  Clock,
  Info,
  RotateCcw,
  Zap,
  CheckCircle2,
  AlertCircle,
  Terminal,
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
  onViewIR,
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
    <div className="w-full perspective-1200">
      <div
        className={`relative w-full transition-transform duration-700 preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* ================= FRONT FACE ================= */}
        <div
          className={`relative backface-hidden w-full min-h-[450px] editorial-card editorial-card-lift p-5 sm:p-7 flex flex-col justify-between overflow-hidden ${
            isFlipped ? 'pointer-events-none' : 'pointer-events-auto'
          }`}
        >
          {/* Card Header */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 ${
                    isLLM
                      ? 'bg-[#D97757] text-[#141413] border-[#141413]/20'
                      : 'bg-[#F0EEE6] text-[#141413] border-[#D9D6CA]'
                  }`}
                >
                  {isLLM ? <Sparkles className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif text-xl font-medium text-[#141413] tracking-tight">
                      {title}
                    </h3>
                    <span
                      className={`text-[10px] font-mono uppercase font-semibold px-2.5 py-0.5 rounded-full ${
                        isLLM
                          ? 'bg-[#D97757] text-[#141413]'
                          : 'bg-[#F0EEE6] border border-[#D9D6CA] text-[#B5532F]'
                      }`}
                    >
                      {badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#5E5D57] mt-0.5">{subtitle}</p>
                </div>
              </div>

              <button
                onClick={() => setIsFlipped(true)}
                title="Inspect Pipeline (3D Flip)"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#5E5D57] hover:text-[#141413] bg-[#F0EEE6] border-2 border-[#D9D6CA] hover:border-[#141413] transition-colors cursor-pointer shrink-0"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Config & Status Strip */}
            <div className="mt-4 px-3.5 py-2.5 rounded-full bg-[#F0EEE6] border-2 border-[#D9D6CA] flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-[#5E5D57] font-semibold text-xs">
                  {isLLM ? 'Mode:' : 'Setting:'}
                </span>
                <span className="font-mono font-semibold text-[#141413] text-xs">
                  {presetOrModel}
                </span>
              </div>

              <div className="flex items-center space-x-1.5">
                {status === 'running' ? (
                  <span className="inline-flex items-center text-[#B5532F] font-mono text-[11px] font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#D97757] mr-1.5" />
                    Optimizing...
                  </span>
                ) : status === 'completed' ? (
                  <span className="inline-flex items-center text-[#141413] font-mono text-[11px] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#B5532F]" />
                    Verified
                  </span>
                ) : status === 'error' ? (
                  <span className="inline-flex items-center text-[#B5532F] font-mono text-[11px] font-semibold">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" />
                    Failed
                  </span>
                ) : (
                  <span className="inline-flex items-center text-[#5E5D57] font-mono text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D9D6CA] mr-1.5" />
                    Ready to Test
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Center Hero Metric: Execution Time */}
          <div className="my-auto py-3 flex flex-col justify-center">
            <div className="p-4 rounded-[18px] bg-[#F0EEE6] border-2 border-[#D9D6CA]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[#B5532F] flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1.5" />
                  App Run Speed
                </span>
                {data?.benchmark && (
                  <span className="text-[10px] font-mono text-[#5E5D57]">
                    {data.benchmark.iterations} test runs
                  </span>
                )}
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#141413] tabular-nums">
                  {status === 'running' ? (
                    <span className="text-lg font-sans text-[#5E5D57]">Measuring...</span>
                  ) : data?.benchmark ? (
                    formatMs(data.benchmark.medianMs)
                  ) : (
                    '—'
                  )}
                </span>
              </div>
            </div>

            {/* 3 Micro Stats Grid */}
            <div className="grid grid-cols-3 gap-2 mt-2.5 text-xs">
              <div className="p-3 rounded-[16px] bg-[#F0EEE6] border-2 border-[#D9D6CA]">
                <span className="text-[10px] uppercase font-semibold tracking-[0.06em] text-[#5E5D57] block">
                  Total Build
                </span>
                <span className="text-xs font-mono font-semibold text-[#141413] tabular-nums">
                  {formatMs(data?.compilationTimeMs)}
                </span>
              </div>
              <div className="p-3 rounded-[16px] bg-[#F0EEE6] border-2 border-[#D9D6CA]">
                <span className="text-[10px] uppercase font-semibold tracking-[0.06em] text-[#5E5D57] block">
                  Optimization
                </span>
                <span className="text-xs font-mono font-semibold text-[#141413] tabular-nums">
                  {formatMs(data?.optimizationTimeMs)}
                </span>
              </div>
              <div className="p-3 rounded-[16px] bg-[#F0EEE6] border-2 border-[#D9D6CA]">
                <span className="text-[10px] uppercase font-semibold tracking-[0.06em] text-[#5E5D57] block">
                  File Size
                </span>
                <span className="text-xs font-mono font-semibold text-[#141413] tabular-nums">
                  {formatBytes(data?.binarySizeBytes)}
                </span>
              </div>
            </div>

            {/* Passes Strip (for LLM panel) */}
            {isLLM && (
              <div className="mt-2.5 p-3 rounded-[18px] bg-[#F0EEE6] border-2 border-[#D9D6CA]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10.5px] uppercase tracking-[0.08em] font-semibold text-[#B5532F] flex items-center">
                    <Zap className="w-3 h-3 mr-1" />
                    Targeted Tools ({('recommendedPasses' in (data || {}) ? (data as any).recommendedPasses?.length : 0) || 7})
                  </span>
                  {(data as any)?.confidenceScore && (
                    <span className="text-[10px] font-mono text-[#5E5D57]">
                      {(data as any).confidenceScore}% match
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-12 overflow-y-auto">
                  {((data as any)?.recommendedPasses || ['mem2reg', 'instcombine', 'loop-unroll', 'dce']).map(
                    (pass: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#FAF9F5] border border-[#D9D6CA] text-[#B5532F]"
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
          <div className="pt-3.5 border-t-2 border-[#D9D6CA] flex items-center justify-between">
            <button
              onClick={onViewIR}
              disabled={!data?.irCode}
              className={`flex items-center space-x-1.5 text-xs font-semibold px-4 py-1.5 rounded-full border-2 transition-colors ${
                data?.irCode
                  ? 'border-[#141413] text-[#141413] hover:bg-[#F0EEE6] cursor-pointer'
                  : 'border-[#D9D6CA] text-[#5E5D57] opacity-50 cursor-not-allowed'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Inspect Blueprint</span>
            </button>

            {onNavigateTo3D ? (
              <button
                onClick={onNavigateTo3D}
                className="flex items-center space-x-1 text-xs font-semibold text-[#B5532F] hover:underline cursor-pointer"
              >
                <Box className="w-3.5 h-3.5" />
                <span>3D Flow</span>
              </button>
            ) : (
              <button
                onClick={() => setIsFlipped(true)}
                className="flex items-center space-x-1 text-xs font-semibold text-[#B5532F] hover:underline cursor-pointer"
              >
                <span>Pipeline Steps</span>
                <Info className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* ================= BACK FACE ================= */}
        <div
          className={`absolute inset-0 backface-hidden rotate-y-180 w-full h-full editorial-card p-5 sm:p-6 flex flex-col justify-between overflow-y-auto ${
            isFlipped ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          <div className="flex items-center justify-between border-b-2 border-[#D9D6CA] pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#F0EEE6] border-2 border-[#D9D6CA] flex items-center justify-center">
                <Layers className="w-4 h-4 text-[#B5532F]" />
              </div>
              <h4 className="font-serif text-base font-medium text-[#141413]">
                {isLLM ? 'AI Targeted Steps' : 'Standard Compiler Steps'}
              </h4>
            </div>

            <button
              onClick={() => setIsFlipped(false)}
              className="flex items-center space-x-1 px-3 py-1 rounded-full border-2 border-[#141413] text-xs font-semibold text-[#141413] hover:bg-[#F0EEE6] cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Back</span>
            </button>
          </div>

          <div className="my-3 flex-1 overflow-y-auto pr-1 space-y-2 text-xs">
            {(isLLM
              ? [
                  { num: 1, title: 'Lexical Analysis (Scanner)', desc: 'Reads code into words and symbols' },
                  { num: 2, title: 'Syntax Analysis (Parser)', desc: 'Checks grammar and builds program tree' },
                  { num: 3, title: 'Semantic Analysis', desc: 'Verifies data types and variable rules' },
                  { num: 4, title: 'Intermediate Code Generation', desc: 'Builds a universal code blueprint' },
                  { num: 5, title: 'Code Optimization (AI-Guided)', desc: 'AI picks ~7 targeted tools and skips 113 useless checks', highlight: true },
                  { num: 6, title: 'Target Code Generation', desc: 'Generates CPU code and verifies identical output' },
                ]
              : [
                  { num: 1, title: 'Lexical Analysis (Scanner)', desc: 'Reads code into words and symbols' },
                  { num: 2, title: 'Syntax Analysis (Parser)', desc: 'Checks grammar and builds program tree' },
                  { num: 3, title: 'Semantic Analysis', desc: 'Verifies data types and variable rules' },
                  { num: 4, title: 'Intermediate Code Generation', desc: 'Builds a universal code blueprint' },
                  { num: 5, title: 'Code Optimization', desc: 'Runs 120+ fixed checks blindly in sequence', highlight: true },
                  { num: 6, title: 'Target Code Generation', desc: 'Generates final runnable CPU instructions' },
                ]
            ).map((s) => (
              <div
                key={s.num}
                className={`p-2.5 rounded-[16px] border-2 flex items-center space-x-2.5 ${
                  s.highlight
                    ? 'bg-[#D97757]/20 border-[#D97757]'
                    : 'bg-[#F0EEE6] border-[#D9D6CA]'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-semibold shrink-0 ${
                    s.highlight ? 'bg-[#D97757] text-[#141413]' : 'bg-[#141413] text-[#FAF9F5]'
                  }`}
                >
                  {s.num}
                </span>
                <div>
                  <span className="font-semibold text-[11px] text-[#141413] block">{s.title}</span>
                  <span className="text-[10.5px] text-[#5E5D57] block">{s.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2.5 border-t-2 border-[#D9D6CA] flex items-center justify-between text-xs">
            <span className="text-[11px] text-[#5E5D57]">
              {isLLM ? 'Diagnoses Before Checking' : 'Runs All 120+ Checks Blindly'}
            </span>
            <button
              onClick={() => setIsFlipped(false)}
              className="text-xs font-semibold text-[#B5532F] hover:underline cursor-pointer"
            >
              Return to Metrics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
