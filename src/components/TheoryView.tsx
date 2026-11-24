import React, { useState } from 'react';
import {
  BookOpen,
  Workflow,
  Sparkles,
  Cpu,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Zap,
  HelpCircle
} from 'lucide-react';

export const TheoryView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'paper' | 'architecture'>('paper');

  return (
    <div className="w-full space-y-6 max-w-5xl mx-auto">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.08] dark:border-white/[0.08] pb-4">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider font-bold text-zinc-400">
            Research Paper & Foundation
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F5F5F7] mt-0.5">
            Compiler Optimization Research Paper
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1">
            Comparing standard compiler optimization against AI-guided optimization — core findings, research questions, and open gaps.
          </p>
        </div>

        {/* Segmented Pill */}
        <div className="grid grid-cols-2 sm:flex items-center p-1 rounded-xl apple-glass-pill text-xs w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab('paper')}
            className={`flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeSubTab === 'paper'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span>Research Paper</span>
          </button>
          <button
            onClick={() => setActiveSubTab('architecture')}
            className={`flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeSubTab === 'architecture'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            <Workflow className="w-3.5 h-3.5 shrink-0" />
            <span>Step-by-Step Flow</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: RESEARCH PAPER */}
      {activeSubTab === 'paper' && (
        <div className="space-y-6">
          {/* Paper Header & Abstract Card */}
          <div className="p-5 sm:p-7 rounded-3xl apple-glass space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase font-bold bg-white text-black">
                Research Paper Foundation
              </span>
              <span className="text-zinc-500">•</span>
              <span className="text-xs font-semibold text-zinc-300">
                Compiler Construction Laboratory
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5F5F7] leading-tight">
              A Comparative Analysis of Large Language Model Approaches for Compiler Optimization: Identifying Research Gaps and Future Directions
            </h2>

            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-zinc-400 block">
                Abstract
              </span>
              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                Standard compilers rely on fixed checklists of over 120 optimization rules developed over decades. While presets like <code>-O2</code> and <code>-O3</code> deliver solid general performance, they run every check blindly on every program—wasting optimization time on rules that find nothing to improve and struggling to choose the ideal order of steps. Large Language Models (LLMs) introduce a smarter paradigm: reading the program blueprint first to recommend a short, targeted sequence of only the speedup tools that matter. This platform empirically compares both approaches across optimization time, app run speed, file size, and verified output correctness.
              </p>
            </div>
          </div>

          {/* 3 Core Research Questions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl apple-glass space-y-2">
              <span className="font-mono text-[10px] uppercase font-bold text-zinc-400 block">
                Research Question 01
              </span>
              <h3 className="font-bold text-sm text-[#F5F5F7]">
                App Speed vs. Fixed Checklists
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Can an AI inspect an unoptimized code blueprint and pick a targeted sequence of speedup tools that matches or beats standard <code>-O2</code> and <code>-O3</code> run speeds?
              </p>
            </div>

            <div className="p-5 rounded-2xl apple-glass space-y-2">
              <span className="font-mono text-[10px] uppercase font-bold text-zinc-400 block">
                Research Question 02
              </span>
              <h3 className="font-bold text-sm text-[#F5F5F7]">
                Optimization Speed & Trade-Offs
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                How much optimization time is saved by skipping 110+ unnecessary checks, and when does AI guidance deliver the highest return for rapid development versus release builds?
              </p>
            </div>

            <div className="p-5 rounded-2xl apple-glass space-y-2">
              <span className="font-mono text-[10px] uppercase font-bold text-zinc-400 block">
                Research Question 03
              </span>
              <h3 className="font-bold text-sm text-[#F5F5F7]">
                Safety & Output Verification
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                How does checking AI suggestions against an approved tool list prevent invalid commands, and how does side-by-side output verification guarantee identical program behavior?
              </p>
            </div>
          </div>

          {/* Identified Research Gaps */}
          <div className="p-4 sm:p-6 rounded-3xl apple-glass space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
              Identified Research Gaps & Future Directions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1.5">
                <span className="font-bold text-[#F5F5F7] block">
                  1. Consistent Step Ordering
                </span>
                <p className="text-zinc-300 leading-relaxed">
                  Small wording changes in code or prompts can cause an AI to suggest slightly different step orders, highlighting the need for stricter consistency controls and feedback loops.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1.5">
                <span className="font-bold text-[#F5F5F7] block">
                  2. Hardware-Specific Awareness
                </span>
                <p className="text-zinc-300 leading-relaxed">
                  AI models typically inspect hardware-independent blueprints without knowing exact processor cache sizes or specialized hardware instructions on the target machine.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1.5">
                <span className="font-bold text-[#F5F5F7] block">
                  3. Cloud Latency vs. Build Speed
                </span>
                <p className="text-zinc-300 leading-relaxed">
                  While local compilers finish in milliseconds, remote AI queries add network round-trip time—making local lightweight models or release-build optimization the ideal deployment target.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1.5">
                <span className="font-bold text-[#F5F5F7] block">
                  4. Built-In Correctness Guarantees
                </span>
                <p className="text-zinc-300 leading-relaxed">
                  Instead of rewriting raw code from scratch (which risks bugs), having the AI choose from proven compiler speedup tools preserves built-in compiler safety checks.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: STEP-BY-STEP FLOW */}
      {activeSubTab === 'architecture' && (
        <div className="space-y-6">
          {/* Side-by-Side Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Standard Pipeline */}
            <div className="p-4 sm:p-6 rounded-3xl apple-glass space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/[0.08] flex items-center justify-center shrink-0">
                  <Cpu className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F5F5F7]">
                    Standard Compiler (Clang -O2)
                  </h3>
                  <p className="text-[11px] font-medium text-zinc-400">
                    Runs 120+ fixed checks on every piece of code
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { step: '1. Lexical Analysis (Scanner)', desc: 'Reads C/C++ text and groups characters into words and symbols.' },
                  { step: '2. Syntax Analysis (Parser)', desc: 'Checks grammar rules and builds the program structure tree.' },
                  { step: '3. Semantic Analysis', desc: 'Verifies data types and variable meanings.' },
                  { step: '4. Intermediate Code Generation', desc: 'Converts code into a universal internal blueprint.' },
                  { step: '5. Code Optimization', desc: 'Runs 120+ fixed checks in sequence, even when 90% find nothing to improve.' },
                  { step: '6. Target Code Generation', desc: 'Translates the blueprint into runnable CPU instructions.' },
                ].map((s, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                    <span className="font-bold text-[11px] text-[#F5F5F7] block">
                      {s.step}
                    </span>
                    <span className="text-[11px] text-zinc-300 block mt-0.5">
                      {s.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI-Assisted Pipeline */}
            <div className="p-4 sm:p-6 rounded-3xl apple-glass space-y-4 border-2 border-white">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-white text-zinc-950 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F5F5F7]">
                    AI-Assisted Compiler
                  </h3>
                  <p className="text-[11px] font-medium text-zinc-400">
                    Diagnoses first, then runs only the 7 targeted checks
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { step: '1. Lexical Analysis (Scanner)', desc: 'Reads C/C++ text and groups characters into words and symbols.' },
                  { step: '2. Syntax Analysis (Parser)', desc: 'Checks grammar rules and builds the program structure tree.' },
                  { step: '3. Semantic Analysis', desc: 'Verifies data types and variable meanings.' },
                  { step: '4. Intermediate Code Generation', desc: 'Converts code into a universal internal blueprint.' },
                  { step: '5. Code Optimization (AI-Guided)', desc: 'AI diagnoses loops and math to pick ~7 targeted tools, skipping 113 useless checks.' },
                  { step: '6. Target Code Generation', desc: 'Translates the optimized blueprint and verifies 100% identical output.' },
                ].map((s, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                    <span className="font-bold text-[11px] text-[#F5F5F7] block">
                      {s.step}
                    </span>
                    <span className="text-[11px] text-zinc-300 block mt-0.5">
                      {s.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Everyday Analogy Card */}
          <div className="p-4 sm:p-6 rounded-3xl apple-glass space-y-3">
            <h3 className="text-sm font-bold text-[#F5F5F7] flex items-center">
              <Workflow className="w-4 h-4 mr-2 text-zinc-200 shrink-0" />
              The Everyday Analogy: Why the Order of Steps Matters
            </h3>
            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
              Think of optimizing code like doing chores: washing, ironing, and packing clothes.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="font-bold text-white block mb-1">
                  Wrong Order (Wasted Effort)
                </span>
                <p className="text-zinc-300">
                  If you iron clothes before washing them, washing wrinkles them again, and all the ironing time was completely wasted.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="font-bold text-white block mb-1">
                  Smart AI Order (Maximum Efficiency)
                </span>
                <p className="text-zinc-300">
                  AI understands cause and effect. It washes first, irons next, and packs last, ensuring no step ever needs to be repeated.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

