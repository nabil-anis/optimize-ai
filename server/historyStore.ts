import fs from 'fs';
import path from 'path';
import os from 'os';

export interface BenchmarkRecord {
  id: string;
  timestamp: string;
  programName: string;
  language: 'c' | 'cpp';
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

const HISTORY_FILE = path.join(os.tmpdir(), 'data_history.json');

export class HistoryStore {
  private cache: BenchmarkRecord[] = [];

  constructor() {
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(HISTORY_FILE)) {
        const raw = fs.readFileSync(HISTORY_FILE, 'utf-8');
        this.cache = JSON.parse(raw);
      } else {
        this.cache = [];
      }
    } catch {
      this.cache = [];
    }
  }

  private save() {
    try {
      fs.writeFileSync(HISTORY_FILE, JSON.stringify(this.cache.slice(0, 50), null, 2), 'utf-8');
    } catch {
      // ignore
    }
  }

  public getAll(): BenchmarkRecord[] {
    return [...this.cache];
  }

  public getById(id: string): BenchmarkRecord | undefined {
    return this.cache.find(r => r.id === id);
  }

  public add(record: BenchmarkRecord) {
    this.cache.unshift(record);
    if (this.cache.length > 50) {
      this.cache = this.cache.slice(0, 50);
    }
    this.save();
  }

  public delete(id: string): boolean {
    const idx = this.cache.findIndex(r => r.id === id);
    if (idx !== -1) {
      this.cache.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  public clear() {
    this.cache = [];
    this.save();
  }
}

export const historyStore = new HistoryStore();
