import React from 'react';
import {
  BookOpen,
  FileText,
  Award,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

export const ResearchPaperView: React.FC = () => {
  return (
    <div className="w-full space-y-8 max-w-4xl mx-auto">
      {/* Paper Header Card */}
      <div className="p-8 rounded-2xl bg-white/70 dark:bg-[#171D29]/70 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.09] shadow-sm space-y-3">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold bg-black/[0.04] dark:bg-white/[0.08] text-zinc-900 dark:text-white border border-black/[0.08] dark:border-white/[0.1]">
            Research Paper Foundation
          </span>
          <span className="text-black/20 dark:text-white/20">•</span>
          <span className="text-xs text-[#6E7681] dark:text-[#9A9FA8]">
            Compiler Construction Laboratory
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#252B35] dark:text-[#E8E9EC]">
          A Comparative Analysis of Large Language Model Approaches for Compiler Optimization: Identifying Research Gaps and Future Directions
        </h1>

        <p className="text-xs sm:text-sm text-[#6E7681] dark:text-[#9A9FA8] leading-relaxed">
          An empirical evaluation framework contrasting classical heuristic-driven LLVM compilation suites against Large Language Model (LLM) intermediate representation (IR) semantic pass synthesis.
        </p>
      </div>

      {/* Abstract */}
      <div className="p-6 rounded-2xl bg-white/70 dark:bg-[#171D29]/70 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.09] shadow-sm space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
          Abstract
        </h3>
        <p className="text-xs sm:text-sm text-[#252B35] dark:text-[#E8E9EC] leading-relaxed">
          Modern optimizing compilers rely heavily on hand-tuned heuristics developed over decades. While flags such as <code>-O2</code> and <code>-O3</code> provide strong general-case performance, they struggle with the fundamental Phase Ordering Problem and can incur significant code size and compilation overhead. Recent advances in Large Language Models (LLMs) present a new paradigm: analyzing compiler Intermediate Representation (IR) to recommend custom, fine-grained optimization pass pipelines. This benchmarking platform empirically evaluates this approach, measuring execution speed, compilation latency, optimization duration, binary size, and semantic correctness on real LLVM/Clang toolchains.
        </p>
      </div>

      {/* Key Research Questions */}
      <div className="p-6 rounded-2xl bg-white/70 dark:bg-[#171D29]/70 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.09] shadow-sm space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
          Core Research Questions
        </h3>

        <div className="space-y-3 text-xs sm:text-sm">
          <div className="p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05]">
            <strong className="text-[#252B35] dark:text-[#E8E9EC] block mb-1">
              RQ1: Execution Speedup vs Blanket Heuristics
            </strong>
            <span className="text-[#6E7681] dark:text-[#9A9FA8]">
              Can an LLM inspect unoptimized LLVM IR and identify bottleneck-targeted pass sequences that outperform standard <code>-O2</code> or <code>-O3</code> pipelines in runtime throughput?
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05]">
            <strong className="text-[#252B35] dark:text-[#E8E9EC] block mb-1">
              RQ2: The Compilation Overhead Equation
            </strong>
            <span className="text-[#6E7681] dark:text-[#9A9FA8]">
              Does the latency introduced by LLM API inference and pass synthesis outweigh the performance benefits in iterative builds versus high-frequency batch deployment?
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05]">
            <strong className="text-[#252B35] dark:text-[#E8E9EC] block mb-1">
              RQ3: Verification & Hallucination Mitigation
            </strong>
            <span className="text-[#6E7681] dark:text-[#9A9FA8]">
              How can automated pass validation against the target LLVM catalog eliminate invalid or deprecated flags, and how does differential output hashing guarantee program semantic equivalence?
            </span>
          </div>
        </div>
      </div>

      {/* Identified Research Gaps */}
      <div className="p-6 rounded-2xl bg-white/70 dark:bg-[#171D29]/70 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.09] shadow-sm space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
          Identified Research Gaps
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05] space-y-1">
            <span className="font-semibold text-[#252B35] dark:text-[#E8E9EC] block">
              1. Non-Deterministic Pass Ordering
            </span>
            <p className="text-[#6E7681] dark:text-[#9A9FA8]">
              Small textual variations in source or prompts can lead to divergent pass orders, requiring robust reinforcement learning or temperature constraints.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05] space-y-1">
            <span className="font-semibold text-[#252B35] dark:text-[#E8E9EC] block">
              2. Target-Specific Microarchitectural Modeling
            </span>
            <p className="text-[#6E7681] dark:text-[#9A9FA8]">
              Current LLM approaches often reason over machine-independent IR, failing to model L1/L2 cache line sizes, AVX-512 vector register widths, or branch target buffers.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05] space-y-1">
            <span className="font-semibold text-[#252B35] dark:text-[#E8E9EC] block">
              3. Compile-Time Overhead vs ROI
            </span>
            <p className="text-[#6E7681] dark:text-[#9A9FA8]">
              While standard Clang completes in milliseconds, remote LLM queries introduce network round-trips. LLM guidance is best suited for release builds or ahead-of-time cloud compilation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05] space-y-1">
            <span className="font-semibold text-[#252B35] dark:text-[#E8E9EC] block">
              4. Code Correctness Guarantees
            </span>
            <p className="text-[#6E7681] dark:text-[#9A9FA8]">
              Unlike unverified code synthesis, recommending standard LLVM passes guarantees that internal LLVM verifiers enforce soundness, provided passes operate on valid SSA form.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
