import React from 'react';
import {
  Layers,
  Zap,
  Play
} from 'lucide-react';
import { CODE_SAMPLES } from '../data/samples';
import { CodeSample } from '../types';

interface BenchmarkPresetsViewProps {
  onSelectSample: (sample: CodeSample, autoRun?: boolean) => void;
}

export const BenchmarkPresetsView: React.FC<BenchmarkPresetsViewProps> = ({
  onSelectSample,
}) => {
  return (
    <div className="w-full space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-black/[0.06] dark:border-white/[0.08] pb-3">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Curated Compiler Test Suites
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] mt-0.5">
          Benchmark Algorithm Presets
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
          Standard scientific, algorithmic, and compiler-stress benchmarks designed to evaluate pass ordering hypotheses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {CODE_SAMPLES.map((sample) => (
          <div
            key={sample.id}
            className="p-6 rounded-3xl apple-glass shadow-sm flex flex-col justify-between space-y-4 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-zinc-600 dark:text-zinc-300">
                  {sample.category}
                </span>
                <span className="text-xs font-mono font-semibold text-black dark:text-white">
                  {sample.language.toUpperCase()}
                </span>
              </div>

              <h3 className="text-base font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                {sample.title}
              </h3>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {sample.description}
              </p>

              <div className="pt-2 flex items-center space-x-1.5 text-[11px] font-mono text-zinc-700 dark:text-zinc-300">
                <Zap className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                <span>Target Passes: -{sample.targetOptimization}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between">
              <button
                onClick={() => onSelectSample(sample, false)}
                className="text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                Inspect Source Code
              </button>

              <button
                onClick={() => onSelectSample(sample, true)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Load & Benchmark</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
