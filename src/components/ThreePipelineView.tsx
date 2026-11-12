import React, { useState } from 'react';
import { ThreePipelineDiagram } from './ThreePipelineDiagram';
import {
  Layers,
  Cpu,
  Workflow,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Activity,
  Maximize2
} from 'lucide-react';

export const ThreePipelineView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'3d' | 'theory' | 'mechanics'>('3d');

  return (
    <div className="w-full space-y-8 max-w-6xl mx-auto text-zinc-200">
      {/* Header (Strict Monochrome Black, White, and Greys) */}
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase text-zinc-400">
          <span className="w-2 h-2 bg-white rounded-full" />
          <span>Interactive 3D Simulation</span>
          <span>•</span>
          <span>Compiler Architecture Lab</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white mt-1">
          3D Working Pipeline & Compiler Architecture
        </h1>
        <p className="text-sm text-zinc-400 mt-1 max-w-3xl leading-relaxed">
          An interactive, three-dimensional physical simulation of the compiler optimization pipeline. Explore the spatial divergence between static LLVM optimization heuristics and AI-guided IR pass synthesis.
        </p>

        {/* Section Navigation Tabs */}
        <div className="flex items-center space-x-2 mt-4 text-xs font-mono">
          {[
            { id: '3d', label: '3D Working Pipeline Machine' },
            { id: 'theory', label: 'Theoretical Mechanics & Lowering' },
            { id: 'mechanics', label: 'Phase Ordering Mathematical Model' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                activeSection === tab.id
                  ? 'bg-white text-black font-bold border-white'
                  : 'bg-zinc-900 text-zinc-400 border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: THE INTERACTIVE 3D WORKING SCENE */}
      {activeSection === '3d' && (
        <div className="space-y-6">
          <ThreePipelineDiagram />

          {/* Quick Guide to the 3D Scene */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 space-y-1.5">
              <span className="font-mono font-semibold text-white uppercase text-[11px] block">
                Track A (Background): Traditional LLVM
              </span>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Fixed static pipeline with standard -O2 pass sequencing. Follows uniform heuristics regardless of program semantics, leading to redundant pass runs.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 space-y-1.5">
              <span className="font-mono font-semibold text-white uppercase text-[11px] block flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                Track B (Foreground): LLM-Assisted
              </span>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Lowers unoptimized IR to the Gemini 3.8 Flash cognitive core. Synthesizes a targeted minimal pass sequence specifically tailored for the algorithm's loop bounds.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 space-y-1.5">
              <span className="font-mono font-semibold text-white uppercase text-[11px] block">
                Instruction Packets & Flow
              </span>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Watch the flowing data tokens as they traverse the stages. Use the bottom dock to toggle the Exploded View (0% to 100%) or adjust simulation speed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: THEORETICAL MECHANICS & LOWERING */}
      {activeSection === 'theory' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-4">
            <h2 className="text-lg font-bold text-white tracking-tight">
              How the Compiler Pipeline Actually Works
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Every modern optimizing compiler acts as a series of lowering transformations: translating high-level human abstractions into target machine bits. Below is the exact step-by-step physical breakdown represented in the 3D diagram.
            </p>

            <div className="space-y-4 pt-2 text-xs">
              {[
                {
                  step: '01',
                  name: 'Source Tokenization & AST Generation',
                  desc: 'Clang lexes C/C++ source code into lexical tokens and builds the Abstract Syntax Tree (AST). Static type deduction and semantic checks occur here.',
                  irCode: 'int sum = 0;\nfor (int i = 0; i < N; i++) sum += arr[i];',
                },
                {
                  step: '02',
                  name: 'LLVM IR Lowering & SSA Invariant Enforcement',
                  desc: 'The AST is lowered into LLVM Intermediate Representation. In Static Single Assignment (SSA) form, every variable (%1, %2) is assigned exactly once. PHI nodes resolve values across multiple incoming control flow paths.',
                  irCode: '; Unoptimized LLVM IR (-O0)\n%1 = alloca i32, align 4\nstore i32 0, i32* %1, align 4\n%2 = load i32, i32* %1, align 4',
                },
                {
                  step: '03',
                  name: 'AI IR Analysis vs Static Blanket Passes',
                  desc: 'In traditional compilation, LLVM runs a fixed suite of ~120 passes in preset sequence. In the LLM pipeline, Gemini inspects basic block density, alloca memory chains, and loop induction variables, selecting only the necessary passes.',
                  irCode: 'Selected Passes: [-mem2reg, -sroa, -loop-rotate, -licm, -loop-unroll, -dce]',
                },
                {
                  step: '04',
                  name: 'LLVM Opt Pass Manager Execution',
                  desc: 'The LLVM opt tool validates the recommended passes against the installed LLVM target catalog. Passes mutate the IR in place: mem2reg converts alloca loads/stores into direct SSA registers.',
                  irCode: '; Optimized LLVM IR\n%.03 = phi i32 [ 0, %0 ], [ %8, %5 ]\n%6 = add nuw nsw i32 %.03, 1',
                },
                {
                  step: '05',
                  name: 'Target Code Generation & Register Allocation',
                  desc: 'The optimized IR is handed to the LLVM backend. Instruction selection converts target-independent instructions into x86_64 machine instructions. Virtual registers are mapped to physical hardware registers (RAX, RBX, RDX).',
                  irCode: 'xorl %eax, %eax\n.LBB0_1:\naddl (%rdi,%rax,4), %esi\nincq %rax',
                },
                {
                  step: '06',
                  name: 'Multi-Iteration Empirical Verification',
                  desc: 'Both executables are invoked multiple times with nanosecond high-resolution timers. Program outputs are SHA-256 hashed to guarantee strict semantic equivalence.',
                  irCode: 'Output Hash: 33fabdc425bc635b (Verified Identical)',
                },
              ].map((s) => (
                <div key={s.step} className="p-4 rounded-xl bg-black/50 border border-white/8 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-white flex items-center">
                      <span className="w-5 h-5 rounded-md bg-white text-black text-[11px] font-bold flex items-center justify-center mr-2">
                        {s.step}
                      </span>
                      {s.name}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[11.5px] leading-relaxed">{s.desc}</p>
                  <pre className="p-2.5 rounded-lg bg-zinc-950 font-mono text-[11px] text-zinc-300 overflow-x-auto border border-white/5">
                    {s.irCode}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: PHASE ORDERING MATHEMATICAL MODEL */}
      {activeSection === 'mechanics' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-4">
            <h2 className="text-lg font-bold text-white tracking-tight">
              The Phase Ordering Problem: A Formal Perspective
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Why can't we simply run every optimization pass in LLVM? The answer lies in the combinatorial nature of compiler pass interactions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-4 rounded-xl bg-black/50 border border-white/8 space-y-2">
                <span className="font-mono font-semibold text-white uppercase text-[11px] block">
                  Non-Commutative Transformations
                </span>
                <p className="text-zinc-400 leading-relaxed text-[11px]">
                  Compiler passes are non-commutative functions $P_1(P_2(IR)) \neq P_2(P_1(IR))$. For instance, running Dead Code Elimination (DCE) before Function Inlining might delete dead branches, but inlining a function later might introduce newly dead code that requires another DCE pass.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/50 border border-white/8 space-y-2">
                <span className="font-mono font-semibold text-white uppercase text-[11px] block">
                  Search Space Explosion
                </span>
                <p className="text-zinc-400 leading-relaxed text-[11px]">
                  With over 120 passes in LLVM, a pass sequence of length $k = 15$ yields an astronomical search space of $120^{15} \approx 1.54 \times 10^{31}$ possible pipelines. Brute-force heuristic search is mathematically impossible within reasonable build times.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/50 border border-white/8 space-y-2">
                <span className="font-mono font-semibold text-white uppercase text-[11px] block">
                  Destructive Phase Coupling
                </span>
                <p className="text-zinc-400 leading-relaxed text-[11px]">
                  Loop unrolling increases code size and register pressure. If register pressure exceeds hardware capacity, the compiler must emit costly memory spill instructions to the stack, inadvertently slowing down execution despite unrolling.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/50 border border-white/8 space-y-2">
                <span className="font-mono font-semibold text-white uppercase text-[11px] block">
                  How LLM Semantic Reasoning Solves It
                </span>
                <p className="text-zinc-400 leading-relaxed text-[11px]">
                  Large Language Models trained on compiler semantics analyze the high-level algorithm in the IR. Rather than searching billions of permutations, the LLM maps code patterns directly to the exact necessary transformations ($O(1)$ inference).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
