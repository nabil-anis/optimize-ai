import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Sparkles,
  FileCode,
  ArrowRightLeft,
  Search,
  ExternalLink
} from 'lucide-react';

interface IrViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  traditionalIR: string;
  llmOptimizedIR: string;
  passesApplied: string[];
}

export const IrViewerModal: React.FC<IrViewerModalProps> = ({
  isOpen,
  onClose,
  traditionalIR,
  llmOptimizedIR,
  passesApplied,
}) => {
  const [activeTab, setActiveTab] = useState<'traditional' | 'llm' | 'diff'>('diff');
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [aiDiffExplanation, setAiDiffExplanation] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAnalyzeDiffWithGemini = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-ir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          traditionalIR,
          llmOptimizedIR,
          passes: passesApplied,
        }),
      });
      const data = await res.json();
      setAiDiffExplanation(data.diffExplanation || 'Analysis complete.');
    } catch {
      setAiDiffExplanation('Failed to analyze IR difference with Gemini.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filterLines = (code: string) => {
    if (!searchTerm) return code;
    return code
      .split('\n')
      .filter((line) => line.toLowerCase().includes(searchTerm.toLowerCase()))
      .join('\n');
  };

  const tradLines = traditionalIR ? traditionalIR.split('\n').length : 0;
  const llmLines = llmOptimizedIR ? llmOptimizedIR.split('\n').length : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-md transition-opacity">
      <div className="relative w-full max-w-5xl h-[92vh] sm:h-[85vh] rounded-3xl apple-glass shadow-2xl flex flex-col overflow-hidden text-xs">
        {/* Modal Top Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center justify-between gap-3 w-full sm:w-auto">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-8 h-8 rounded-xl apple-glass-pill flex items-center justify-center text-zinc-900 dark:text-white shrink-0">
                <FileCode className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white tracking-tight">
                  Code Blueprint Inspector
                </h3>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                  Compare the internal step-by-step blueprints created by the Standard and AI compilers
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              title="Close inspector"
              className="sm:hidden w-7 h-7 rounded-full apple-glass-pill flex items-center justify-center text-zinc-600 hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {/* AI Diff Button */}
            <button
              onClick={handleAnalyzeDiffWithGemini}
              disabled={isAnalyzing}
              title="Ask AI to summarize what changed between the two blueprints"
              className="flex-1 sm:flex-initial justify-center flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold transition-opacity cursor-pointer shadow-sm hover:opacity-90"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{isAnalyzing ? 'Comparing blueprints...' : 'Explain Differences with AI'}</span>
            </button>

            {/* Desktop Close Button */}
            <button
              onClick={onClose}
              title="Close inspector"
              className="hidden sm:flex w-7 h-7 rounded-full apple-glass-pill items-center justify-center text-zinc-600 hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AI Diff Summary if requested */}
        {aiDiffExplanation && (
          <div className="px-6 py-3 bg-black/[0.02] dark:bg-white/[0.03] border-b border-black/[0.06] dark:border-white/[0.08] text-xs text-zinc-800 dark:text-zinc-200 flex items-start space-x-2.5">
            <Sparkles className="w-4 h-4 text-zinc-900 dark:text-white shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold text-zinc-900 dark:text-white uppercase tracking-wider text-[10px] block">
                AI Summary of Differences:
              </span>
              <p className="mt-0.5 leading-relaxed">{aiDiffExplanation}</p>
            </div>
            <button
              onClick={() => setAiDiffExplanation(null)}
              title="Dismiss summary"
              className="text-zinc-600 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Sub-toolbar: Tab selection & Search */}
        <div className="px-4 sm:px-6 py-2.5 border-b border-black/[0.04] dark:border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          {/* Segmented Tab */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-0.5 p-0.5 rounded-xl apple-glass-pill text-[11px] sm:text-xs w-full md:w-auto">
            <button
              onClick={() => setActiveTab('diff')}
              className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'diff'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setActiveTab('llm')}
              className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'llm'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              AI ({llmLines}L)
            </button>
            <button
              onClick={() => setActiveTab('traditional')}
              className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'traditional'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Standard ({tradLines}L)
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search blueprint lines..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl apple-glass-pill text-zinc-900 dark:text-white placeholder:text-zinc-500 text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Blueprint Viewer Code Surface */}
        <div className="flex-1 overflow-y-auto md:overflow-hidden p-3 sm:p-4">
          {activeTab === 'diff' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 h-full">
              {/* Standard Blueprint Column */}
              <div className="flex flex-col min-h-[240px] md:h-full rounded-2xl apple-glass-pill overflow-hidden">
                <div className="px-3 py-2 border-b border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between gap-2 text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
                  <span className="truncate">Standard Blueprint • {tradLines} lines</span>
                  <button
                    onClick={() => handleCopy(traditionalIR)}
                    title="Copy standard blueprint"
                    className="hover:text-zinc-900 dark:hover:text-white cursor-pointer shrink-0"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <pre className="flex-1 p-3 font-mono text-[11px] leading-5 overflow-auto text-zinc-800 dark:text-zinc-200 whitespace-pre">
                  {filterLines(traditionalIR) || '; No blueprint available yet'}
                </pre>
              </div>

              {/* AI-Tuned Blueprint Column */}
              <div className="flex flex-col min-h-[240px] md:h-full rounded-2xl apple-glass-pill overflow-hidden">
                <div className="px-3 py-2 border-b border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between gap-2 text-[11px] font-mono text-zinc-900 dark:text-white font-semibold">
                  <span className="truncate">AI Blueprint ({passesApplied.join(', ')}) • {llmLines} lines</span>
                  <button
                    onClick={() => handleCopy(llmOptimizedIR)}
                    title="Copy AI-tuned blueprint"
                    className="hover:text-zinc-900 dark:hover:text-white cursor-pointer shrink-0"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <pre className="flex-1 p-3 font-mono text-[11px] leading-5 overflow-auto text-zinc-800 dark:text-zinc-200 whitespace-pre">
                  {filterLines(llmOptimizedIR) || '; No blueprint available yet'}
                </pre>
              </div>
            </div>
          ) : activeTab === 'llm' ? (
            <div className="h-full rounded-2xl apple-glass-pill p-4 font-mono text-[11.5px] leading-5 overflow-auto text-zinc-800 dark:text-zinc-200 whitespace-pre">
              {filterLines(llmOptimizedIR)}
            </div>
          ) : (
            <div className="h-full rounded-2xl apple-glass-pill p-4 font-mono text-[11.5px] leading-5 overflow-auto text-zinc-800 dark:text-zinc-200 whitespace-pre">
              {filterLines(traditionalIR)}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-2.5 border-t border-black/[0.06] dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
          <span>Target Platform: Linux 64-bit</span>
          <span>Size Difference: {Math.abs(tradLines - llmLines)} lines {llmLines < tradLines ? 'shorter' : 'longer'}</span>
        </div>
      </div>
    </div>
  );
};
