import React, { useState } from 'react';
import {
  BookOpen,
  Workflow,
  Sparkles,
  Cpu,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const TheoryView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'paper' | 'architecture'>('paper');
  const [showAbstract, setShowAbstract] = useState<boolean>(false);
  const [openGapIdx, setOpenGapIdx] = useState<number | null>(0);

  const researchGaps = [
    {
      title: 'Consistent Step Ordering',
      summary: 'Small prompt or code phrasing changes can shift the AI pass sequence.',
      detail:
        'Reproducible compiler pipelines require tighter determinism, temperature constraints, and feedback loops so equivalent inputs yield reliable optimization plans.',
    },
    {
      title: 'Hardware-Specific Awareness',
      summary: 'Hardware-independent blueprints omit cache sizes and vector widths.',
      detail:
        'AI models typically inspect portable intermediate blueprints without knowing exact CPU cache boundaries or target instruction sets on the final device.',
    },
    {
      title: 'Cloud Latency vs. Build Speed',
      summary: 'Remote AI calls add round-trip delay compared to local C++ builds.',
      detail:
        'While local compilers finish in milliseconds, network AI queries add latency—making lightweight local models or release builds the sweet spot.',
    },
    {
      title: 'Built-In Correctness Guarantees',
      summary: 'Choosing safe compiler passes avoids bugs from raw code rewrites.',
      detail:
        'Instead of rewriting raw C/C++ directly, restricting the AI to verified compiler tools preserves built-in safety checks and identical output.',
    },
  ];

  return (
    <div className="w-full space-y-10 animate-editorial-in">
      {/* Cream Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-[#D9D6CA] pb-6">
        <div className="space-y-2">
          <span className="text-xs uppercase font-semibold tracking-[0.08em] text-[#B5532F] block">
            Research Paper & Foundation
          </span>
          <h1 className="font-serif-display text-4xl sm:text-5xl text-[#141413]">
            Why AI compiler passes work
          </h1>
          <p className="text-sm sm:text-base text-[#5E5D57] max-w-xl">
            Core questions, identified gaps, and the 6-step architecture behind this lab.
          </p>
        </div>

        {/* Segmented Pill */}
        <div className="grid grid-cols-2 sm:flex items-center p-1.5 rounded-full bg-[#FAF9F5] border-2 border-[#D9D6CA] text-xs w-full sm:w-auto shrink-0">
          <button
            onClick={() => setActiveSubTab('paper')}
            className={`flex items-center justify-center space-x-1.5 px-4 py-1.5 rounded-full font-semibold transition-colors cursor-pointer ${
              activeSubTab === 'paper'
                ? 'bg-[#D97757] text-[#141413]'
                : 'text-[#5E5D57] hover:text-[#141413]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span>Research Paper</span>
          </button>
          <button
            onClick={() => setActiveSubTab('architecture')}
            className={`flex items-center justify-center space-x-1.5 px-4 py-1.5 rounded-full font-semibold transition-colors cursor-pointer ${
              activeSubTab === 'architecture'
                ? 'bg-[#D97757] text-[#141413]'
                : 'text-[#5E5D57] hover:text-[#141413]'
            }`}
          >
            <Workflow className="w-3.5 h-3.5 shrink-0" />
            <span>Step-by-Step Flow</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: RESEARCH PAPER */}
      {activeSubTab === 'paper' && (
        <div className="space-y-10">
          {/* Paper Title & Collapsible Abstract Card (Off-white #FAF9F5) */}
          <section className="p-6 sm:p-9 editorial-card space-y-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-[10.5px] uppercase font-semibold tracking-[0.08em] bg-[#D97757] text-[#141413]">
                Paper Foundation
              </span>
              <span className="text-xs font-medium text-[#5E5D57]">
                Compiler Construction Laboratory
              </span>
            </div>

            <h2 className="font-serif-display text-2xl sm:text-4xl text-[#141413] leading-[1.1]">
              A Comparative Analysis of Large Language Model Approaches for Compiler Optimization
            </h2>

            <p className="text-sm text-[#5E5D57] max-w-2xl">
              Identifying research gaps between fixed-schedule{' '}
              <code className="font-mono font-semibold text-[#B5532F]">-O2</code> checklists and LLM-guided pass selection.
            </p>

            {/* Accordion for Abstract so main view stays uncluttered */}
            <div className="rounded-[18px] bg-[#F0EEE6] border-2 border-[#D9D6CA] overflow-hidden">
              <button
                onClick={() => setShowAbstract(!showAbstract)}
                className="w-full px-5 py-3.5 flex items-center justify-between text-xs font-semibold text-[#141413] cursor-pointer"
              >
                <span className="uppercase tracking-[0.08em] text-[#B5532F]">
                  {showAbstract ? 'Hide Paper Abstract' : 'Read Full Abstract'}
                </span>
                {showAbstract ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showAbstract && (
                <div className="px-5 pb-5 pt-3 border-t border-[#D9D6CA] text-sm text-[#5E5D57] leading-relaxed animate-editorial-in">
                  Standard compilers rely on fixed checklists of over 120 optimization rules developed over decades. While presets like{' '}
                  <code className="font-mono font-semibold text-[#B5532F]">-O2</code> and{' '}
                  <code className="font-mono font-semibold text-[#B5532F]">-O3</code> deliver solid general performance, they run every check blindly on every program—wasting optimization time on rules that find nothing to improve and struggling to choose the ideal order of steps. Large Language Models (LLMs) introduce a smarter paradigm: reading the program blueprint first to recommend a short, targeted sequence of only the speedup tools that matter. This platform empirically compares both approaches across optimization time, app run speed, file size, and verified output correctness.
                </div>
              )}
            </div>
          </section>

          {/* Near-Black Section (#141413): 3 Core Research Questions with Big Coral Numbers */}
          <section className="rounded-[24px] bg-[#141413] text-[#FAF9F5] p-6 sm:p-10 space-y-6">
            <div className="space-y-1">
              <span className="text-xs uppercase font-semibold tracking-[0.08em] text-[#D97757] block">
                Three Core Questions
              </span>
              <h3 className="font-serif-display text-3xl sm:text-4xl text-[#FAF9F5]">
                What this experiment tests
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 border-t border-[#5E5D57]/50 pt-4">
                <div className="font-serif-display text-4xl text-[#D97757]">01</div>
                <h4 className="font-serif text-xl font-medium text-[#FAF9F5]">
                  Speed vs. Fixed Checklists
                </h4>
                <p className="text-xs sm:text-sm text-[#C9C6BA] leading-relaxed">
                  Can AI pick a short pass chain that matches or beats{' '}
                  <code className="font-mono font-semibold text-[#D97757]">-O2</code> and{' '}
                  <code className="font-mono font-semibold text-[#D97757]">-O3</code>?
                </p>
              </div>

              <div className="space-y-2 border-t border-[#5E5D57]/50 pt-4">
                <div className="font-serif-display text-4xl text-[#D97757]">02</div>
                <h4 className="font-serif text-xl font-medium text-[#FAF9F5]">
                  Time Saved per Build
                </h4>
                <p className="text-xs sm:text-sm text-[#C9C6BA] leading-relaxed">
                  How much compile time disappears when you skip 110+ irrelevant optimization rules?
                </p>
              </div>

              <div className="space-y-2 border-t border-[#5E5D57]/50 pt-4">
                <div className="font-serif-display text-4xl text-[#D97757]">03</div>
                <h4 className="font-serif text-xl font-medium text-[#FAF9F5]">
                  Verified Output Safety
                </h4>
                <p className="text-xs sm:text-sm text-[#C9C6BA] leading-relaxed">
                  Does restricting AI to an approved pass allowlist guarantee 100% identical outputs?
                </p>
              </div>
            </div>
          </section>

          {/* Coral Section (#D97757): Accordion Research Gaps */}
          <section className="rounded-[24px] bg-[#D97757] text-[#141413] p-6 sm:p-10 space-y-6">
            <div className="space-y-1">
              <span className="text-xs uppercase font-semibold tracking-[0.08em] text-[#141413] block">
                Open Challenges
              </span>
              <h3 className="font-serif-display text-3xl sm:text-4xl text-[#141413]">
                Identified research gaps
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {researchGaps.map((gap, idx) => {
                const isOpen = openGapIdx === idx;
                return (
                  <div
                    key={gap.title}
                    className="rounded-[20px] bg-[#FAF9F5] border-2 border-[#141413]/15 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenGapIdx(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-start justify-between gap-3 cursor-pointer"
                    >
                      <div className="space-y-1">
                        <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#B5532F] block">
                          Gap 0{idx + 1}
                        </span>
                        <h4 className="font-serif text-xl font-medium text-[#141413]">
                          {gap.title}
                        </h4>
                        <p className="text-xs text-[#5E5D57]">{gap.summary}</p>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#141413] shrink-0 mt-1" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#141413] shrink-0 mt-1" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-3 border-t border-[#D9D6CA] text-xs sm:text-sm text-[#5E5D57] leading-relaxed">
                        {gap.detail}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* SUBTAB 2: STEP-BY-STEP FLOW */}
      {activeSubTab === 'architecture' && (
        <div className="space-y-10">
          {/* Side-by-Side 6-Step Pipelines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Standard Pipeline */}
            <div className="p-6 editorial-card space-y-5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#F0EEE6] border-2 border-[#D9D6CA] flex items-center justify-center shrink-0">
                  <Cpu className="w-5 h-5 text-[#141413]" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium text-[#141413]">
                    Standard Compiler (-O2)
                  </h3>
                  <p className="text-xs text-[#5E5D57]">
                    Runs 120+ fixed checks on every file
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { step: '1. Lexical Analysis (Scanner)', desc: 'Groups characters into words and symbols.' },
                  { step: '2. Syntax Analysis (Parser)', desc: 'Checks grammar and builds the structure tree.' },
                  { step: '3. Semantic Analysis', desc: 'Verifies data types and variable meanings.' },
                  { step: '4. Intermediate Code Generation', desc: 'Converts code into a universal internal blueprint.' },
                  { step: '5. Code Optimization', desc: 'Runs 120+ fixed checks blindly in sequence.', focus: true },
                  { step: '6. Target Code Generation', desc: 'Translates blueprint into runnable CPU instructions.' },
                ].map((s, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-[16px] border-2 ${
                      s.focus
                        ? 'bg-[#141413] text-[#FAF9F5] border-[#141413]'
                        : 'bg-[#F0EEE6] border-[#D9D6CA]'
                    }`}
                  >
                    <span className={`font-semibold text-xs block ${s.focus ? 'text-[#D97757]' : 'text-[#141413]'}`}>
                      {s.step}
                    </span>
                    <span className={`text-xs block mt-0.5 ${s.focus ? 'text-[#C9C6BA]' : 'text-[#5E5D57]'}`}>
                      {s.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI-Assisted Pipeline */}
            <div className="p-6 editorial-card space-y-5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#D97757] text-[#141413] flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium text-[#141413]">
                    AI-Assisted Compiler
                  </h3>
                  <p className="text-xs text-[#5E5D57]">
                    Diagnoses first, then runs ~7 targeted checks
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { step: '1. Lexical Analysis (Scanner)', desc: 'Groups characters into words and symbols.' },
                  { step: '2. Syntax Analysis (Parser)', desc: 'Checks grammar and builds the structure tree.' },
                  { step: '3. Semantic Analysis', desc: 'Verifies data types and variable meanings.' },
                  { step: '4. Intermediate Code Generation', desc: 'Converts code into a universal internal blueprint.' },
                  { step: '5. Code Optimization (AI-Guided)', desc: 'AI spots slow loops and picks ~7 exact speedup tools.', focus: true },
                  { step: '6. Target Code Generation', desc: 'Generates final instructions and verifies output.' },
                ].map((s, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-[16px] border-2 ${
                      s.focus
                        ? 'bg-[#D97757] text-[#141413] border-[#141413]'
                        : 'bg-[#F0EEE6] border-[#D9D6CA]'
                    }`}
                  >
                    <span className="font-semibold text-xs text-[#141413] block">
                      {s.step}
                    </span>
                    <span className={`text-xs block mt-0.5 ${s.focus ? 'text-[#141413]' : 'text-[#5E5D57]'}`}>
                      {s.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Near-Black Everyday Analogy Band */}
          <section className="rounded-[24px] bg-[#141413] text-[#FAF9F5] p-6 sm:p-10 space-y-5">
            <div className="space-y-2">
              <span className="text-xs uppercase font-semibold tracking-[0.08em] text-[#D97757] block">
                Everyday Analogy
              </span>
              <h3 className="font-serif-display text-3xl sm:text-4xl text-[#FAF9F5]">
                Why the order of steps matters
              </h3>
              <p className="text-sm text-[#C9C6BA]">
                Think of optimizing code like doing laundry: washing, ironing, and packing clothes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-[20px] bg-[#FAF9F5] text-[#141413] space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#B5532F] block">
                  Wrong Order
                </span>
                <p className="text-sm text-[#5E5D57] leading-relaxed">
                  Ironing clothes before washing them wrinkles everything again—so the ironing work was completely wasted.
                </p>
              </div>

              <div className="p-5 rounded-[20px] bg-[#D97757] text-[#141413] space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#141413] block">
                  Smart AI Order
                </span>
                <p className="text-sm text-[#141413] leading-relaxed font-medium">
                  AI washes first, irons next, and packs last—so no optimization step ever needs to be repeated.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
