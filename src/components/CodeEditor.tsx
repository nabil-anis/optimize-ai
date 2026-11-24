import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Upload,
  Copy,
  Check,
  Sparkles,
  ChevronDown,
  Sliders,
  Trash2,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { Language } from '../types';
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
  setProgramName,
  baselinePreset,
  setBaselinePreset,
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
    <div className="w-full editorial-card overflow-hidden">
      {/* Toolbar */}
      <div className="px-4 sm:px-5 py-3 border-b-2 border-[#D9D6CA] flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-between gap-3 bg-[#F0EEE6]">
        {/* Left: Sample Selector & Language */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <select
              onChange={(e) => handleSampleSelect(e.target.value)}
              defaultValue="matrix-mult"
              className="appearance-none text-xs font-semibold pl-3.5 pr-8 py-1.5 rounded-full bg-[#FAF9F5] border-2 border-[#D9D6CA] text-[#141413] focus:outline-none focus:border-[#141413] cursor-pointer"
            >
              <option disabled value="">Choose a sample program...</option>
              {CODE_SAMPLES.map((sample) => (
                <option key={sample.id} value={sample.id}>
                  {sample.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#5E5D57] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="flex items-center p-0.5 rounded-full bg-[#FAF9F5] border-2 border-[#D9D6CA] text-xs">
            <button
              onClick={() => setLanguage('c')}
              className={`px-3 py-1 rounded-full font-mono text-[11px] font-semibold transition-colors cursor-pointer ${
                language === 'c'
                  ? 'bg-[#D97757] text-[#141413]'
                  : 'text-[#5E5D57] hover:text-[#141413]'
              }`}
            >
              C
            </button>
            <button
              onClick={() => setLanguage('cpp')}
              className={`px-3 py-1 rounded-full font-mono text-[11px] font-semibold transition-colors cursor-pointer ${
                language === 'cpp'
                  ? 'bg-[#D97757] text-[#141413]'
                  : 'text-[#5E5D57] hover:text-[#141413]'
              }`}
            >
              C++
            </button>
          </div>

          <div className="relative">
            <select
              value={baselinePreset}
              onChange={(e) => setBaselinePreset(e.target.value)}
              className="appearance-none text-xs font-mono font-semibold pl-3.5 pr-8 py-1.5 rounded-full bg-[#FAF9F5] border-2 border-[#D9D6CA] text-[#141413] focus:outline-none focus:border-[#141413] cursor-pointer"
            >
              <option value="-O2">Standard: -O2 (Default)</option>
              <option value="-O3">Standard: -O3 (Aggressive)</option>
              <option value="-Oz">Standard: -Oz (Small Size)</option>
              <option value="-O1">Standard: -O1 (Light)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#5E5D57] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Right: Mode Switcher, Config, Actions, Run Button */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          <div className="flex items-center p-0.5 rounded-full bg-[#FAF9F5] border-2 border-[#D9D6CA] text-xs">
            <button
              onClick={() => setIsManualPassMode(false)}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                !isManualPassMode
                  ? 'bg-[#D97757] text-[#141413]'
                  : 'text-[#5E5D57] hover:text-[#141413]'
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
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                isManualPassMode
                  ? 'bg-[#D97757] text-[#141413]'
                  : 'text-[#5E5D57] hover:text-[#141413]'
              }`}
            >
              <Sliders className="w-3 h-3" />
              <span>Manual Tools ({manualPasses.length})</span>
            </button>
          </div>

          <button
            onClick={() => setShowConfigDrawer(!showConfigDrawer)}
            className={`p-2 rounded-full border-2 text-[#141413] transition-colors cursor-pointer ${
              showConfigDrawer
                ? 'bg-[#D97757] border-[#141413]'
                : 'bg-[#FAF9F5] border-[#D9D6CA] hover:border-[#141413]'
            }`}
            title="Customize AI instructions or pick speedup tools manually"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>

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
            className="p-2 rounded-full bg-[#FAF9F5] border-2 border-[#D9D6CA] text-[#5E5D57] hover:text-[#141413] hover:border-[#141413] transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopy}
            title="Copy code"
            className="p-2 rounded-full bg-[#FAF9F5] border-2 border-[#D9D6CA] text-[#5E5D57] hover:text-[#141413] hover:border-[#141413] transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#B5532F]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => {
              setCode('');
              setProgramName('Untitled Benchmark');
            }}
            title="Clear editor"
            className="p-2 rounded-full bg-[#FAF9F5] border-2 border-[#D9D6CA] text-[#5E5D57] hover:text-[#141413] hover:border-[#141413] transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onRunBenchmark}
            disabled={isRunning || !code.trim()}
            className={`w-full sm:w-auto justify-center flex items-center space-x-1.5 px-5 py-2 rounded-full text-xs font-semibold transition-opacity cursor-pointer ${
              isRunning || !code.trim()
                ? 'opacity-50 cursor-not-allowed bg-[#D9D6CA] text-[#5E5D57]'
                : 'bg-[#D97757] text-[#141413] hover:opacity-90'
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
              </>
            )}
          </button>
        </div>
      </div>

      {/* Optional Configuration Drawer */}
      {showConfigDrawer && (
        <div className="px-5 py-4 border-b-2 border-[#D9D6CA] bg-[#F0EEE6]/60 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs uppercase tracking-[0.08em] text-[#B5532F]">
              {isManualPassMode ? 'Pick Speedup Tools Manually' : 'Custom Instructions for AI'}
            </span>
            <button
              onClick={() => setShowConfigDrawer(false)}
              title="Close options"
              className="text-[#5E5D57] hover:text-[#141413] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {!isManualPassMode ? (
            <div className="flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-[#B5532F] shrink-0" />
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Optional hint for the AI (e.g. Prioritize faster loops or smaller file size)..."
                className="w-full text-xs bg-transparent border-b-2 border-[#D9D6CA] focus:border-[#141413] pb-1.5 focus:outline-none text-[#141413] placeholder:text-[#5E5D57]"
              />
              {customPrompt && (
                <button onClick={() => setCustomPrompt('')} className="text-[11px] font-semibold text-[#B5532F] hover:underline cursor-pointer">
                  Clear
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
              <span className="text-[10px] font-sans uppercase font-semibold tracking-[0.08em] text-[#5E5D57] mr-1">
                Selected Tools:
              </span>
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
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#D97757] text-[#141413]'
                        : 'bg-[#FAF9F5] border border-[#D9D6CA] text-[#B5532F] hover:border-[#141413]'
                    }`}
                  >
                    -{p}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Code Editor Body */}
      <div className="relative flex font-mono text-xs overflow-hidden h-[300px] bg-[#FAF9F5]">
        <div className="select-none py-3 pl-2 sm:pl-3 pr-2.5 w-10 sm:w-12 text-right bg-[#F0EEE6] border-r-2 border-[#D9D6CA] text-[#5E5D57] overflow-hidden shrink-0">
          {lineNumbers.map((num) => (
            <div key={num} className="leading-6 h-6">
              {num}
            </div>
          ))}
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="flex-1 w-full h-full p-3 bg-transparent resize-none leading-6 focus:outline-none text-[#141413] selection:bg-[#D97757]/25 whitespace-pre overflow-auto font-mono text-[12.5px]"
          placeholder="// Paste C or C++ source code here..."
        />
      </div>

      {/* Editor Status Bar */}
      <div className="px-4 sm:px-5 py-2 border-t-2 border-[#D9D6CA] bg-[#F0EEE6] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#5E5D57]">
        <div className="flex items-center space-x-3">
          <span>{lineCount} lines</span>
          <span>•</span>
          <span>Compiler: Standard C / C++</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-[#B5532F]">{language === 'cpp' ? 'C++17' : 'C99 / C11'}</span>
          <span>•</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
};
