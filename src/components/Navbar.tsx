import React from 'react';
import {
  Cpu,
  Layers,
  Clock,
  BookOpen,
  Settings,
} from 'lucide-react';
import { SystemStatus, ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  systemStatus: SystemStatus | null;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSettings,
}) => {
  const navTabs = [
    { id: 'lab', label: 'Compilers', icon: Cpu },
    { id: 'benchmarks', label: 'Code Presets', icon: Layers },
    { id: 'history', label: 'Past Runs', icon: Clock },
    { id: 'theory', label: 'Research Paper', icon: BookOpen },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F0EEE6] border-b-2 border-[#D9D6CA]">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Top Row (Mobile: Logo + Settings | Desktop: Left Logo) */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <button
            onClick={() => setActiveTab('lab')}
            className="flex items-center space-x-3 min-w-0 text-left cursor-pointer group"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#141413] text-[#FAF9F5] shrink-0 transition-transform duration-200 group-hover:scale-105">
              <Cpu className="w-4 h-4" />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-serif text-base sm:text-lg font-medium tracking-tight text-[#141413] truncate">
                  Compiler Optimization Lab
                </span>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#FAF9F5] border border-[#D9D6CA] text-[#B5532F] shrink-0">
                  C / C++
                </span>
              </div>
              <span className="text-[11px] text-[#5E5D57] leading-none hidden lg:inline mt-0.5">
                Standard vs. AI-Guided Optimization
              </span>
            </div>
          </button>

          {/* Mobile Settings Button */}
          <button
            onClick={onOpenSettings}
            aria-label="Test & Compiler Settings"
            title="Test & Compiler Settings"
            className="md:hidden w-9 h-9 rounded-full bg-[#FAF9F5] border-2 border-[#D9D6CA] flex items-center justify-center text-[#141413] hover:border-[#141413] transition-colors cursor-pointer shrink-0"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Cream Pill Navigation */}
        <nav
          aria-label="Primary Navigation"
          className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 p-1.5 rounded-2xl sm:rounded-full bg-[#FAF9F5] border-2 border-[#D9D6CA] w-full md:w-auto"
        >
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex items-center justify-center space-x-1.5 px-3 sm:px-4 py-2 sm:py-1.5 rounded-full text-xs transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#D97757] text-[#141413] font-semibold'
                    : 'text-[#5E5D57] hover:text-[#141413] font-medium'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Desktop Right: Settings Control */}
        <div className="hidden md:flex items-center space-x-2 shrink-0">
          <button
            onClick={onOpenSettings}
            aria-label="Test & Compiler Settings"
            title="Test & Compiler Settings"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF9F5] border-2 border-[#D9D6CA] text-xs font-semibold text-[#141413] hover:border-[#141413] transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};
