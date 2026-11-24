import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  FileCode,
  ChevronDown,
  ChevronUp
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
  onViewIR,
}) => {
  const [showRationale, setShowRationale] = useState<boolean>(false);
  const { traditional, llm, comparison, programName, iterations, baselinePreset } = result;

  const speedup = comparison.speedupPercentage;
  const isFaster = speedup > 0;
  const isSlower = speedup < 0;

  const runComparisonData = (traditional.benchmark?.individualRuns || []).map((tradRun, idx) => {
    const llmRun = llm.benchmark?.individualRuns?.[idx];
    return {
      run: `Run ${idx + 1}`,
      traditional: tradRun.durationMs,
      llm: llmRun ? llmRun.durationMs : 0,
    };
  });

  return (
    <div className="w-full space-y-6 animate-editorial-in">
      {/* 1. Near-Black Verdict Band with Big Coral Hook Number */}
      <div className="p-6 sm:p-8 rounded-[24px] bg-[#141413] text-[#FAF9F5] space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#D97757] block">
              Speed Test Summary • {programName} • {iterations} Runs
            </span>

            <h2 className="font-serif-display text-3xl sm:text-5xl text-[#D97757] tabular-nums">
              {isFaster
                ? `+${Math.abs(speedup)}% Faster`
                : isSlower
                ? `${Math.abs(speedup)}% Slower`
                : 'Equal Run Speed'}
            </h2>

            <p className="text-xs sm:text-sm text-[#C9C6BA] flex items-center gap-2 pt-0.5">
              {comparison.correctnessVerified ? (
                <span className="inline-flex items-center text-[#FAF9F5]">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-[#D97757] shrink-0" />
                  100% Verified Correct — identical program output
                </span>
              ) : (
                <span className="inline-flex items-center text-[#D97757]">
                  <AlertTriangle className="w-4 h-4 mr-1.5 shrink-0" />
                  Output mismatch detected
                </span>
              )}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:flex items-center gap-3 w-full md:w-auto">
            <div className="px-4 py-3 rounded-[18px] bg-[#FAF9F5] text-[#141413] text-left sm:text-right">
              <span className="text-[10px] uppercase font-semibold tracking-[0.08em] text-[#B5532F] block">
                Run Speed Change
              </span>
              <span className="text-sm font-mono font-semibold text-[#141413] tabular-nums">
                {traditional.benchmark.medianMs.toFixed(2)}ms → {llm.benchmark.medianMs.toFixed(2)}ms
              </span>
            </div>

            <div className="px-4 py-3 rounded-[18px] bg-[#FAF9F5] text-[#141413] text-left sm:text-right">
              <span className="text-[10px] uppercase font-semibold tracking-[0.08em] text-[#B5532F] block">
                File Size Change
              </span>
              <span className="text-sm font-mono font-semibold text-[#141413] tabular-nums">
                {comparison.codeSizeDeltaPercentage > 0 ? '-' : '+'}
                {Math.abs(comparison.codeSizeDeltaPercentage)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Split Chart & Tools Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latency Bar Chart */}
        <div className="p-6 editorial-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-serif text-xl font-medium text-[#141413]">
                Speed Across Test Runs
              </h3>
              <p className="text-xs text-[#5E5D57]">
                Time per run in milliseconds (shorter bar is faster)
              </p>
            </div>
            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="flex items-center text-[#5E5D57]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5E5D57] mr-1.5" />
                Standard ({baselinePreset})
              </span>
              <span className="flex items-center text-[#141413] font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D97757] mr-1.5" />
                AI Guided
              </span>
            </div>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={runComparisonData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D9D6CA" />
                <XAxis dataKey="run" tick={{ fontSize: 10, fill: '#5E5D57' }} />
                <YAxis tick={{ fontSize: 10, fill: '#5E5D57' }} unit="ms" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141413',
                    borderRadius: '14px',
                    border: '2px solid #D97757',
                    fontSize: '11px',
                    color: '#FAF9F5',
                  }}
                  formatter={(val: any) => [`${Number(val).toFixed(3)} ms`]}
                />
                <Bar dataKey="traditional" fill="#5E5D57" name="Standard Compiler" radius={[6, 6, 0, 0]} />
                <Bar dataKey="llm" fill="#D97757" name="AI-Assisted" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Applied Pass Chain & Expandable Rationale */}
        <div className="p-6 editorial-card space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#D9D6CA] pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#B5532F] shrink-0" />
                <h3 className="font-serif text-xl font-medium text-[#141413]">
                  Speedup Tools Chosen
                </h3>
              </div>
              <button
                onClick={onViewIR}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border-2 border-[#141413] text-xs font-semibold text-[#141413] hover:bg-[#F0EEE6] transition-colors cursor-pointer"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Inspect Blueprints</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
              {result.passesApplied.map((pass, idx, arr) => (
                <React.Fragment key={idx}>
                  <span className="px-2.5 py-1 rounded-full bg-[#F0EEE6] border border-[#D9D6CA] text-[#B5532F] font-semibold text-[11px]">
                    -{pass}
                  </span>
                  {idx < arr.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-[#5E5D57]" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Accordion for Rationale */}
            <div className="rounded-[18px] bg-[#F0EEE6] border-2 border-[#D9D6CA] overflow-hidden">
              <button
                onClick={() => setShowRationale(!showRationale)}
                className="w-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-[#141413] cursor-pointer"
              >
                <span className="uppercase tracking-[0.08em] text-[#B5532F] text-[11px]">
                  Why the AI chose these tools
                </span>
                {showRationale ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showRationale && (
                <div className="px-4 pb-3.5 text-xs sm:text-sm text-[#5E5D57] leading-relaxed border-t border-[#D9D6CA] pt-2.5">
                  {llm.rationale}
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t-2 border-[#D9D6CA] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#5E5D57]">
            <span>Standard 64-bit Compiler</span>
            <span>
              Output Match ID:{' '}
              <strong className="text-[#B5532F]">{traditional.benchmark.outputHash}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
