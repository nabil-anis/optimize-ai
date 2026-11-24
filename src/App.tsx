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
  Sparkles
} from 'lucide-react';

export default function App() {
  // Ensure any stale dark class is cleared on load
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // Active navigation tab — default to the Dual Compilers Lab hero view
  const [activeTab, setActiveTab] = useState<ActiveTab>('lab');

  // Studio layout sub-mode
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

  // Benchmark Execution Function (Live Backend compilation)
  const handleRunBenchmark = async () => {
    if (isRunning || !code.trim()) return;

    setIsRunning(true);
    setErrorMessage(null);
    setBenchmarkStep('Reading code and checking grammar...');

    try {
      setTimeout(() => {
        if (isRunning) setBenchmarkStep('Building universal code blueprint...');
      }, 300);

      setTimeout(() => {
        if (isRunning) setBenchmarkStep('AI scanning for slow loops and repeated math...');
      }, 900);

      setTimeout(() => {
        if (isRunning) setBenchmarkStep('Applying targeted AI speedups...');
      }, 2200);

      setTimeout(() => {
        if (isRunning) setBenchmarkStep('Measuring run speed and verifying output...');
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
    <div className="min-h-screen flex flex-col font-sans bg-[#F0EEE6] text-[#141413] overflow-x-hidden selection:bg-[#D97757]/25">
      {/* Warm Cream Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        systemStatus={systemStatus}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
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

        {/* TAB 1: LIVE 3D VISUAL PIPELINE */}
        {activeTab === '3d-pipeline' && (
          <div className="space-y-8 animate-editorial-in">
            {/* Editorial Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-[#D9D6CA] pb-5">
              <div className="space-y-2">
                <span className="text-xs uppercase font-semibold tracking-[0.08em] text-[#B5532F] block">
                  Interactive 3D Diagram
                </span>
                <h1 className="font-serif-display text-3xl sm:text-5xl text-[#141413]">
                  Watch the compiler think
                </h1>
                <p className="text-sm sm:text-base text-[#5E5D57] max-w-xl">
                  See your code travel through a standard checklist alongside an AI-guided path.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setActiveTab('workspace')}
                  className="px-4 py-2 rounded-full border-2 border-[#141413] text-xs font-semibold text-[#141413] hover:bg-[#FAF9F5] transition-colors cursor-pointer flex items-center space-x-1.5"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Open Studio</span>
                </button>

                <button
                  onClick={handleRunBenchmark}
                  disabled={isRunning}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-opacity cursor-pointer flex items-center space-x-1.5 ${
                    isRunning
                      ? 'opacity-60 cursor-not-allowed bg-[#D9D6CA] text-[#5E5D57]'
                      : 'bg-[#D97757] text-[#141413] hover:opacity-90'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Comparison</span>
                </button>
              </div>
            </div>

            {/* Classic Textbook Compiler Inspiration Blueprint (Top-to-Bottom Reference) */}
            <section className="p-5 sm:p-8 editorial-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#D9D6CA] pb-4">
                <div>
                  <span className="text-[11px] uppercase font-semibold tracking-[0.08em] text-[#B5532F] block">
                    Reference Diagram (What the 3D Scene Represents)
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#141413] mt-0.5">
                    The Classic 6-Phase Compiler Flow (Top to Bottom)
                  </h2>
                </div>
                <span className="text-xs font-mono font-semibold text-[#5E5D57]">
                  Start at top • Finish at bottom
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch text-xs">
                {/* Left Column: Variable Table (Symbol Table) */}
                <div className="lg:col-span-3 order-2 lg:order-1 rounded-[20px] bg-[#F0EEE6] border-2 border-[#D9D6CA] p-5 flex flex-col items-center justify-center text-center space-y-2">
                  <span className="text-[10.5px] uppercase font-semibold tracking-[0.08em] text-[#B5532F]">
                    Connected Left Tower
                  </span>
                  <h3 className="font-serif text-xl font-medium text-[#141413]">
                    Variable Table
                  </h3>
                  <p className="text-xs text-[#5E5D57] leading-relaxed">
                    Tracks every variable name, type, and scope across all 6 phases.
                  </p>
                </div>

                {/* Center Column: Top-to-Bottom Flowchart */}
                <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-center space-y-1.5">
                  <div className="px-4 py-1.5 rounded-full bg-[#141413] text-[#FAF9F5] font-mono text-[11px] font-semibold">
                    START: Source Code Input
                  </div>
                  <span className="text-[#B5532F] font-bold text-xs">↓</span>

                  {[
                    { num: '1', name: 'Lexical Analysis (Scanner)', note: 'Words & symbols' },
                    { num: '2', name: 'Syntax Analysis (Parser)', note: 'Grammar tree' },
                    { num: '3', name: 'Semantic Analysis', note: 'Type rules' },
                    { num: '4', name: 'Intermediate Code Generation', note: 'Universal blueprint' },
                  ].map((phase) => (
                    <React.Fragment key={phase.num}>
                      <div className="w-full max-w-md px-4 py-2.5 rounded-full bg-[#F0EEE6] border-2 border-[#D9D6CA] flex items-center justify-between gap-2">
                        <span className="font-mono font-semibold text-[#B5532F]">{phase.num}.</span>
                        <span className="font-semibold text-[#141413] text-center flex-1">{phase.name}</span>
                        <span className="text-[11px] text-[#5E5D57] hidden sm:inline">{phase.note}</span>
                      </div>
                      <span className="text-[#B5532F] font-bold text-xs">↓</span>
                    </React.Fragment>
                  ))}

                  {/* Phase 5 Optimization Fork */}
                  <div className="w-full max-w-md grid grid-cols-2 gap-2.5">
                    <div className="px-3 py-2.5 rounded-[16px] bg-[#F0EEE6] border-2 border-[#D9D6CA] text-center">
                      <span className="font-mono text-[10px] font-semibold text-[#5E5D57] block">5A. NORMAL (-O2)</span>
                      <span className="font-semibold text-[#141413] text-[11px]">Code Optimization</span>
                    </div>
                    <div className="px-3 py-2.5 rounded-[16px] bg-[#D97757] border-2 border-[#141413] text-center">
                      <span className="font-mono text-[10px] font-semibold text-[#141413] block">5B. AI-GUIDED</span>
                      <span className="font-semibold text-[#141413] text-[11px]">Code Optimization</span>
                    </div>
                  </div>
                  <span className="text-[#B5532F] font-bold text-xs">↓</span>

                  <div className="w-full max-w-md px-4 py-2.5 rounded-full bg-[#F0EEE6] border-2 border-[#D9D6CA] flex items-center justify-between gap-2">
                    <span className="font-mono font-semibold text-[#B5532F]">6.</span>
                    <span className="font-semibold text-[#141413] text-center flex-1">Target Code Generation</span>
                    <span className="text-[11px] text-[#5E5D57] hidden sm:inline">CPU instructions</span>
                  </div>
                  <span className="text-[#B5532F] font-bold text-xs">↓</span>

                  <div className="px-4 py-1.5 rounded-full bg-[#141413] text-[#FAF9F5] font-mono text-[11px] font-semibold">
                    END: Final Runnable Program
                  </div>
                </div>

                {/* Right Column: Error Checker */}
                <div className="lg:col-span-3 order-3 rounded-[20px] bg-[#F0EEE6] border-2 border-[#D9D6CA] p-5 flex flex-col items-center justify-center text-center space-y-2">
                  <span className="text-[10.5px] uppercase font-semibold tracking-[0.08em] text-[#B5532F]">
                    Connected Right Tower
                  </span>
                  <h3 className="font-serif text-xl font-medium text-[#141413]">
                    Error Checker
                  </h3>
                  <p className="text-xs text-[#5E5D57] leading-relaxed">
                    Watches all 6 phases to catch typos, grammar bugs, and unsafe optimizations.
                  </p>
                </div>
              </div>
            </section>

            {/* Live Visual 3D Pipeline Diagram Canvas */}
            <ThreePipelineDiagram
              isDark={true}
              isRunning={isRunning}
              benchmarkStep={benchmarkStep}
              currentResult={currentResult}
              onRunBenchmark={handleRunBenchmark}
              programName={programName}
              onOpenStudio={() => setActiveTab('workspace')}
              heightClass="h-[560px] sm:h-[760px]"
            />

            {/* Three Short Idea Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-6 editorial-card editorial-card-lift space-y-2">
                <span className="text-[11px] uppercase font-semibold tracking-[0.08em] text-[#B5532F] block">
                  Track A • Standard (-O2)
                </span>
                <p className="text-sm text-[#5E5D57] leading-relaxed">
                  Runs a fixed checklist of ~120 cleanup steps in the exact same order for every program.
                </p>
              </div>

              <div className="p-6 editorial-card editorial-card-lift space-y-2">
                <span className="text-[11px] uppercase font-semibold tracking-[0.08em] text-[#B5532F] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Track B • AI-Guided
                </span>
                <p className="text-sm text-[#5E5D57] leading-relaxed">
                  Reads the code blueprint first, then selects only the handful of tools that help.
                </p>
              </div>

              <div className="p-6 editorial-card editorial-card-lift space-y-2">
                <span className="text-[11px] uppercase font-semibold tracking-[0.08em] text-[#B5532F] block">
                  Explore Nodes
                </span>
                <p className="text-sm text-[#5E5D57] leading-relaxed">
                  Click any stage block in the 3D scene to inspect how each phase transforms your code.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STUDIO (CODE EDITOR + 3D PIPELINE + COMPARISON CARDS) */}
        {activeTab === 'workspace' && (
          <div className="space-y-8 animate-editorial-in">
            {/* Studio Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-[#D9D6CA] pb-5">
              <div className="space-y-2">
                <span className="text-xs uppercase font-semibold tracking-[0.08em] text-[#B5532F] block">
                  Benchmarking Laboratory
                </span>
                <h1 className="font-serif-display text-3xl sm:text-5xl text-[#141413]">
                  Compiler Studio
                </h1>
                <p className="text-sm sm:text-base text-[#5E5D57]">
                  Edit your C or C++ code, pick manual tools or AI guidance, and measure every run.
                </p>
              </div>

              {/* Pill Switcher */}
              <div className="flex items-center space-x-1 p-1.5 rounded-full bg-[#FAF9F5] border-2 border-[#D9D6CA] text-xs self-start sm:self-auto">
                <button
                  onClick={() => setStudioViewMode('with-3d')}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full font-semibold transition-colors cursor-pointer ${
                    studioViewMode === 'with-3d'
                      ? 'bg-[#D97757] text-[#141413]'
                      : 'text-[#5E5D57] hover:text-[#141413]'
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Live 3D & Code</span>
                </button>

                <button
                  onClick={() => setStudioViewMode('compact')}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full font-semibold transition-colors cursor-pointer ${
                    studioViewMode === 'compact'
                      ? 'bg-[#D97757] text-[#141413]'
                      : 'text-[#5E5D57] hover:text-[#141413]'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Focused Studio</span>
                </button>
              </div>
            </div>

            {studioViewMode === 'with-3d' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="flex items-center space-x-2 font-semibold text-[#141413]">
                    <Box className="w-3.5 h-3.5 text-[#B5532F]" />
                    <span>Live Pipeline Diagram</span>
                  </span>
                  <button
                    onClick={() => setActiveTab('3d-pipeline')}
                    className="font-semibold text-[#B5532F] hover:underline cursor-pointer"
                  >
                    Expand to Full 3D View
                  </button>
                </div>
                <ThreePipelineDiagram
                  isDark={true}
                  isRunning={isRunning}
                  benchmarkStep={benchmarkStep}
                  currentResult={currentResult}
                  onRunBenchmark={handleRunBenchmark}
                  programName={programName}
                  heightClass="h-[420px] sm:h-[480px]"
                />
              </div>
            )}

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

            {errorMessage && (
              <div className="p-5 rounded-[24px] bg-[#141413] text-[#FAF9F5] border-2 border-[#D97757] text-xs flex items-start space-x-3">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#D97757]" />
                <div className="flex-1 space-y-1">
                  <span className="font-semibold block text-[#D97757] uppercase tracking-[0.08em] text-[11px]">
                    Test Run Error
                  </span>
                  <pre className="font-mono text-xs whitespace-pre-wrap text-[#C9C6BA]">{errorMessage}</pre>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#141413]">
                  Side-by-Side Comparison
                </h2>
                <span className="text-xs text-[#5E5D57]">
                  Averaged over {iterations} runs
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CompilerCard
                  type="traditional"
                  title="Standard Compiler"
                  subtitle="Runs 120+ fixed checks"
                  badge="BASELINE"
                  presetOrModel={`Standard ${baselinePreset}`}
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

                <CompilerCard
                  type="llm"
                  title="AI-Assisted Compiler"
                  subtitle="Picks only the checks that help"
                  badge={isManualPassMode ? 'MANUAL TOOLS' : 'AI OPTIMIZED'}
                  presetOrModel={isManualPassMode ? `${manualPasses.length} Selected Tools` : 'Smart AI Selection'}
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

      {/* Warm Editorial Footer */}
      <footer className="border-t-2 border-[#D9D6CA] bg-[#F0EEE6] py-6 text-xs text-[#5E5D57]">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-serif text-sm text-[#141413]">
            Compiler Optimization Lab
          </span>
          <span className="text-xs text-[#5E5D57]">
            Standard vs. AI Code Speedup • Side-by-Side Speed Testing
          </span>
        </div>
      </footer>

      {/* Code Blueprint Inspector Modal */}
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
