import React, { useState } from 'react';
import {
  BookOpen,
  GitBranch,
  Workflow,
  Sparkles,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const TheoryView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'paper' | 'architecture'>('paper');

  return (
    <div className="w-full space-y-6 max-w-5xl mx-auto">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.06] dark:border-white/[0.08] pb-4">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">
            Scientific Foundation
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] mt-0.5">
            Compiler Optimization Theory & Research
          </h1>
        </div>

        {/* Apple Segmented Pill */}
        <div className="flex items-center p-1 rounded-xl apple-glass-pill text-xs">
          <button
            onClick={() => setActiveSubTab('paper')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeSubTab === 'paper'
                ? 'bg-black dark:bg-white text-white dark:text-black font-semibold shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Research Paper</span>
          </button>
          <button
            onClick={() => setActiveSubTab('architecture')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeSubTab === 'architecture'
                ? 'bg-black dark:bg-white text-white dark:text-black font-semibold shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>Phase Ordering Model</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: RESEARCH PAPER */}
      {activeSubTab === 'paper' && (
        <div className="space-y-6">
          {/* Paper Abstract Card */}
          <div className="p-8 rounded-3xl apple-glass space-y-3">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold bg-black/[0.05] dark:bg-white/[0.08] text-black dark:text-white">
                Research Paper Foundation
              </span>
              <span className="text-zinc-400">•</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Compiler Construction Laboratory
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] leading-tight">
              A Comparative Analysis of Large Language Model Approaches for Compiler Optimization: Identifying Research Gaps and Future Directions
            </h2>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed pt-1">
              Modern optimizing compilers rely heavily on hand-tuned heuristics developed over decades. While flags such as <code>-O2</code> and <code>-O3</code> provide strong general-case performance, they struggle with the fundamental Phase Ordering Problem and incur significant code size and compilation overhead. Recent advances in Large Language Models (LLMs) present a new paradigm: analyzing compiler Intermediate Representation (IR) to recommend custom, fine-grained optimization pass pipelines. This benchmarking platform empirically evaluates this approach, measuring execution speed, compilation latency, optimization duration, binary size, and semantic correctness on real LLVM/Clang toolchains.
            </p>
          </div>

          {/* Research Questions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl apple-glass space-y-2">
              <span className="font-mono text-[10px] uppercase font-bold text-zinc-400 block">
                Research Question 01
              </span>
              <h3 className="font-semibold text-sm text-[#1D1D1F] dark:text-[#F5F5F7]">
                Execution Speedup vs Heuristics
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Can an LLM inspect unoptimized LLVM IR and identify bottleneck-targeted pass sequences that outperform standard <code>-O2</code> or <code>-O3</code> pipelines in runtime throughput?
              </p>
            </div>

            <div className="p-5 rounded-2xl apple-glass space-y-2">
              <span className="font-mono text-[10px] uppercase font-bold text-zinc-400 block">
                Research Question 02
              </span>
              <h3 className="font-semibold text-sm text-[#1D1D1F] dark:text-[#F5F5F7]">
                The Compilation Overhead Equation
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Does the latency introduced by LLM API inference and pass synthesis outweigh performance benefits in iterative builds versus high-frequency batch deployment?
              </p>
            </div>

            <div className="p-5 rounded-2xl apple-glass space-y-2">
              <span className="font-mono text-[10px] uppercase font-bold text-zinc-400 block">
                Research Question 03
              </span>
              <h3 className="font-semibold text-sm text-[#1D1D1F] dark:text-[#F5F5F7]">
                Differential Verification
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                How does automated pass validation against the target LLVM catalog eliminate invalid flags, and how does differential output hashing guarantee program semantic equivalence?
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: PHASE ORDERING ARCHITECTURE */}
      {activeSubTab === 'architecture' && (
        <div className="space-y-6">
          {/* Dual Pipeline Architecture Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Traditional Pipeline */}
            <div className="p-6 rounded-3xl apple-glass space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-black/[0.04] dark:bg-white/[0.08] flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-black dark:text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                    Traditional Clang / LLVM (-O2)
                  </h3>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Static blanket pass manager heuristics
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { title: '1. Frontend Parsing', desc: 'Clang generates Abstract Syntax Tree (AST)' },
                  { title: '2. IR Emission', desc: 'Lowers AST into standard LLVM IR SSA form' },
                  { title: '3. Predefined Passes', desc: 'Runs static standard suite of ~120 fixed passes' },
                  { title: '4. Code Generation', desc: 'Instruction Selection, Register Allocation (Greedy)' },
                  { title: '5. Machine Code Link', desc: 'Emits target machine code (.s) and native executable' },
                ].map((s, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05]">
                    <span className="font-semibold text-[11px] text-[#1D1D1F] dark:text-[#F5F5F7] block">
                      {s.title}
                    </span>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block mt-0.5">
                      {s.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* LLM-Assisted Pipeline */}
            <div className="p-6 rounded-3xl apple-glass space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                    LLM-Assisted LLVM Pipeline
                  </h3>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    AI-guided IR semantic pass selection
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { title: '1. Frontend IR Extraction', desc: 'Emits unoptimized IR (-O0 -disable-O0-optnone)' },
                  { title: '2. IR Structural Analysis', desc: 'Analyzes SSA variables, loop counts, and memory allocas' },
                  { title: '3. LLM API Synthesis', desc: 'Gemini 3.8 Flash reasons over bottlenecks and synthesizes pass order' },
                  { title: '4. Pass Validation & Exec', desc: 'LLVM opt validates pass names and mutates IR in place' },
                  { title: '5. Machine Compilation & Verify', desc: 'Clang compiles optimized IR; verifies output hashes' },
                ].map((s, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05]">
                    <span className="font-semibold text-[11px] text-[#1D1D1F] dark:text-[#F5F5F7] block">
                      {s.title}
                    </span>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block mt-0.5">
                      {s.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mathematical Formalism */}
          <div className="p-6 rounded-3xl apple-glass space-y-3">
            <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] flex items-center">
              <Workflow className="w-4 h-4 mr-2" />
              The Phase Ordering Problem: Mathematical Model
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Compiler passes are non-commutative functions: $P_1(P_2(IR)) \neq P_2(P_1(IR))$. With over 120 passes in LLVM, a pass sequence of length $k = 15$ yields a search space of $120^{15} \approx 1.54 \times 10^{31}$ possible permutations. Rather than brute-force heuristics, LLM semantic inference identifies optimal pass schedules in $O(1)$ inference.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
