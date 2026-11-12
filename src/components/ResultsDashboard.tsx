import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileCode
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { BenchmarkResponse, SystemStatus } from '../types';

interface ResultsDashboardProps {
  result: BenchmarkResponse;
  systemStatus: SystemStatus | null;
  onViewIR: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  result,
  systemStatus,
  onViewIR,
}) => {
  const { traditional, llm, comparison, programName, iterations, baselinePreset } = result;

  const speedup = comparison.speedupPercentage;
  const isFaster = speedup > 0;
  const isSlower = speedup < 0;

  // Chart data for Execution Time over individual runs
  const runComparisonData = (traditional.benchmark?.individualRuns || []).map((tradRun, idx) => {
    const llmRun = llm.benchmark?.individualRuns?.[idx];
    return {
      run: `Run ${idx + 1}`,
      traditional: tradRun.durationMs,
      llm: llmRun ? llmRun.durationMs : 0,
    };
  });

  return (
    <div className="w-full space-y-5">
      {/* 1. Apple Keynote Executive Verdict Banner */}
      <div className="p-6 rounded-3xl apple-glass shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
              <span className="font-semibold uppercase tracking-wider">Benchmark Verdict</span>
              <span>•</span>
              <span>{programName}</span>
              <span>•</span>
              <span>{iterations} iterations (median)</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] flex items-center gap-2">
              {isFaster ? (
                <span className="flex items-center text-black dark:text-white">
                  <TrendingUp className="w-7 h-7 mr-2" />
                  +{Math.abs(speedup)}% Faster Execution
                </span>
              ) : isSlower ? (
                <span className="flex items-center text-zinc-600 dark:text-zinc-400">
                  <TrendingDown className="w-7 h-7 mr-2" />
                  {Math.abs(speedup)}% Slower
                </span>
              ) : (
                <span>Equal Execution Speed</span>
              )}
            </h2>

            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 pt-0.5">
              {comparison.correctnessVerified ? (
                <span className="inline-flex items-center text-black dark:text-white font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Semantic Correctness Verified (Outputs SHA-256 match)
                </span>
              ) : (
                <span className="inline-flex items-center text-zinc-500 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Output mismatch detected
                </span>
              )}
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06] text-right">
              <span className="text-[10px] uppercase font-mono text-zinc-400 block">
                Latency Delta
              </span>
              <span className="text-sm font-mono font-bold text-black dark:text-white">
                {traditional.benchmark.medianMs.toFixed(2)}ms → {llm.benchmark.medianMs.toFixed(2)}ms
              </span>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06] text-right">
              <span className="text-[10px] uppercase font-mono text-zinc-400 block">
                Binary Footprint
              </span>
              <span className="text-sm font-mono font-bold text-black dark:text-white">
                {comparison.codeSizeDeltaPercentage > 0 ? '-' : '+'}
                {Math.abs(comparison.codeSizeDeltaPercentage)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Apple Split Comparison Chart & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Latency Bar Chart */}
        <div className="p-6 rounded-3xl apple-glass shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                Multi-Iteration Latency
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Individual run measurements in milliseconds (lower is better)
              </p>
            </div>
            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="flex items-center text-zinc-500 dark:text-zinc-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-zinc-400 mr-1.5" />
                Baseline ({baselinePreset})
              </span>
              <span className="flex items-center text-black dark:text-white font-semibold">
                <span className="w-2.5 h-2.5 rounded-sm bg-black dark:bg-white mr-1.5" />
                LLM Guided
              </span>
            </div>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={runComparisonData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#888888" opacity={0.12} />
                <XAxis dataKey="run" tick={{ fontSize: 10, fill: '#888888' }} />
                <YAxis tick={{ fontSize: 10, fill: '#888888' }} unit="ms" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1C1C1E',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '11px',
                    color: '#FFFFFF',
                  }}
                  formatter={(val: any) => [`${Number(val).toFixed(3)} ms`]}
                />
                <Bar dataKey="traditional" fill="#71717A" name="Traditional Baseline" radius={[4, 4, 0, 0]} />
                <Bar dataKey="llm" fill="#D4D4D8" name="LLM-Assisted" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Applied Pass Chain & Rationale */}
        <div className="p-6 rounded-3xl apple-glass shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.06] pb-2.5">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-black dark:text-white" />
                <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  AI Synthesized Pass Order
                </h3>
              </div>
              <button
                onClick={onViewIR}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-xl apple-glass-pill text-xs font-medium text-black dark:text-white cursor-pointer"
              >
                <FileCode className="w-3 h-3 mr-1" />
                <span>Inspect IR Diff</span>
              </button>
            </div>

            {/* Passes Sequence Pills */}
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
              {result.passesApplied.map((pass, idx, arr) => (
                <React.Fragment key={idx}>
                  <span className="px-2.5 py-1 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-[11px]">
                    -{pass}
                  </span>
                  {idx < arr.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-zinc-400" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* AI Scientific Rationale */}
            <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05] text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              <span className="font-mono text-[10px] uppercase text-zinc-400 block mb-1">
                Optimization Rationale ({llm.model}):
              </span>
              <p>{llm.rationale}</p>
            </div>
          </div>

          {/* Hardware isolation line */}
          <div className="pt-2 border-t border-black/[0.04] dark:border-white/[0.05] flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>Clang 14.0.6 (x86_64)</span>
            <span>SHA: {traditional.benchmark.outputHash}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
