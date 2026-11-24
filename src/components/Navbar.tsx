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
    <header className="sticky top-0 z-40 w-full transition-colors duration-300 px-3 sm:px-6 lg:px-8 pt-3 pb-2 pointer-events-none">
      <div className="max-w-7xl mx-auto apple-glass rounded-2xl px-3.5 sm:px-4 py-2.5 md:py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 pointer-events-auto">
        {/* Top Row (Mobile: Logo + Settings | Desktop: Left Logo) */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-white text-black shadow-sm shrink-0">
              <Cpu className="w-3.5 h-3.5" />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xs sm:text-sm tracking-tight text-[#F5F5F7] truncate">
                  Compiler Optimization Lab
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-white/[0.08] text-zinc-200 shrink-0">
                  C / C++
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-medium leading-none hidden lg:inline">
                Compare Normal vs. AI Optimization
              </span>
            </div>
          </div>

          {/* Mobile Settings Button */}
          <button
            onClick={onOpenSettings}
            aria-label="Test & Compiler Settings"
            title="Test & Compiler Settings"
            className="md:hidden w-8 h-8 rounded-xl flex items-center justify-center text-zinc-200 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer shrink-0"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Responsive Segmented Navigation Pill */}
        <nav
          aria-label="Primary Navigation"
          className="grid grid-cols-2 sm:flex sm:items-center gap-1 p-1 rounded-xl bg-white/[0.06] border border-white/[0.08] w-full md:w-auto"
        >
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex items-center justify-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 md:py-1 rounded-lg text-[11px] sm:text-xs transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-zinc-800 text-white shadow-sm font-bold border border-white/[0.08]'
                    : 'text-zinc-300 hover:text-white font-medium'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'opacity-70'}`} />
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
            className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-200 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

