import React from 'react';
import {
  GitBranch,
  Layers,
  Sparkles,
  Cpu,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Workflow,
  Terminal,
  Database
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="w-full space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
          Compiler Construction & IR Theory
        </span>
        <h2 className="text-2xl font-semibold tracking-tight text-[#252B35] dark:text-[#E8E9EC] mt-1">
          Dual Pipeline Architecture & Phase Ordering
        </h2>
        <p className="text-xs sm:text-sm text-[#6E7681] dark:text-[#9A9FA8] mt-1">
          Examining the structural contrast between static LLVM Pass Pipelines and AI-Guided Semantic Pass Selection.
        </p>
      </div>

      {/* Side-by-Side Visual Architecture Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pipeline 1: Traditional LLVM */}
        <div className="p-6 rounded-2xl bg-white/70 dark:bg-[#171D29]/70 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.09] shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center">
              <Cpu className="w-4 h-4 text-[#9A9FA8]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#252B35] dark:text-[#E8E9EC]">
                Pipeline A: Traditional Clang / LLVM
              </h3>
              <p className="text-[11px] text-[#6E7681] dark:text-[#9A9FA8]">
                Heuristic-driven, static pass pipeline (-O2 / -O3)
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { title: '1. Frontend Parsing', desc: 'Clang generates Abstract Syntax Tree (AST) and validates semantics' },
              { title: '2. IR Emission', desc: 'Lowers AST into LLVM Intermediate Representation (IR)' },
              { title: '3. Predefined Pass Pipeline', desc: 'Runs static standard sequence of ~120 fixed transformation passes' },
              { title: '4. Code Generation', desc: 'Instruction Selection, Register Allocation (Greedy/PBQP), Frame Lowering' },
              { title: '5. Machine Code Link', desc: 'Emits target machine code (.s) and links to native executable' },
            ].map((s, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05]"
              >
                <span className="font-semibold text-[#252B35] dark:text-[#E8E9EC] block text-[11px]">
                  {s.title}
                </span>
                <span className="text-[10px] text-[#6E7681] dark:text-[#9A9FA8] mt-0.5 block">
                  {s.desc}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05] text-[11px] text-[#6E7681] dark:text-[#9A9FA8]">
            <strong className="text-[#252B35] dark:text-[#E8E9EC] block mb-1">Theoretical Trade-off:</strong>
            Fixed heuristics work well on average across arbitrary software, but suffer from the classical <em>Phase Ordering Problem</em> where one pass disables opportunities for a subsequent pass.
          </div>
        </div>

        {/* Pipeline 2: LLM-Assisted LLVM */}
        <div className="p-6 rounded-2xl bg-white/70 dark:bg-[#171D29]/70 backdrop-blur-2xl border border-zinc-700/50 dark:border-white/20 shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-black/[0.04] dark:bg-white/[0.08] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-zinc-900 dark:text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#252B35] dark:text-[#E8E9EC]">
                Pipeline B: LLM-Assisted LLVM
              </h3>
              <p className="text-[11px] text-[#6E7681] dark:text-[#9A9FA8]">
                AI-guided IR semantic pass selection & phase ordering
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { title: '1. Frontend IR Extraction', desc: 'Emits unoptimized IR (-O0 -disable-O0-optnone) preserving full CFG', highlight: false },
              { title: '2. IR Structural Analysis', desc: 'Analyzes SSA variables, alloca allocations, loop trip counts, memory loads', highlight: false },
              { title: '3. LLM API Synthesis', desc: 'Gemini 3.8 Flash reasons over bottlenecks and synthesizes tailored pass list', highlight: true },
              { title: '4. Pass Validation & Execution', desc: 'LLVM opt validates pass names against target catalog and applies sequence', highlight: false },
              { title: '5. Machine Compilation & Verify', desc: 'Clang compiles optimized IR to native ELF binary; verifies output hashes', highlight: false },
            ].map((s, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border ${
                  s.highlight
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-black border-zinc-700 dark:border-white'
                    : 'bg-black/[0.02] dark:bg-white/[0.02] border-black/[0.04] dark:border-white/[0.05]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-semibold text-[11px] ${s.highlight ? 'text-white dark:text-black font-bold' : 'text-[#252B35] dark:text-[#E8E9EC]'}`}>
                    {s.title}
                  </span>
                  {s.highlight && <Sparkles className="w-3 h-3 text-zinc-300 dark:text-zinc-700" />}
                </div>
                <span className={`text-[10px] mt-0.5 block ${s.highlight ? 'text-zinc-300 dark:text-zinc-700' : 'text-[#6E7681] dark:text-[#9A9FA8]'}`}>
                  {s.desc}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05] text-[11px] text-[#252B35] dark:text-[#E8E9EC]">
            <strong className="text-zinc-900 dark:text-white block mb-1">Theoretical Advantage:</strong>
            Avoids unnecessary pass overhead for algorithms that only require targeted transformations (e.g. vectorization or SROA), while mitigating phase conflicts through semantic reasoning.
          </div>
        </div>
      </div>

      {/* The Phase Ordering Problem Explained */}
      <div className="p-6 rounded-2xl bg-white/70 dark:bg-[#171D29]/70 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.09] shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-[#252B35] dark:text-[#E8E9EC] flex items-center">
          <Workflow className="w-4 h-4 mr-2 text-zinc-700 dark:text-zinc-300" />
          The Phase Ordering Problem in Modern Compilers
        </h3>
        <p className="text-xs text-[#6E7681] dark:text-[#9A9FA8] leading-relaxed">
          In compiler theory, the <strong>Phase Ordering Problem</strong> refers to the challenge of selecting the optimal sequence of compiler optimization passes. Because each optimization pass transforms the Intermediate Representation (IR), it creates or destroys opportunities for subsequent passes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05]">
            <span className="font-semibold text-[#252B35] dark:text-[#E8E9EC] block mb-1">Combinatorial Explosion</span>
            <span className="text-[11px] text-[#6E7681] dark:text-[#9A9FA8]">
              With over 100 LLVM passes, the space of possible pass sequences is greater than 100^10, making brute force search computationally intractable.
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05]">
            <span className="font-semibold text-[#252B35] dark:text-[#E8E9EC] block mb-1">Pass Interference</span>
            <span className="text-[11px] text-[#6E7681] dark:text-[#9A9FA8]">
              Inlining functions too early can inflate code size and exhaust registers; inlining too late prevents inter-procedural constant propagation.
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05]">
            <span className="font-semibold text-[#252B35] dark:text-[#E8E9EC] block mb-1">LLM Semantic Reasoning</span>
            <span className="text-[11px] text-[#6E7681] dark:text-[#9A9FA8]">
              By inspecting high-level loop nests, memory striding, and algorithmic intent in the IR, LLMs propose tailored, minimal pass sub-sequences.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
