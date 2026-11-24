import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  Upload,
  Copy,
  Check,
  Sparkles,
  ChevronDown,
  Sliders,
  Trash2,
  FileCode,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { Language, CodeSample } from '../types';
import { CODE_SAMPLES } from '../data/samples';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  programName: string;
  setProgramName: (name: string) => void;
  baselinePreset: string;
  setBaselinePreset: (preset: string) => void;
  iterations: number;
  setIterations: (n: number) => void;
  customPrompt: string;
  setCustomPrompt: (prompt: string) => void;
  isManualPassMode: boolean;
  setIsManualPassMode: (val: boolean) => void;
  manualPasses: string[];
  setManualPasses: (passes: string[]) => void;
  onRunBenchmark: () => void;
  isRunning: boolean;
  benchmarkStep?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  setCode,
  language,
  setLanguage,
  programName,
  setProgramName,
  baselinePreset,
  setBaselinePreset,
  iterations,
  setIterations,
  customPrompt,
  setCustomPrompt,
  isManualPassMode,
  setIsManualPassMode,
  manualPasses,
  setManualPasses,
  onRunBenchmark,
  isRunning,
  benchmarkStep,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [showConfigDrawer, setShowConfigDrawer] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Cmd+Enter / Ctrl+Enter to trigger comparison
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isRunning && code.trim()) {
          onRunBenchmark();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, code, onRunBenchmark]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const isCpp = fileName.endsWith('.cpp') || fileName.endsWith('.cc') || fileName.endsWith('.h');
    setLanguage(isCpp ? 'cpp' : 'c');
    setProgramName(fileName.replace(/\.[^/.]+$/, ''));

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setCode(text);
      }
    };
    reader.readAsText(file);
  };

  const handleSampleSelect = (sampleId: string) => {
    const sample = CODE_SAMPLES.find((s) => s.id === sampleId);
    if (!sample) return;
    setCode(sample.code);
    setLanguage(sample.language);
    setProgramName(sample.title);
  };

  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 10) }, (_, i) => i + 1);

  return (
    <div className="w-full rounded-3xl apple-glass overflow-hidden transition-all shadow-sm">
      {/* Apple Developer Minimalist Toolbar */}
      <div className="px-3 sm:px-4 py-2.5 border-b border-black/[0.05] dark:border-white/[0.06] flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 bg-white/40 dark:bg-black/20">
        {/* Left: Sample Selector & Language */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Sample Selector */}
          <div className="relative">
            <select
              onChange={(e) => handleSampleSelect(e.target.value)}
              defaultValue="matrix-mult"
              className="appearance-none text-xs font-medium pl-3 pr-7 py-1.5 rounded-xl apple-glass-pill text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none cursor-pointer"
            >
              <option disabled value="">Choose a sample program...</option>
              {CODE_SAMPLES.map((sample) => (
                <option key={sample.id} value={sample.id} className="bg-white dark:bg-zinc-900">
                  {sample.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Language Switcher */}
          <div className="flex items-center p-0.5 rounded-xl apple-glass-pill text-xs">
            <button
              onClick={() => setLanguage('c')}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all cursor-pointer ${
                language === 'c'
                  ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400'
              }`}
            >
              C
            </button>
            <button
              onClick={() => setLanguage('cpp')}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all cursor-pointer ${
                language === 'cpp'
                  ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400'
              }`}
            >
              C++
            </button>
          </div>

          {/* Baseline preset pill */}
          <div className="flex items-center space-x-1 text-xs">
            <select
              value={baselinePreset}
              onChange={(e) => setBaselinePreset(e.target.value)}
              className="appearance-none text-xs font-mono font-medium px-2.5 py-1.5 rounded-xl apple-glass-pill text-[#1D1D1F] dark:text-[#F5F5F7] cursor-pointer"
            >
              <option value="-O2" className="bg-white dark:bg-zinc-900">Standard: -O2 (Default)</option>
              <option value="-O3" className="bg-white dark:bg-zinc-900">Standard: -O3 (Aggressive)</option>
              <option value="-Oz" className="bg-white dark:bg-zinc-900">Standard: -Oz (Small Size)</option>
              <option value="-O1" className="bg-white dark:bg-zinc-900">Standard: -O1 (Light)</option>
            </select>
          </div>
        </div>

        {/* Right: Mode Switcher, Config, Actions, Run Button */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          {/* Optimization Mode Toggle */}
          <div className="flex items-center p-0.5 rounded-xl apple-glass-pill text-xs">
            <button
              onClick={() => setIsManualPassMode(false)}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                !isManualPassMode
                  ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm font-semibold'
                  : 'text-zinc-500 dark:text-zinc-400'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>AI Guided</span>
            </button>
            <button
              onClick={() => {
                setIsManualPassMode(true);
                setShowConfigDrawer(true);
              }}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                isManualPassMode
                  ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm font-semibold'
                  : 'text-zinc-500 dark:text-zinc-400'
              }`}
            >
              <Sliders className="w-3 h-3" />
              <span>Manual Tools ({manualPasses.length})</span>
            </button>
          </div>

          {/* Toggle Pass / Directive Drawer */}
          <button
            onClick={() => setShowConfigDrawer(!showConfigDrawer)}
            className={`p-1.5 rounded-xl apple-glass-pill text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-all cursor-pointer ${
              showConfigDrawer ? 'ring-1 ring-black/20 dark:ring-white/30' : ''
            }`}
            title="Customize AI instructions or pick speedup tools manually"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>

          {/* Upload File */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".c,.cpp,.cc,.h"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Import source file"
            className="p-1.5 rounded-xl apple-glass-pill text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>

          {/* Copy Code */}
          <button
            onClick={handleCopy}
            title="Copy code"
            className="p-1.5 rounded-xl apple-glass-pill text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-black dark:text-white" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Clear Code */}
          <button
            onClick={() => {
              setCode('');
              setProgramName('Untitled Benchmark');
            }}
            title="Clear editor"
            className="p-1.5 rounded-xl apple-glass-pill text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Primary Action: Apple Run Comparison Button */}
          <button
            onClick={onRunBenchmark}
            disabled={isRunning || !code.trim()}
            className={`w-full sm:w-auto justify-center flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs font-bold tracking-tight shadow-md transition-all cursor-pointer ${
              isRunning || !code.trim()
                ? 'opacity-50 cursor-not-allowed bg-zinc-300 dark:bg-zinc-800 text-zinc-500'
                : 'bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-95 shadow-sm'
            }`}
          >
            {isRunning ? (
              <>
                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
                <span>{benchmarkStep || 'Running...'}</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Run Comparison</span>
                <span className="hidden sm:inline text-[10px] font-mono opacity-60 ml-0.5">⌘↵</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Optional Minimalist Configuration Drawer (Passes & Directives) */}
      {showConfigDrawer && (
        <div className="px-5 py-3.5 border-b border-black/[0.05] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02] space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
              {isManualPassMode ? 'Pick Speedup Tools Manually' : 'Custom Instructions for AI'}
            </span>
            <button
              onClick={() => setShowConfigDrawer(false)}
              title="Close options"
              className="text-zinc-500 hover:text-black dark:hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {!isManualPassMode ? (
            <div className="flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Optional hint for the AI (e.g. Prioritize faster loops or smaller file size)..."
                className="w-full text-xs bg-transparent border-b border-black/10 dark:border-white/10 pb-1 focus:outline-none text-[#1D1D1F] dark:text-[#F5F5F7] placeholder:text-zinc-500"
              />
              {customPrompt && (
                <button onClick={() => setCustomPrompt('')} className="text-[10px] text-zinc-500 hover:text-black dark:hover:text-white">
                  Clear
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
                <span className="text-[10px] uppercase text-zinc-600 dark:text-zinc-400 mr-1">Selected Tools:</span>
                {[
                  'mem2reg', 'sroa', 'instcombine', 'simplifycfg', 'early-cse',
                  'loop-rotate', 'licm', 'loop-unroll', 'loop-vectorize', 'slp-vectorizer',
                  'dce', 'adce', 'inline', 'tailcallelim', 'jump-threading'
                ].map((p) => {
                  const isActive = manualPasses.includes(p);
                  return (
                    <button
                      key={p}
                      onClick={() => {
                        if (isActive) {
                          setManualPasses(manualPasses.filter((x) => x !== p));
                        } else {
                          setManualPasses([...manualPasses, p]);
                        }
                      }}
                      className={`px-2 py-0.5 rounded-lg text-[10px] transition-all cursor-pointer ${
                        isActive
                          ? 'bg-black dark:bg-white text-white dark:text-black font-semibold'
                          : 'apple-glass-pill text-zinc-500 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      -{p}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Code Editor Body */}
      <div className="relative flex font-mono text-xs overflow-hidden h-[300px]">
        {/* Line Numbers Gutter */}
        <div className="select-none py-3 pl-2 sm:pl-3 pr-2 w-9 sm:w-11 text-right bg-black/[0.02] dark:bg-black/[0.3] border-r border-black/[0.04] dark:border-white/[0.05] text-zinc-400/60 overflow-hidden shrink-0">
          {lineNumbers.map((num) => (
            <div key={num} className="leading-6 h-6">
              {num}
            </div>
          ))}
        </div>

        {/* Textarea code area */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="flex-1 w-full h-full p-3 bg-transparent resize-none leading-6 focus:outline-none text-[#1D1D1F] dark:text-[#F5F5F7] selection:bg-black/10 dark:selection:bg-white/20 whitespace-pre overflow-auto font-mono text-[12.5px]"
          placeholder="// Paste C or C++ source code here..."
        />
      </div>

      {/* Editor Status Bar */}
      <div className="px-3 sm:px-4 py-1.5 border-t border-black/[0.04] dark:border-white/[0.05] bg-black/[0.01] dark:bg-white/[0.01] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center space-x-3">
          <span>{lineCount} lines</span>
          <span>•</span>
          <span>Compiler: Standard C / C++</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>{language === 'cpp' ? 'C++17' : 'C99 / C11'}</span>
          <span>•</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
};
