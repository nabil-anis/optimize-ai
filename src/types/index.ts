export type Language = 'c' | 'cpp';

export type ActiveTab = 'lab' | '3d-pipeline' | 'workspace' | 'benchmarks' | 'history' | 'theory';

export interface SystemStatus {
  hasClang: boolean;
  hasOpt: boolean;
  llvmVersion: string;
  platform: string;
  arch: string;
  cpus: number;
  cpuModel: string;
  totalMemoryMb: number;
  freeMemoryMb: number;
  geminiAvailable: boolean;
  modelName: string;
  supportedPasses: Array<{ name: string; description: string }>;
}

export interface ExecutionRun {
  iteration: number;
  durationNs: number;
  durationMs: number;
  stdout: string;
  stderr: string;
  exitCode: number;
}

export interface BenchmarkMetrics {
  iterations: number;
  medianMs: number;
  meanMs: number;
  minMs: number;
  maxMs: number;
  stdDevMs: number;
  individualRuns: ExecutionRun[];
  outputHash: string;
  sampleStdout: string;
  exitCode: number;
  timedOut: boolean;
}

export interface PipelineCompilationData {
  compilationTimeMs: number;
  optimizationTimeMs: number;
  binarySizeBytes: number;
  irLineCount: number;
  benchmark: BenchmarkMetrics;
  irCode: string;
}

export interface LLMPipelineData extends PipelineCompilationData {
  model: string;
  analysisTimeMs: number;
  rationale: string;
  bottlenecksIdentified: string[];
  expectedTransformations: string[];
  speedupHypothesis: string;
  confidenceScore: number;
}

export interface BenchmarkComparison {
  speedupPercentage: number;
  codeSizeDeltaPercentage: number;
  correctnessVerified: boolean;
  totalPipelineDurationMs: number;
  verdict: string;
}

export interface BenchmarkResponse {
  success: boolean;
  recordId: string;
  timestamp: string;
  programName: string;
  language: Language;
  baselinePreset: string;
  passesApplied: string[];
  iterations: number;
  traditional: PipelineCompilationData;
  llm: LLMPipelineData;
  comparison: BenchmarkComparison;
}

export interface BenchmarkHistoryItem {
  id: string;
  timestamp: string;
  programName: string;
  language: Language;
  sourceCode: string;
  baselinePreset: string;
  recommendedPasses: string[];
  iterations: number;
  traditionalMetrics: {
    compilationTimeMs: number;
    optimizationTimeMs: number;
    executionTimeMs: number;
    binarySizeBytes: number;
    outputHash: string;
    irLineCount: number;
  };
  llmMetrics: {
    model: string;
    analysisTimeMs: number;
    compilationTimeMs: number;
    optimizationTimeMs: number;
    executionTimeMs: number;
    binarySizeBytes: number;
    outputHash: string;
    irLineCount: number;
  };
  correctnessVerified: boolean;
  speedupPercentage: number;
  codeSizeDeltaPercentage: number;
  totalPipelineDurationMs: number;
  rationale: string;
  bottlenecksIdentified: string[];
  traditionalIR: string;
  llmOptimizedIR: string;
}

export interface CodeSample {
  id: string;
  title: string;
  category: string;
  description: string;
  language: Language;
  code: string;
  targetOptimization: string;
}
