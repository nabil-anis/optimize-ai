import React from 'react';
import {
  Cpu,
  Layers,
  Clock,
  BookOpen,
  Settings,
  Sun,
  Moon,
  Sparkles,
  Box,
  CheckCircle2,
  AlertCircle,
  Sliders
} from 'lucide-react';
import { SystemStatus, ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDark: boolean;
  setIsDark: (val: boolean | ((prev: boolean) => boolean)) => void;
  systemStatus: SystemStatus | null;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  setIsDark,
  systemStatus,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-300 px-4 sm:px-6 lg:px-8 pt-3 pb-2 pointer-events-none">
      <div className="max-w-7xl mx-auto h-13 apple-glass rounded-2xl px-4 flex items-center justify-between pointer-events-auto">
        {/* Left: Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-black dark:bg-white text-white dark:text-black shadow-sm">
            <Cpu className="w-3.5 h-3.5" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-xs sm:text-sm tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
                Compiler Optimization Lab
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-full text-[9px] font-mono font-medium bg-black/[0.04] dark:bg-white/[0.08] text-zinc-600 dark:text-zinc-300">
                LLVM / Clang
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-normal leading-none hidden md:inline">
              Measure. Optimize. Compare.
            </span>
          </div>
        </div>

        {/* Center: Apple-style segmented navigation pill */}
        <nav className="flex items-center p-1 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.03] dark:border-white/[0.05]">
          {[
            { id: 'lab', label: 'Studio', icon: Cpu },
            { id: 'benchmarks', label: 'Presets', icon: Layers },
            { id: 'history', label: 'History', icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex items-center space-x-1.5 px-3.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm font-semibold'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black dark:text-white' : 'opacity-70'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Theme & Settings Controls */}
        <div className="flex items-center space-x-2">

          {/* Theme Switcher */}
          <button
            onClick={() => setIsDark((prev) => !prev)}
            aria-label="Toggle theme"
            title={isDark ? 'Switch to Apple Light Mode (Ash White)' : 'Switch to Apple Dark Mode (Black)'}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-black" />}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            aria-label="Lab Settings"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
