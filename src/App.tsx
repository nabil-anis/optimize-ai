import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { ThreePipelineDiagram } from './components/ThreePipelineDiagram';
import { CodeEditor } from './components/CodeEditor';
import { CompilerCard } from './components/CompilerCard';
import { ResultsDashboard } from './components/ResultsDashboard';
import { IrViewerModal } from './components/IrViewerModal';
import { HistoryView } from './components/HistoryView';
import { TheoryView } from './components/TheoryView';
import { BenchmarkPresetsView } from './components/BenchmarkPresetsView';
import { SettingsModal } from './components/SettingsModal';
import { DualCompilerLabView } from './components/DualCompilerLabView';
import { CODE_SAMPLES } from './data/samples';
import {
  Language,
  ActiveTab,
  SystemStatus,
  BenchmarkResponse,
  BenchmarkHistoryItem,
  CodeSample
} from './types';
import {
  Box,
  Cpu,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export default function App() {
  // Theme state: Apple Dark Mode by default, persistent in localStorage
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('compiler_lab_theme');
    if (saved) return saved === 'dark';
    return true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('compiler_lab_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('compiler_lab_theme', 'light');
    }
  }, [isDark]);

  // Active navigation tab — default to the Dual Compilers Lab hero view!
  const [activeTab, setActiveTab] = useState<ActiveTab>('lab');

  // Studio layout sub-mode: allows viewing 3D pipeline + code side-by-side/stacked
  const [studioViewMode, setStudioViewMode] = useState<'with-3d' | 'compact'>('with-3d');

  // System status
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  // Editor states
  const [code, setCode] = useState<string>(CODE_SAMPLES[0].code);
  const [language, setLanguage] = useState<Language>(CODE_SAMPLES[0].language);
  const [programName, setProgramName] = useState<string>(CODE_SAMPLES[0].title);
  const [baselinePreset, setBaselinePreset] = useState<string>('-O2');
  const [iterations, setIterations] = useState<number>(5);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isManualPassMode, setIsManualPassMode] = useState<boolean>(false);
  const [manualPasses, setManualPasses] = useState<string[]>([
    'mem2reg',
    'loop-rotate',
    'licm',
    'loop-unroll',
    'loop-vectorize',
    'instcombine',
    'dce',
  ]);

  // Benchmark execution states
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [benchmarkStep, setBenchmarkStep] = useState<string>('');
  const [currentResult, setCurrentResult] = useState<BenchmarkResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // History state
  const [history, setHistory] = useState<BenchmarkHistoryItem[]>([]);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [irModal, setIrModal] = useState<{
    isOpen: boolean;
    traditionalIR: string;
    llmOptimizedIR: string;
    passesApplied: string[];
  }>({
    isOpen: false,
    traditionalIR: '',
    llmOptimizedIR: '',
    passesApplied: [],
  });

  // Fetch system status and history on load
  const loadSystemStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/system/status');
      if (res.ok) {
        const data = await res.json();
        setSystemStatus(data);
      }
    } catch {
      // Server will recover
    }
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch {
      // Server will recover
    }
  }, []);

  useEffect(() => {
    loadSystemStatus();
    loadHistory();
  }, [loadSystemStatus, loadHistory]);

  // Benchmark Execution Function (Live Backend compilation with Clang & opt)
  const handleRunBenchmark = async () => {
    if (isRunning || !code.trim()) return;

    setIsRunning(true);
    setErrorMessage(null);
    setBenchmarkStep('Validating source & AST...');

    try {
      setTimeout(() => {
        if (isRunning) setBenchmarkStep('Extracting unoptimized LLVM IR...');
      }, 300);

      setTimeout(() => {
        if (isRunning) setBenchmarkStep('Gemini 3.8 Flash analyzing IR structures...');
      }, 900);

      setTimeout(() => {
        if (isRunning) setBenchmarkStep('Applying LLVM opt transformation pipeline...');
      }, 2200);

      setTimeout(() => {
        if (isRunning) setBenchmarkStep('Executing nanosecond benchmark & hash verify...');
      }, 3200);

      const payload = {
        code,
        language,
        programName,
        baselinePreset,
        iterations,
        customPrompt: customPrompt.trim() || undefined,
        manualPasses: isManualPassMode ? manualPasses : undefined,
      };

      const res = await fetch('/api/benchmark/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Compilation or benchmark execution failed');
      }

      setCurrentResult(data);
      loadHistory();
    } catch (err: any) {
      setErrorMessage(err.message || 'Benchmark pipeline failed');
    } finally {
      setIsRunning(false);
      setBenchmarkStep('');
    }
  };

  const handleSelectSample = (sample: CodeSample, autoRun = false) => {
    setCode(sample.code);
    setLanguage(sample.language);
    setProgramName(sample.title);
    setActiveTab('lab');

    if (autoRun) {
      setTimeout(() => {
        handleRunBenchmark();
      }, 350);
    }
  };

  const handleOpenIRModal = () => {
    if (!currentResult) return;
    setIrModal({
      isOpen: true,
      traditionalIR: currentResult.traditional.irCode,
      llmOptimizedIR: currentResult.llm.irCode,
      passesApplied: currentResult.passesApplied,
    });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 relative selection:bg-black/10 dark:selection:bg-white/20 bg-[#F5F5F7] dark:bg-black text-[#1D1D1F] dark:text-[#F5F5F7]">
      {/* Subtle Apple ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-black/[0.02] dark:bg-white/[0.03] rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-black/[0.015] dark:bg-white/[0.02] rounded-full blur-3xl" />
      </div>

      {/* Apple Floating Glass Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        setIsDark={setIsDark}
        systemStatus={systemStatus}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main View Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* TAB 0: HERO LAB — PROBLEM, SOLUTION & DUAL COMPILERS SIDE-BY-SIDE */}
        {activeTab === 'lab' && (
          <DualCompilerLabView
            code={code}
            setCode={setCode}
            language={language}
            setLanguage={setLanguage}
            programName={programName}
            setProgramName={setProgramName}
            baselinePreset={baselinePreset}
            setBaselinePreset={setBaselinePreset}
            iterations={iterations}
            setIterations={setIterations}
            onRunBenchmark={handleRunBenchmark}
            isRunning={isRunning}
            benchmarkStep={benchmarkStep}
            currentResult={currentResult}
            systemStatus={systemStatus}
            onViewIR={handleOpenIRModal}
            onNavigateTo3D={() => setActiveTab('3d-pipeline')}
          />
        )}

        {/* TAB 1: LIVE 3D VISUAL PIPELINE (HERO EXPERIENCE) */}
        {activeTab === '3d-pipeline' && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-black/[0.06] dark:border-white/[0.08] pb-3">
              <div>
                <span className="text-xs uppercase font-mono tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">
                  Interactive Spatial Diagram
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
                  Live 3D Optimization Pipeline
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Real-time physical conveyor simulation of Clang frontend lowering and LLVM pass optimization.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('workspace')}
                  className="px-3.5 py-1.5 rounded-xl apple-glass-pill text-xs font-semibold text-black dark:text-white hover:opacity-90 transition-all cursor-pointer shadow-sm flex items-center space-x-1.5"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Open Studio</span>
                </button>

                <button
                  onClick={handleRunBenchmark}
                  disabled={isRunning}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center space-x-1.5 ${
                    isRunning
                      ? 'opacity-60 cursor-not-allowed bg-zinc-300 dark:bg-zinc-800 text-zinc-500'
                      : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-95'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Comparison ⌘↵</span>
                </button>
              </div>
            </div>

            {/* The Live Visual 3D Pipeline Diagram Canvas */}
            <ThreePipelineDiagram
              isDark={isDark}
              isRunning={isRunning}
              benchmarkStep={benchmarkStep}
              currentResult={currentResult}
              onRunBenchmark={handleRunBenchmark}
              programName={programName}
              onOpenStudio={() => setActiveTab('workspace')}
              heightClass="h-[740px]"
            />

            {/* Micro Feature Explanations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl apple-glass space-y-1">
                <span className="font-mono font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] text-[11px] block">
                  Conveyor A: Traditional LLVM (-O2)
                </span>
                <p className="text-zinc-500 dark:text-zinc-400 text-[11px] leading-relaxed">
                  Fixed static heuristics (~120 passes). Runs invariant sequence regardless of algorithm structure, leading to phase conflicts.
                </p>
              </div>

              <div className="p-4 rounded-2xl apple-glass space-y-1">
                <span className="font-mono font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] text-[11px] block flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Conveyor B: LLM Cognitive Core
                </span>
                <p className="text-zinc-500 dark:text-zinc-400 text-[11px] leading-relaxed">
                  Analyzes unoptimized IR SSA registers and loop trip counts, synthesizing an adaptive, minimal pass order.
                </p>
              </div>

              <div className="p-4 rounded-2xl apple-glass space-y-1">
                <span className="font-mono font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] text-[11px] block">
                  Live Spatial Raycasting
                </span>
                <p className="text-zinc-500 dark:text-zinc-400 text-[11px] leading-relaxed">
                  Click any 3D node or instruction packet to view technical inputs, outputs, and compiler phase ordering implications.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STUDIO (CODE EDITOR + 3D PIPELINE + COMPARISON CARDS) */}
        {activeTab === 'workspace' && (
          <div className="space-y-6">
            {/* Studio Header with View Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-black/[0.06] dark:border-white/[0.08] pb-3">
              <div>
                <span className="text-xs uppercase font-mono tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">
                  Benchmarking Laboratory
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
                  Compiler Studio
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Measure. Optimize. Compare.
                </p>
              </div>

              {/* Segmented layout switcher: With 3D Diagram vs Compact Code */}
              <div className="flex items-center space-x-1 p-1 rounded-xl apple-glass-pill text-xs">
                <button
                  onClick={() => setStudioViewMode('with-3d')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    studioViewMode === 'with-3d'
                      ? 'bg-black dark:bg-white text-white dark:text-black font-semibold shadow-sm'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Live 3D & Code</span>
                </button>

                <button
                  onClick={() => setStudioViewMode('compact')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    studioViewMode === 'compact'
                      ? 'bg-black dark:bg-white text-white dark:text-black font-semibold shadow-sm'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Focused Studio</span>
                </button>
              </div>
            </div>

            {/* Embedded Live 3D Pipeline Diagram (When in 'with-3d' mode) */}
            {studioViewMode === 'with-3d' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-500 dark:text-zinc-400 px-1">
                  <span className="flex items-center space-x-1.5 font-semibold text-black dark:text-white">
                    <Box className="w-3.5 h-3.5" />
                    <span>Live Physical Pipeline Diagram</span>
                  </span>
                  <button
                    onClick={() => setActiveTab('3d-pipeline')}
                    className="hover:text-black dark:hover:text-white hover:underline cursor-pointer"
                  >
                    Expand to Full 3D Canvas ↗
                  </button>
                </div>
                <ThreePipelineDiagram
                  isDark={isDark}
                  isRunning={isRunning}
                  benchmarkStep={benchmarkStep}
                  currentResult={currentResult}
                  onRunBenchmark={handleRunBenchmark}
                  programName={programName}
                  heightClass="h-[480px]"
                />
              </div>
            )}

            {/* Xcode-Style Minimalist Code Editor */}
            <CodeEditor
              code={code}
              setCode={setCode}
              language={language}
              setLanguage={setLanguage}
              programName={programName}
              setProgramName={setProgramName}
              baselinePreset={baselinePreset}
              setBaselinePreset={setBaselinePreset}
              iterations={iterations}
              setIterations={setIterations}
              customPrompt={customPrompt}
              setCustomPrompt={setCustomPrompt}
              isManualPassMode={isManualPassMode}
              setIsManualPassMode={setIsManualPassMode}
              manualPasses={manualPasses}
              setManualPasses={setManualPasses}
              onRunBenchmark={handleRunBenchmark}
              isRunning={isRunning}
              benchmarkStep={benchmarkStep}
            />

            {/* Error Banner if any */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs flex items-start space-x-3 shadow-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-zinc-400" />
                <div className="flex-1 space-y-1">
                  <span className="font-semibold block text-white">Pipeline Execution Error</span>
                  <pre className="font-mono text-[11px] whitespace-pre-wrap text-zinc-300">{errorMessage}</pre>
                </div>
              </div>
            )}

            {/* Side-by-Side Apple Compiler Comparison Cards */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
                  Compiler Optimization Comparison
                </h2>
                <span className="text-[11px] text-zinc-400">
                  Differential compilation results over {iterations} sample iterations
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* COMPILER A: Traditional Clang / LLVM */}
                <CompilerCard
                  type="traditional"
                  title="Traditional Compiler"
                  subtitle="Standard LLVM Heuristics"
                  badge="BASELINE"
                  presetOrModel={`Clang ${baselinePreset}`}
                  status={
                    isRunning
                      ? 'running'
                      : currentResult
                      ? 'completed'
                      : 'idle'
                  }
                  data={currentResult?.traditional}
                  onViewIR={handleOpenIRModal}
                  isRunning={isRunning}
                  onNavigateTo3D={() => setActiveTab('3d-pipeline')}
                />

                {/* COMPILER B: LLM-Assisted Compiler */}
                <CompilerCard
                  type="llm"
                  title="LLM-Assisted Compiler"
                  subtitle="AI-Guided LLVM Optimization"
                  badge={isManualPassMode ? 'CUSTOM PASSES' : 'AI OPTIMIZED'}
                  presetOrModel={isManualPassMode ? `${manualPasses.length} LLVM Passes` : 'Gemini 3.8 Flash + opt'}
                  status={
                    isRunning
                      ? 'running'
                      : currentResult
                      ? 'completed'
                      : 'idle'
                  }
                  data={currentResult?.llm}
                  onViewIR={handleOpenIRModal}
                  isRunning={isRunning}
                  onNavigateTo3D={() => setActiveTab('3d-pipeline')}
                />
              </div>
            </div>

            {/* Executive Results Dashboard */}
            {currentResult && (
              <div className="pt-2">
                <ResultsDashboard
                  result={currentResult}
                  systemStatus={systemStatus}
                  onViewIR={handleOpenIRModal}
                />
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CURATED BENCHMARK PRESETS */}
        {activeTab === 'benchmarks' && (
          <BenchmarkPresetsView onSelectSample={handleSelectSample} />
        )}

        {/* TAB 4: BENCHMARK HISTORY */}
        {activeTab === 'history' && (
          <HistoryView
            history={history}
            onSelectRun={(record) => {
              setCurrentResult({
                success: true,
                recordId: record.id,
                timestamp: record.timestamp,
                programName: record.programName,
                language: record.language,
                baselinePreset: record.baselinePreset,
                passesApplied: record.recommendedPasses,
                iterations: record.iterations,
                traditional: {
                  compilationTimeMs: record.traditionalMetrics.compilationTimeMs,
                  optimizationTimeMs: record.traditionalMetrics.optimizationTimeMs,
                  binarySizeBytes: record.traditionalMetrics.binarySizeBytes,
                  irLineCount: record.traditionalMetrics.irLineCount,
                  benchmark: {
                    iterations: record.iterations,
                    medianMs: record.traditionalMetrics.executionTimeMs,
                    meanMs: record.traditionalMetrics.executionTimeMs,
                    minMs: record.traditionalMetrics.executionTimeMs,
                    maxMs: record.traditionalMetrics.executionTimeMs,
                    stdDevMs: 0,
                    individualRuns: [],
                    outputHash: record.traditionalMetrics.outputHash,
                    sampleStdout: '',
                    exitCode: 0,
                    timedOut: false,
                  },
                  irCode: record.traditionalIR,
                },
                llm: {
                  model: record.llmMetrics.model,
                  analysisTimeMs: record.llmMetrics.analysisTimeMs,
                  compilationTimeMs: record.llmMetrics.compilationTimeMs,
                  optimizationTimeMs: record.llmMetrics.optimizationTimeMs,
                  binarySizeBytes: record.llmMetrics.binarySizeBytes,
                  irLineCount: record.llmMetrics.irLineCount,
                  benchmark: {
                    iterations: record.iterations,
                    medianMs: record.llmMetrics.executionTimeMs,
                    meanMs: record.llmMetrics.executionTimeMs,
                    minMs: record.llmMetrics.executionTimeMs,
                    maxMs: record.llmMetrics.executionTimeMs,
                    stdDevMs: 0,
                    individualRuns: [],
                    outputHash: record.llmMetrics.outputHash,
                    sampleStdout: '',
                    exitCode: 0,
                    timedOut: false,
                  },
                  irCode: record.llmOptimizedIR,
                  rationale: record.rationale,
                  bottlenecksIdentified: record.bottlenecksIdentified || [],
                  expectedTransformations: [],
                  speedupHypothesis: '',
                  confidenceScore: 92,
                },
                comparison: {
                  speedupPercentage: record.speedupPercentage,
                  codeSizeDeltaPercentage: record.codeSizeDeltaPercentage,
                  correctnessVerified: record.correctnessVerified,
                  totalPipelineDurationMs: record.totalPipelineDurationMs,
                  verdict: record.speedupPercentage > 0 ? 'AI optimization produced faster execution' : 'Standard compilation performed equally or faster',
                },
              });
              setActiveTab('lab');
            }}
            onReloadToWorkspace={(record) => {
              setCode(record.sourceCode);
              setLanguage(record.language);
              setProgramName(record.programName);
              setBaselinePreset(record.baselinePreset);
              setIterations(record.iterations);
              setActiveTab('lab');
            }}
          />
        )}

        {/* TAB 5: THEORY & RESEARCH PAPER */}
        {activeTab === 'theory' && <TheoryView />}
      </main>

      {/* Floating Apple Glass Footer */}
      <footer className="relative z-10 border-t border-black/[0.04] dark:border-white/[0.05] py-4 text-center text-xs font-mono text-zinc-500 dark:text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Compiler Optimization Lab • Apple Silicon & LLVM Architecture</span>
          <span>Clang 14.0.6 • Gemini 3.8 Flash • Differential Output Hashing</span>
        </div>
      </footer>

      {/* LLVM IR Inspector Modal */}
      {irModal.isOpen && (
        <IrViewerModal
          isOpen={irModal.isOpen}
          onClose={() => setIrModal((prev) => ({ ...prev, isOpen: false }))}
          traditionalIR={irModal.traditionalIR}
          llmOptimizedIR={irModal.llmOptimizedIR}
          passesApplied={irModal.passesApplied}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          systemStatus={systemStatus}
          iterations={iterations}
          setIterations={setIterations}
          baselinePreset={baselinePreset}
          setBaselinePreset={setBaselinePreset}
        />
      )}
    </div>
  );
}
