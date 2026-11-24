import React, { useState } from 'react';
import { X, Settings, Cpu } from 'lucide-react';
import { SystemStatus } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  systemStatus: SystemStatus | null;
  iterations: number;
  setIterations: (it: number) => void;
  baselinePreset: string;
  setBaselinePreset: (preset: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  systemStatus,
  iterations,
  setIterations,
  baselinePreset,
  setBaselinePreset,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const supportedPasses = systemStatus?.supportedPasses || [];
  const filteredPasses = supportedPasses.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#141413]/55">
      <div className="relative w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] rounded-[24px] bg-[#FAF9F5] border-2 border-[#D9D6CA] flex flex-col overflow-hidden text-xs">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b-2 border-[#D9D6CA] bg-[#F0EEE6] flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#FAF9F5] border-2 border-[#D9D6CA] flex items-center justify-center shrink-0">
              <Settings className="w-4 h-4 text-[#B5532F]" />
            </div>
            <div className="min-w-0">
              <h3 className="font-serif text-lg font-medium text-[#141413] tracking-tight">
                Test & Compiler Settings
              </h3>
              <p className="text-[11px] text-[#5E5D57]">
                Adjust repeat runs, baseline preset, and inspect available speedup tools
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            title="Close settings"
            className="w-8 h-8 rounded-full bg-[#FAF9F5] border-2 border-[#D9D6CA] flex items-center justify-center text-[#141413] hover:border-[#141413] cursor-pointer transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto bg-[#FAF9F5]">
          {/* System Environment */}
          <div className="p-4 rounded-[18px] bg-[#F0EEE6] border-2 border-[#D9D6CA] space-y-3">
            <span className="font-semibold text-[11px] uppercase tracking-[0.08em] text-[#B5532F] flex items-center">
              <Cpu className="w-3.5 h-3.5 mr-2" />
              System & Test Environment
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div>
                <span className="text-[10px] uppercase tracking-[0.06em] text-[#5E5D57] block mb-0.5">Code Compiler</span>
                <span className="text-[#141413] font-semibold">
                  {systemStatus?.llvmVersion || 'Ready'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.06em] text-[#5E5D57] block mb-0.5">Opt Engine</span>
                <span className="text-[#141413] font-semibold">Installed & Ready</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.06em] text-[#5E5D57] block mb-0.5">AI Assistant</span>
                <span className="text-[#141413] font-semibold">Smart Selector</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.06em] text-[#5E5D57] block mb-0.5">Processor</span>
                <span className="text-[#141413] font-semibold">
                  {systemStatus?.arch || 'x64'} ({systemStatus?.cpus || 4} cores)
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.06em] text-[#5E5D57] block mb-0.5">Environment</span>
                <span className="text-[#141413] font-semibold">Linux (Isolated)</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.06em] text-[#5E5D57] block mb-0.5">Precision</span>
                <span className="text-[#141413] font-semibold">High-res timer</span>
              </div>
            </div>
          </div>

          {/* Benchmark Execution Parameters */}
          <div className="space-y-4">
            <h4 className="font-semibold text-[11px] text-[#B5532F] uppercase tracking-[0.08em]">
              Speed Test Settings
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#141413] mb-1.5">
                  Benchmark Test Runs
                </label>
                <select
                  value={iterations}
                  onChange={(e) => setIterations(Number(e.target.value))}
                  className="w-full text-xs font-mono px-3.5 py-2.5 rounded-full bg-[#F0EEE6] border-2 border-[#D9D6CA] text-[#141413] focus:outline-none focus:border-[#141413]"
                >
                  <option value={3}>3 runs (Quick test)</option>
                  <option value={5}>5 runs (Recommended)</option>
                  <option value={10}>10 runs (High accuracy)</option>
                  <option value={15}>15 runs (Scientific)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141413] mb-1.5">
                  Comparison Baseline
                </label>
                <select
                  value={baselinePreset}
                  onChange={(e) => setBaselinePreset(e.target.value)}
                  className="w-full text-xs font-mono px-3.5 py-2.5 rounded-full bg-[#F0EEE6] border-2 border-[#D9D6CA] text-[#141413] focus:outline-none focus:border-[#141413]"
                >
                  <option value="-O2">-O2 (Standard default)</option>
                  <option value="-O3">-O3 (Maximum speed)</option>
                  <option value="-Os">-Os (Smaller file size)</option>
                  <option value="-Oz">-Oz (Smallest file size)</option>
                  <option value="-O1">-O1 (Light basic cleanup)</option>
                  <option value="-O0">-O0 (No optimization)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Approved Speedup Tools */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <h4 className="font-semibold text-[11px] text-[#B5532F] uppercase tracking-[0.08em]">
                  Approved Speedup Tools ({supportedPasses.length})
                </h4>
                <p className="text-[11px] text-[#5E5D57]">
                  Every tool the AI picks is verified against this allowlist
                </p>
              </div>
              <input
                type="text"
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-44 px-3.5 py-1.5 text-xs rounded-full bg-[#F0EEE6] border-2 border-[#D9D6CA] text-[#141413] placeholder:text-[#5E5D57] focus:outline-none focus:border-[#141413]"
              />
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {filteredPasses.map((p) => (
                <div
                  key={p.name}
                  className="px-3.5 py-2.5 rounded-[16px] bg-[#F0EEE6] border border-[#D9D6CA] flex flex-col sm:flex-row sm:items-baseline justify-between gap-1"
                >
                  <span className="font-mono font-semibold text-[#B5532F] text-[11px] shrink-0">
                    -{p.name}
                  </span>
                  <span className="text-[11px] text-[#5E5D57] sm:text-right sm:ml-4">
                    {p.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3.5 border-t-2 border-[#D9D6CA] bg-[#F0EEE6] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full text-xs font-semibold bg-[#D97757] text-[#141413] hover:opacity-90 cursor-pointer transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
