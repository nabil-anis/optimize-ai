import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { compilerService } from './compilerService.js';
import { geminiService } from './geminiService.js';
import { historyStore, BenchmarkRecord } from './historyStore.js';

dotenv.config();

export const app = express();

app.use(express.json({ limit: '10mb' }));

// API Health Check
app.get(['/api', '/api/health'], (req, res) => {
  res.json({ status: 'ok', name: 'Compiler Optimization Lab API' });
});

// 1. System toolchain and status endpoint
app.get(['/api/system/status', '/system/status'], (req, res) => {
  const sysInfo = compilerService.getSystemInfo();
  const geminiAvailable = geminiService.isAvailable();
  res.json({
    ...sysInfo,
    geminiAvailable,
    modelName: 'gemini-3.8-flash',
  });
});

// 2. Real Benchmark Execution Endpoint
app.post(['/api/benchmark/run', '/benchmark/run'], async (req, res) => {
  const {
    code,
    language = 'c',
    programName = 'Custom Benchmark',
    baselinePreset = '-O2',
    iterations = 5,
    customPrompt = '',
    manualPasses = null,
  } = req.body;

  if (!code || typeof code !== 'string' || code.trim() === '') {
    return res.status(400).json({ error: 'Source code cannot be empty.' });
  }

  const isCpp = language === 'cpp';
  const workDir = compilerService.createSandboxDir();
  const sourceFileName = isCpp ? 'source.cpp' : 'source.c';
  const sourceFilePath = path.join(workDir, sourceFileName);

  const pipelineStart = process.hrtime.bigint();

  try {
    fs.writeFileSync(sourceFilePath, code, 'utf-8');

    // Step A: Generate unoptimized LLVM IR for LLM analysis
    let unoptIrResult: { irPath: string; irContent: string; durationMs: number };
    try {
      unoptIrResult = compilerService.generateUnoptimizedIR(sourceFilePath, isCpp, workDir);
    } catch (unoptErr: any) {
      return res.status(400).json({
        error: 'Compilation syntax error during frontend LLVM IR generation:\n' + (unoptErr.stderr || unoptErr.message),
      });
    }

    // Step B: Traditional Compiler Pipeline (Baseline)
    const traditionalComp = compilerService.compileTraditional(
      sourceFilePath,
      isCpp,
      workDir,
      baselinePreset,
      code,
      programName,
      unoptIrResult.durationMs
    );
    if (!traditionalComp.success || !traditionalComp.executablePath) {
      return res.status(400).json({
        error: 'Traditional baseline compilation failed:\n' + (traditionalComp.error || 'Unknown compiler error'),
      });
    }

    // Step C: LLM-Assisted Compiler Pipeline
    let passesToApply: string[] = [];
    let llmRecommendation: any = null;

    if (Array.isArray(manualPasses) && manualPasses.length > 0) {
      passesToApply = manualPasses;
      llmRecommendation = {
        recommendedPasses: manualPasses,
        rationale: 'User-specified manual pass pipeline.',
        bottlenecksIdentified: ['Manual pass tuning mode active.'],
        expectedTransformations: ['User-directed LLVM transformations applied.'],
        speedupHypothesis: 'Targeting specific user-directed optimization sequence.',
        confidenceScore: 90,
        model: 'Manual Override',
        analysisTimeMs: 0,
      };
    } else {
      try {
        llmRecommendation = await geminiService.recommendOptimizationPasses(
          code,
          unoptIrResult.irContent,
          language,
          customPrompt
        );
        passesToApply = llmRecommendation.recommendedPasses;
      } catch (geminiErr: any) {
        return res.status(503).json({
          error: `LLM API Error during IR analysis: ${geminiErr.message}. Ensure your GEMINI_API_KEY is configured in the AI Studio Secrets panel.`,
          unoptimizedIR: unoptIrResult.irContent.slice(0, 1000),
        });
      }
    }

    // Step D: Apply Recommended Passes and Compile
    const llmComp = compilerService.compileWithCustomPasses(
      unoptIrResult.irPath,
      passesToApply,
      isCpp,
      workDir,
      code,
      programName,
      sourceFilePath,
      unoptIrResult.durationMs
    );

    if (!llmComp.success || !llmComp.executablePath) {
      return res.status(400).json({
        error: 'LLM-assisted pass optimization failed during opt execution:\n' + (llmComp.error || 'Pass application failure'),
        recommendedPasses: passesToApply,
      });
    }

    // Step E: Benchmark both executables sequentially so they don't compete for CPU cores
    const numIterations = Math.max(1, Math.min(iterations || 5, 20));
    const traditionalBenchmark = await compilerService.benchmarkExecutable(
      traditionalComp.executablePath,
      numIterations,
      '',
      code,
      programName,
      baselinePreset,
      []
    );
    const llmBenchmark = await compilerService.benchmarkExecutable(
      llmComp.executablePath,
      numIterations,
      '',
      code,
      programName,
      baselinePreset,
      passesToApply
    );

    // Step F: Correctness Verification
    const correctnessVerified =
      traditionalBenchmark.outputHash === llmBenchmark.outputHash &&
      traditionalBenchmark.exitCode === llmBenchmark.exitCode;

    // Step G: Calculate Performance Deltas
    const tradExecMs = traditionalBenchmark.medianMs;
    const llmExecMs = llmBenchmark.medianMs;
    const speedupPercentage =
      tradExecMs > 0
        ? Math.round(((tradExecMs - llmExecMs) / tradExecMs) * 1000) / 10
        : 0;

    const tradSize = traditionalComp.binarySizeBytes;
    const llmSize = llmComp.binarySizeBytes;
    const codeSizeDeltaPercentage =
      tradSize > 0
        ? Math.round(((tradSize - llmSize) / tradSize) * 1000) / 10
        : 0;

    const totalPipelineDurationMs = Math.round(Number(process.hrtime.bigint() - pipelineStart) / 1_000_000);

    const record: BenchmarkRecord = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      programName,
      language,
      sourceCode: code,
      baselinePreset,
      recommendedPasses: passesToApply,
      iterations: numIterations,
      traditionalMetrics: {
        compilationTimeMs: traditionalComp.compilationTimeMs,
        optimizationTimeMs: traditionalComp.optimizationTimeMs,
        executionTimeMs: traditionalBenchmark.medianMs,
        binarySizeBytes: traditionalComp.binarySizeBytes,
        outputHash: traditionalBenchmark.outputHash,
        irLineCount: traditionalComp.irLineCount,
      },
      llmMetrics: {
        model: llmRecommendation.model,
        analysisTimeMs: llmRecommendation.analysisTimeMs,
        compilationTimeMs: llmComp.compilationTimeMs,
        optimizationTimeMs: llmComp.optimizationTimeMs,
        executionTimeMs: llmBenchmark.medianMs,
        binarySizeBytes: llmComp.binarySizeBytes,
        outputHash: llmBenchmark.outputHash,
        irLineCount: llmComp.irLineCount,
      },
      correctnessVerified,
      speedupPercentage,
      codeSizeDeltaPercentage,
      totalPipelineDurationMs,
      rationale: llmRecommendation.rationale,
      bottlenecksIdentified: llmRecommendation.bottlenecksIdentified,
      traditionalIR: traditionalComp.irCode,
      llmOptimizedIR: llmComp.irCode,
    };

    historyStore.add(record);

    res.json({
      success: true,
      recordId: record.id,
      timestamp: record.timestamp,
      programName,
      language,
      baselinePreset,
      passesApplied: passesToApply,
      iterations: numIterations,
      traditional: {
        compilationTimeMs: traditionalComp.compilationTimeMs,
        optimizationTimeMs: traditionalComp.optimizationTimeMs,
        binarySizeBytes: traditionalComp.binarySizeBytes,
        irLineCount: traditionalComp.irLineCount,
        benchmark: traditionalBenchmark,
        irCode: traditionalComp.irCode,
      },
      llm: {
        model: llmRecommendation.model,
        analysisTimeMs: llmRecommendation.analysisTimeMs,
        compilationTimeMs: llmComp.compilationTimeMs,
        optimizationTimeMs: llmComp.optimizationTimeMs,
        binarySizeBytes: llmComp.binarySizeBytes,
        irLineCount: llmComp.irLineCount,
        benchmark: llmBenchmark,
        irCode: llmComp.irCode,
        rationale: llmRecommendation.rationale,
        bottlenecksIdentified: llmRecommendation.bottlenecksIdentified,
        expectedTransformations: llmRecommendation.expectedTransformations,
        speedupHypothesis: llmRecommendation.speedupHypothesis,
        confidenceScore: llmRecommendation.confidenceScore,
      },
      comparison: {
        speedupPercentage,
        codeSizeDeltaPercentage,
        correctnessVerified,
        totalPipelineDurationMs,
        verdict:
          speedupPercentage > 0
            ? `LLM-assisted pipeline executes ${Math.abs(speedupPercentage)}% faster.`
            : speedupPercentage < 0
            ? `Traditional ${baselinePreset} baseline executes ${Math.abs(speedupPercentage)}% faster.`
            : `Both pipelines achieved equivalent execution time.`,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Unexpected benchmark failure: ' + (err.message || String(err)) });
  } finally {
    compilerService.cleanupDir(workDir);
  }
});

// 3. History Endpoints
app.get(['/api/history', '/history'], (req, res) => {
  res.json(historyStore.getAll());
});

app.delete(['/api/history/:id', '/history/:id'], (req, res) => {
  const success = historyStore.delete(req.params.id);
  res.json({ success });
});

app.post(['/api/history/clear', '/history/clear'], (req, res) => {
  historyStore.clear();
  res.json({ success: true });
});

// 4. IR Semantic Diff Analysis Endpoint
app.post(['/api/analyze-ir', '/analyze-ir'], async (req, res) => {
  const { traditionalIR, llmOptimizedIR, passes } = req.body;
  if (!traditionalIR || !llmOptimizedIR) {
    return res.status(400).json({ error: 'Both baseline and LLM IR strings are required.' });
  }

  try {
    const analysis = await geminiService.explainIRPassDifference(
      traditionalIR,
      llmOptimizedIR,
      passes || []
    );
    res.json(analysis);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to analyze IR difference.' });
  }
});

export default app;
