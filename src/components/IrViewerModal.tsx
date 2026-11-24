import React, { useState } from 'react';
import {
  X,
  Copy,
  Sparkles,
  FileCode,
  Search
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
      setAiDiffExplanation('Failed to analyze blueprint difference.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#141413]/55">
      <div className="relative w-full max-w-5xl h-[92vh] sm:h-[85vh] rounded-[24px] bg-[#FAF9F5] border-2 border-[#D9D6CA] flex flex-col overflow-hidden text-xs">
        {/* Modal Top Header */}
        <div className="px-4 sm:px-6 py-4 border-b-2 border-[#D9D6CA] bg-[#F0EEE6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center justify-between gap-3 w-full sm:w-auto">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#FAF9F5] border-2 border-[#D9D6CA] flex items-center justify-center text-[#B5532F] shrink-0">
                <FileCode className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-serif text-lg font-medium text-[#141413] tracking-tight">
                  Code Blueprint Inspector
                </h3>
                <p className="text-[11px] text-[#5E5D57]">
                  Compare the internal blueprints created by the Standard and AI compilers
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              title="Close inspector"
              className="sm:hidden w-8 h-8 rounded-full bg-[#FAF9F5] border-2 border-[#D9D6CA] flex items-center justify-center text-[#141413] cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={handleAnalyzeDiffWithGemini}
              disabled={isAnalyzing}
              className="flex-1 sm:flex-initial justify-center flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#D97757] text-[#141413] font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{isAnalyzing ? 'Comparing blueprints...' : 'Explain Differences with AI'}</span>
            </button>

            <button
              onClick={onClose}
              title="Close inspector"
              className="hidden sm:flex w-8 h-8 rounded-full bg-[#FAF9F5] border-2 border-[#D9D6CA] items-center justify-center text-[#141413] hover:border-[#141413] cursor-pointer transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AI Diff Summary if requested */}
        {aiDiffExplanation && (
          <div className="px-6 py-3.5 bg-[#141413] text-[#FAF9F5] border-b-2 border-[#D9D6CA] text-xs flex items-start space-x-2.5">
            <Sparkles className="w-4 h-4 text-[#D97757] shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold text-[#D97757] uppercase tracking-[0.08em] text-[10px] block">
                AI Summary of Differences
              </span>
              <p className="mt-0.5 leading-relaxed text-[#C9C6BA]">{aiDiffExplanation}</p>
            </div>
            <button
              onClick={() => setAiDiffExplanation(null)}
              title="Dismiss summary"
              className="text-[#C9C6BA] hover:text-[#FAF9F5] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Sub-toolbar */}
        <div className="px-4 sm:px-6 py-3 border-b-2 border-[#D9D6CA] flex flex-col md:flex-row md:items-center justify-between gap-2.5 bg-[#FAF9F5]">
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-1 p-1 rounded-full bg-[#F0EEE6] border-2 border-[#D9D6CA] text-[11px] sm:text-xs w-full md:w-auto">
            <button
              onClick={() => setActiveTab('diff')}
              className={`flex-1 sm:flex-initial px-3.5 py-1 rounded-full font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'diff'
                  ? 'bg-[#D97757] text-[#141413]'
                  : 'text-[#5E5D57] hover:text-[#141413]'
              }`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setActiveTab('llm')}
              className={`flex-1 sm:flex-initial px-3.5 py-1 rounded-full font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'llm'
                  ? 'bg-[#D97757] text-[#141413]'
                  : 'text-[#5E5D57] hover:text-[#141413]'
              }`}
            >
              AI ({llmLines}L)
            </button>
            <button
              onClick={() => setActiveTab('traditional')}
              className={`flex-1 sm:flex-initial px-3.5 py-1 rounded-full font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'traditional'
                  ? 'bg-[#D97757] text-[#141413]'
                  : 'text-[#5E5D57] hover:text-[#141413]'
              }`}
            >
              Standard ({tradLines}L)
            </button>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-[#5E5D57] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search blueprint lines..."
              className="w-full pl-9 pr-3 py-1.5 rounded-full bg-[#F0EEE6] border-2 border-[#D9D6CA] text-[#141413] placeholder:text-[#5E5D57] text-xs focus:outline-none focus:border-[#141413]"
            />
          </div>
        </div>

        {/* Blueprint Viewer Code Surface */}
        <div className="flex-1 overflow-y-auto md:overflow-hidden p-3 sm:p-4 bg-[#FAF9F5]">
          {activeTab === 'diff' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              <div className="flex flex-col min-h-[240px] md:h-full rounded-[18px] bg-[#F0EEE6] border-2 border-[#D9D6CA] overflow-hidden">
                <div className="px-3.5 py-2 border-b border-[#D9D6CA] flex items-center justify-between gap-2 text-[11px] font-mono text-[#5E5D57]">
                  <span className="truncate font-semibold text-[#141413]">
                    Standard Blueprint • {tradLines} lines
                  </span>
                  <button
                    onClick={() => handleCopy(traditionalIR)}
                    title="Copy standard blueprint"
                    className="hover:text-[#141413] cursor-pointer shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <pre className="flex-1 p-3.5 font-mono text-[11px] leading-5 overflow-auto text-[#141413] whitespace-pre">
                  {filterLines(traditionalIR) || '; No blueprint available yet'}
                </pre>
              </div>

              <div className="flex flex-col min-h-[240px] md:h-full rounded-[18px] bg-[#F0EEE6] border-2 border-[#D9D6CA] overflow-hidden">
                <div className="px-3.5 py-2 border-b border-[#D9D6CA] flex items-center justify-between gap-2 text-[11px] font-mono text-[#B5532F] font-semibold">
                  <span className="truncate">
                    AI Blueprint ({passesApplied.join(', ')}) • {llmLines} lines
                  </span>
                  <button
                    onClick={() => handleCopy(llmOptimizedIR)}
                    title="Copy AI-tuned blueprint"
                    className="text-[#5E5D57] hover:text-[#141413] cursor-pointer shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <pre className="flex-1 p-3.5 font-mono text-[11px] leading-5 overflow-auto text-[#141413] whitespace-pre">
                  {filterLines(llmOptimizedIR) || '; No blueprint available yet'}
                </pre>
              </div>
            </div>
          ) : activeTab === 'llm' ? (
            <div className="h-full rounded-[18px] bg-[#F0EEE6] border-2 border-[#D9D6CA] p-4 font-mono text-[11.5px] leading-5 overflow-auto text-[#141413] whitespace-pre">
              {filterLines(llmOptimizedIR)}
            </div>
          ) : (
            <div className="h-full rounded-[18px] bg-[#F0EEE6] border-2 border-[#D9D6CA] p-4 font-mono text-[11.5px] leading-5 overflow-auto text-[#141413] whitespace-pre">
              {filterLines(traditionalIR)}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-2.5 border-t-2 border-[#D9D6CA] bg-[#F0EEE6] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#5E5D57]">
          <span>{copied ? 'Copied to clipboard' : 'Target Platform: Linux 64-bit'}</span>
          <span>
            Size Difference: {Math.abs(tradLines - llmLines)} lines {llmLines < tradLines ? 'shorter' : 'longer'}
          </span>
        </div>
      </div>
    </div>
  );
};
