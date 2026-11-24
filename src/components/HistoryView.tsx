import React from 'react';
import {
  Clock,
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
      <div className="w-full py-16 text-center space-y-4 p-8 sm:p-12 editorial-card max-w-2xl mx-auto animate-editorial-in">
        <div className="w-12 h-12 rounded-full bg-[#F0EEE6] border-2 border-[#D9D6CA] flex items-center justify-center mx-auto text-[#B5532F]">
          <Clock className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#141413]">
          No test runs yet
        </h3>
        <p className="text-sm text-[#5E5D57] max-w-md mx-auto leading-relaxed">
          Run a speed comparison in the Compilers tab. Completed runs appear here so you can inspect or replay them anytime.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 animate-editorial-in">
      <div className="border-b-2 border-[#D9D6CA] pb-6 space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#B5532F] block">
          Saved Results
        </span>
        <h2 className="font-serif-display text-4xl sm:text-5xl text-[#141413]">
          Past test runs ({history.length})
        </h2>
        <p className="text-sm sm:text-base text-[#5E5D57]">
          Compare previous benchmarks or reload any program back into the lab.
        </p>
      </div>

      {/* History Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {history.map((item) => {
          const isFaster = item.speedupPercentage > 0;
          const isSlower = item.speedupPercentage < 0;

          return (
            <div
              key={item.id}
              className="p-5 sm:p-6 editorial-card editorial-card-lift flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Column */}
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h4 className="font-serif text-xl font-medium text-[#141413]">
                    {item.programName}
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-[#F0EEE6] border border-[#D9D6CA] text-[#B5532F]">
                    {item.language.toUpperCase()}
                  </span>
                  <span className="text-[11px] font-mono text-[#5E5D57]">
                    {new Date(item.timestamp).toLocaleString(undefined, {
                      dateStyle: 'short',
                      timeStyle: 'medium',
                    })}
                  </span>
                </div>

                {/* Pass Sequence Pills */}
                <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10.5px]">
                  <span className="text-[#5E5D57] mr-1">Tools:</span>
                  {item.recommendedPasses.slice(0, 6).map((p, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full bg-[#F0EEE6] border border-[#D9D6CA] text-[#B5532F] font-semibold"
                    >
                      -{p}
                    </span>
                  ))}
                  {item.recommendedPasses.length > 6 && (
                    <span className="text-[#5E5D57]">
                      +{item.recommendedPasses.length - 6} more
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#5E5D57]">
                  <span>
                    Baseline: <strong className="font-mono text-[#141413]">{item.baselinePreset}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Runs: <strong className="font-mono text-[#141413]">{item.iterations}</strong>
                  </span>
                  <span>•</span>
                  {item.correctnessVerified ? (
                    <span className="text-[#141413] flex items-center text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#B5532F]" />
                      Output Verified
                    </span>
                  ) : (
                    <span className="text-[#B5532F] flex items-center text-xs font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                      Output Mismatch
                    </span>
                  )}
                </div>
              </div>

              {/* Right Column: Metrics & Actions */}
              <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t-2 md:border-t-0 border-[#D9D6CA] shrink-0">
                <div className="text-left md:text-right">
                  <div className="flex items-center md:justify-end space-x-1">
                    {isFaster ? (
                      <span className="font-serif text-2xl font-medium text-[#B5532F] tabular-nums flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +{Math.abs(item.speedupPercentage)}%
                      </span>
                    ) : isSlower ? (
                      <span className="font-serif text-2xl font-medium text-[#5E5D57] tabular-nums flex items-center">
                        <TrendingDown className="w-4 h-4 mr-1" />
                        -{Math.abs(item.speedupPercentage)}%
                      </span>
                    ) : (
                      <span className="font-serif text-2xl font-medium text-[#5E5D57] tabular-nums">0.0%</span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-[#5E5D57] block tabular-nums">
                    {item.traditionalMetrics.executionTimeMs.toFixed(2)}ms → {item.llmMetrics.executionTimeMs.toFixed(2)}ms
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onReloadToWorkspace(item)}
                    title="Load this code back into the editor"
                    className="p-2.5 rounded-full border-2 border-[#141413] bg-transparent text-[#141413] hover:bg-[#F0EEE6] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onSelectRun(item)}
                    title="View full test results"
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-[#D97757] text-[#141413] hover:opacity-90 transition-opacity cursor-pointer"
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
