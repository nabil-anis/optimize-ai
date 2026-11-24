import React from 'react';
import { Zap, Play } from 'lucide-react';
import { CODE_SAMPLES } from '../data/samples';
import { CodeSample } from '../types';

interface BenchmarkPresetsViewProps {
  onSelectSample: (sample: CodeSample, autoRun?: boolean) => void;
}

export const BenchmarkPresetsView: React.FC<BenchmarkPresetsViewProps> = ({
  onSelectSample,
}) => {
  return (
    <div className="w-full space-y-10 animate-editorial-in">
      {/* Cream Editorial Header */}
      <div className="border-b-2 border-[#D9D6CA] pb-6 space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#B5532F] block">
          Sample Programs
        </span>
        <h2 className="font-serif-display text-4xl sm:text-5xl text-[#141413]">
          Pick a benchmark to race
        </h2>
        <p className="text-sm sm:text-base text-[#5E5D57] max-w-2xl">
          Load any C or C++ algorithm to test how standard optimization compares against AI-selected tools.
        </p>
      </div>

      {/* Preset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {CODE_SAMPLES.map((sample) => (
          <div
            key={sample.id}
            className="p-6 sm:p-7 editorial-card editorial-card-lift flex flex-col justify-between space-y-5"
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] px-3 py-1 rounded-full bg-[#F0EEE6] border border-[#D9D6CA] text-[#B5532F]">
                  {sample.category}
                </span>
                <span className="text-xs font-mono font-semibold text-[#141413]">
                  {sample.language.toUpperCase()}
                </span>
              </div>

              <h3 className="font-serif text-2xl font-medium text-[#141413]">
                {sample.title}
              </h3>

              <p className="text-sm text-[#5E5D57] leading-relaxed">
                {sample.description}
              </p>

              <div className="pt-2 flex items-start space-x-2 text-xs font-mono text-[#B5532F]">
                <Zap className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span className="font-semibold break-words">
                  Tools: {sample.targetOptimization}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-[#D9D6CA] flex items-center justify-between gap-3">
              <button
                onClick={() => onSelectSample(sample, false)}
                className="px-4 py-2 rounded-full border-2 border-[#141413] bg-transparent text-xs font-semibold text-[#141413] hover:bg-[#F0EEE6] transition-colors cursor-pointer"
              >
                View Code
              </button>

              <button
                onClick={() => onSelectSample(sample, true)}
                className="flex items-center space-x-1.5 px-5 py-2 rounded-full bg-[#D97757] text-[#141413] text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
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
