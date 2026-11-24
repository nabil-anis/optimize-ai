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
      <div className="border-b border-zinc-200 dark:border-white/[0.08] pb-3">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-400">
          Sample Programs
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-[#F5F5F7] mt-0.5">
          Ready-to-Test Code Samples
        </h2>
        <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 mt-0.5 font-medium">
          Pick any sample program below to see how a standard compiler compares against AI-guided optimization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {CODE_SAMPLES.map((sample) => (
          <div
            key={sample.id}
            className="p-4 sm:p-6 rounded-3xl apple-glass shadow-sm flex flex-col justify-between space-y-4 border border-zinc-200 dark:border-white/[0.08] transition-all"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-white/[0.1] text-zinc-900 dark:text-zinc-200">
                  {sample.category}
                </span>
                <span className="text-xs font-mono font-bold text-zinc-950 dark:text-white">
                  {sample.language.toUpperCase()}
                </span>
              </div>

              <h3 className="text-base font-bold text-zinc-950 dark:text-[#F5F5F7]">
                {sample.title}
              </h3>

              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                {sample.description}
              </p>

              <div className="pt-2 flex items-start space-x-1.5 text-[11px] font-mono text-zinc-800 dark:text-zinc-200">
                <Zap className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium break-words">Key AI Speedup Tools: {sample.targetOptimization}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-200 dark:border-white/[0.08] flex items-center justify-between">
              <button
                onClick={() => onSelectSample(sample, false)}
                className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                View Code
              </button>

              <button
                onClick={() => onSelectSample(sample, true)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Load & Race</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
