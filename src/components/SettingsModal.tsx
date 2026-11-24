import React, { useState } from 'react';
import {
  X,
  Settings,
  Cpu,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Layers,
  Sliders,
  ExternalLink
} from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] rounded-3xl apple-glass shadow-2xl flex flex-col overflow-hidden text-xs">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 rounded-xl apple-glass-pill flex items-center justify-center shrink-0">
              <Settings className="w-4 h-4 text-zinc-700 dark:text-zinc-200" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white tracking-tight">
                Test & Compiler Settings
              </h3>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                Adjust how many times each test runs, the baseline setting, and view available speedup tools
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            title="Close settings"
            className="w-7 h-7 rounded-full apple-glass-pill flex items-center justify-center text-zinc-600 hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto">
          {/* System Environment */}
          <div className="p-4 rounded-2xl apple-glass-pill space-y-3">
            <span className="font-semibold text-xs text-zinc-900 dark:text-white flex items-center">
              <Cpu className="w-4 h-4 mr-2 text-zinc-600 dark:text-zinc-400" />
              System & Test Environment
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-0.5">Code Compiler</span>
                <span className="text-zinc-900 dark:text-white font-medium">
                  {systemStatus?.llvmVersion || 'Ready'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-0.5">Optimization Engine</span>
                <span className="text-zinc-900 dark:text-white font-medium">Installed & Ready</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-0.5">AI Assistant</span>
                <span className="text-zinc-900 dark:text-white font-medium">Smart Pass Selector</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-0.5">Processor</span>
                <span className="text-zinc-900 dark:text-white font-medium">
                  {systemStatus?.arch} ({systemStatus?.cpus} cores)
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-0.5">Environment</span>
                <span className="text-zinc-900 dark:text-white font-medium">Linux (Isolated)</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-0.5">Stopwatch Precision</span>
                <span className="text-zinc-900 dark:text-white font-medium">High-precision timer</span>
              </div>
            </div>
          </div>

          {/* Benchmark Execution Parameters */}
          <div className="space-y-4">
            <h4 className="font-semibold text-xs text-zinc-900 dark:text-white uppercase tracking-wider">
              Speed Test Settings
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-900 dark:text-zinc-200 mb-1.5">
                  Benchmark Test Runs
                </label>
                <select
                  value={iterations}
                  onChange={(e) => setIterations(Number(e.target.value))}
                  className="w-full text-xs font-mono p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                >
                  <option value={3} className="bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white">3 runs (Quick test)</option>
                  <option value={5} className="bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white">5 runs (Recommended for steady numbers)</option>
                  <option value={10} className="bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white">10 runs (High accuracy)</option>
                  <option value={15} className="bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white">15 runs (Scientific evaluation)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-900 dark:text-zinc-200 mb-1.5">
                  Comparison Baseline
                </label>
                <select
                  value={baselinePreset}
                  onChange={(e) => setBaselinePreset(e.target.value)}
                  className="w-full text-xs font-mono p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                >
                  <option value="-O2" className="bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white">-O2 (Standard default — runs 120+ checks)</option>
                  <option value="-O3" className="bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white">-O3 (Maximum speed — aggressive loop shortcuts)</option>
                  <option value="-Os" className="bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white">-Os (Smaller file size)</option>
                  <option value="-Oz" className="bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white">-Oz (Smallest possible file size)</option>
                  <option value="-O1" className="bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white">-O1 (Light basic cleanup)</option>
                  <option value="-O0" className="bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white">-O0 (No optimization — raw code)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Approved Speedup Tools */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <h4 className="font-semibold text-xs text-zinc-900 dark:text-white uppercase tracking-wider">
                  Approved Speedup Tools ({supportedPasses.length} Available)
                </h4>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                  Every tool the AI picks is checked against this safe list before running
                </p>
              </div>
              <input
                type="text"
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-44 px-3 py-1.5 text-xs rounded-xl apple-glass-pill text-zinc-900 dark:text-white placeholder:text-zinc-500 focus:outline-none"
              />
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {filteredPasses.map((p) => (
                <div
                  key={p.name}
                  className="p-2.5 rounded-xl apple-glass-pill flex flex-col sm:flex-row sm:items-baseline justify-between gap-1"
                >
                  <span className="font-mono font-semibold text-zinc-900 dark:text-white text-[11px] shrink-0">
                    -{p.name}
                  </span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 sm:text-right sm:ml-4">
                    {p.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3.5 border-t border-black/[0.06] dark:border-white/[0.08] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-black dark:bg-white text-white dark:text-black hover:opacity-90 cursor-pointer transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
