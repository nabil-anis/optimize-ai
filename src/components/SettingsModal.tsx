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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[85vh] rounded-3xl apple-glass shadow-2xl flex flex-col overflow-hidden text-xs">
        {/* Header */}
        <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl apple-glass-pill flex items-center justify-center">
              <Settings className="w-4 h-4 text-zinc-700 dark:text-zinc-200" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white tracking-tight">
                Laboratory & Compiler Settings
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Configure benchmarking parameters, toolchain environment, and pass catalog
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full apple-glass-pill flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Toolchain Telemetry */}
          <div className="p-4 rounded-2xl apple-glass-pill space-y-3">
            <span className="font-semibold text-xs text-zinc-900 dark:text-white flex items-center">
              <Cpu className="w-4 h-4 mr-2 text-zinc-500 dark:text-zinc-400" />
              Backend Compiler & Hardware Environment
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-0.5">Clang Frontend</span>
                <span className="text-zinc-900 dark:text-white font-medium">
                  {systemStatus?.hasClang ? `LLVM ${systemStatus.llvmVersion}` : 'Checking...'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-0.5">LLVM Opt Engine</span>
                <span className="text-zinc-900 dark:text-white font-medium">Installed & Ready</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-0.5">AI Engine</span>
                <span className="text-zinc-900 dark:text-white font-medium">Gemini 3.8 Flash</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-0.5">Architecture</span>
                <span className="text-zinc-900 dark:text-white font-medium">
                  {systemStatus?.arch} ({systemStatus?.cpus} cores)
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-0.5">Host Platform</span>
                <span className="text-zinc-900 dark:text-white font-medium">Linux (Sandboxed)</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-0.5">Timer Precision</span>
                <span className="text-zinc-900 dark:text-white font-medium">Nanosecond hrtime</span>
              </div>
            </div>
          </div>

          {/* Benchmark Execution Parameters */}
          <div className="space-y-4">
            <h4 className="font-semibold text-xs text-zinc-900 dark:text-white uppercase tracking-wider">
              Benchmarking Parameters
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1.5">
                  Default Benchmark Iterations
                </label>
                <select
                  value={iterations}
                  onChange={(e) => setIterations(Number(e.target.value))}
                  className="w-full text-xs font-mono p-2.5 rounded-xl apple-glass-pill text-zinc-900 dark:text-white focus:outline-none"
                >
                  <option value={3}>3 runs</option>
                  <option value={5}>5 runs (Recommended for low variance)</option>
                  <option value={10}>10 runs (High statistical precision)</option>
                  <option value={15}>15 runs (Scientific evaluation)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1.5">
                  Baseline Optimization Preset
                </label>
                <select
                  value={baselinePreset}
                  onChange={(e) => setBaselinePreset(e.target.value)}
                  className="w-full text-xs font-mono p-2.5 rounded-xl apple-glass-pill text-zinc-900 dark:text-white focus:outline-none"
                >
                  <option value="-O2">-O2 (LLVM standard production preset)</option>
                  <option value="-O3">-O3 (Aggressive vectorization & unrolling)</option>
                  <option value="-Os">-Os (Size optimized)</option>
                  <option value="-Oz">-Oz (Aggressive size reduction)</option>
                  <option value="-O1">-O1 (Minimal optimization)</option>
                  <option value="-O0">-O0 (No optimization / unopt baseline)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Supported LLVM Passes Catalog */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-xs text-zinc-900 dark:text-white uppercase tracking-wider">
                  LLVM Pass Whitelist ({supportedPasses.length} Passes Available)
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  All LLM-suggested passes are validated against this catalog before execution in the sandbox
                </p>
              </div>
              <input
                type="text"
                placeholder="Search pass..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl apple-glass-pill text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none"
              />
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {filteredPasses.map((p) => (
                <div
                  key={p.name}
                  className="p-2.5 rounded-xl apple-glass-pill flex items-baseline justify-between"
                >
                  <span className="font-mono font-semibold text-zinc-900 dark:text-white text-[11px]">
                    -{p.name}
                  </span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 text-right ml-4">
                    {p.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-black/[0.06] dark:border-white/[0.08] flex justify-end">
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
