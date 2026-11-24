import React from 'react';
import {
  Clock,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RotateCcw
} from 'lucide-react';
import { BenchmarkHistoryItem } from '../types';

interface HistoryViewProps {
  history: BenchmarkHistoryItem[];
  onSelectRun: (record: BenchmarkHistoryItem) => void;
  onDeleteRun?: (id: string) => void;
  onClearHistory?: () => void;
  onReloadToWorkspace: (record: BenchmarkHistoryItem) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectRun,
  onReloadToWorkspace,
}) => {
  if (history.length === 0) {
    return (
      <div className="w-full py-16 text-center space-y-3 p-8 rounded-3xl apple-glass shadow-sm max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center mx-auto text-zinc-400">
          <Clock className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
          No Test History Yet
        </h3>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          Run a speed comparison in the Compilers tab. Every completed test will be saved here so you can review or re-run it anytime.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/[0.08] pb-3">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-400">
            Saved Results
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-[#F5F5F7] mt-0.5">
            Past Test Runs ({history.length})
          </h2>
        </div>
      </div>

      {/* History Cards List */}
      <div className="grid grid-cols-1 gap-3.5">
        {history.map((item) => {
          const isFaster = item.speedupPercentage > 0;
          const isSlower = item.speedupPercentage < 0;

          return (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-3xl apple-glass shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border border-zinc-200 dark:border-white/[0.08] transition-all"
            >
              {/* Left Column: Program info */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <h4 className="font-semibold text-sm text-[#1D1D1F] dark:text-[#F5F5F7]">
                    {item.programName}
                  </h4>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono uppercase bg-black/[0.04] dark:bg-white/[0.08] text-zinc-600 dark:text-zinc-300">
                    {item.language.toUpperCase()}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    {new Date(item.timestamp).toLocaleString(undefined, {
                      dateStyle: 'short',
                      timeStyle: 'medium',
                    })}
                  </span>
                </div>

                {/* Pass Sequence Pills */}
                <div className="flex flex-wrap items-center gap-1 font-mono text-[10px]">
                  <span className="text-zinc-600 dark:text-zinc-400 mr-1">AI Tools:</span>
                  {item.recommendedPasses.slice(0, 6).map((p, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.2 rounded-md bg-black/[0.04] dark:bg-white/[0.06] text-zinc-800 dark:text-zinc-300"
                    >
                      -{p}
                    </span>
                  ))}
                  {item.recommendedPasses.length > 6 && (
                    <span className="text-zinc-600 dark:text-zinc-400">
                      +{item.recommendedPasses.length - 6} more
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                  <span>
                    Baseline: <strong className="font-mono text-black dark:text-white">{item.baselinePreset}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Test Runs: <strong className="font-mono text-black dark:text-white">{item.iterations}</strong>
                  </span>
                  <span>•</span>
                  {item.correctnessVerified ? (
                    <span className="text-black dark:text-white flex items-center text-[11px] font-medium">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Output Verified
                    </span>
                  ) : (
                    <span className="text-zinc-600 dark:text-zinc-400 flex items-center text-[11px]">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Output Mismatch
                    </span>
                  )}
                </div>
              </div>

              {/* Right Column: Execution Metrics & Actions */}
              <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-white/[0.06] shrink-0">
                <div className="text-left md:text-right">
                  <div className="flex items-center md:justify-end space-x-1">
                    {isFaster ? (
                      <span className="text-black dark:text-white font-mono font-bold text-sm flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +{Math.abs(item.speedupPercentage)}%
                      </span>
                    ) : isSlower ? (
                      <span className="text-zinc-500 font-mono font-bold text-sm flex items-center">
                        <TrendingDown className="w-4 h-4 mr-1" />
                        -{Math.abs(item.speedupPercentage)}%
                      </span>
                    ) : (
                      <span className="text-zinc-400 font-mono text-sm">0.0%</span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 block">
                    {item.traditionalMetrics.executionTimeMs.toFixed(2)}ms → {item.llmMetrics.executionTimeMs.toFixed(2)}ms
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => onReloadToWorkspace(item)}
                    title="Load this code back into the editor"
                    className="p-2 rounded-xl apple-glass-pill text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onSelectRun(item)}
                    title="View full test results"
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-all cursor-pointer shadow-sm"
                  >
                    View Results
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
