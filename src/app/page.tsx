'use client';

import { useState, useEffect } from 'react';
import { Brain, MessageSquare, X } from 'lucide-react';
import { clsx } from 'clsx';
import { LeftPanel } from '@/components/LeftPanel';
import { Workspace } from '@/components/Workspace';
import { SettingsModal } from '@/components/shared/Settings';
import { SoulPanel, MemoryPanel, EvolutionPanel } from '@/components/EvoClaw';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useWorkspaceStore } from '@/store';

type EvoTab = 'soul' | 'memory' | 'evolution';

export default function HomePage() {
  const { isSettingsOpen, toggleSettings } = useWorkspaceStore();
  const [showEvoPanel, setShowEvoPanel] = useState(true);
  const [evoTab, setEvoTab] = useState<EvoTab>('soul');

  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <main className="h-screen w-full flex bg-oh-bg text-oh-text overflow-hidden">
      {/* Left Panel - Chat & Controls */}
      <LeftPanel />

      {/* EvoClaw Panel - Soul & Memory */}
      {showEvoPanel && (
        <div className="w-[380px] flex flex-col border-r border-oh-border bg-oh-panel z-10">
          {/* EvoClaw Tab Bar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-oh-border bg-oh-surface">
            <div className="flex items-center gap-2">
              <Brain size={16} className="text-purple-400" />
              <span className="text-sm font-medium">EvoClaw</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setEvoTab('soul')}
                className={clsx(
                  'px-2 py-1 text-xs rounded transition-colors',
                  evoTab === 'soul' ? 'bg-purple-500/20 text-purple-400' : 'text-gray-400 hover:bg-oh-hover'
                )}
              >
                Soul
              </button>
              <button
                onClick={() => setEvoTab('memory')}
                className={clsx(
                  'px-2 py-1 text-xs rounded transition-colors',
                  evoTab === 'memory' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:bg-oh-hover'
                )}
              >
                Memory
              </button>
              <button
                onClick={() => setEvoTab('evolution')}
                className={clsx(
                  'px-2 py-1 text-xs rounded transition-colors',
                  evoTab === 'evolution' ? 'bg-green-500/20 text-green-400' : 'text-gray-400 hover:bg-oh-hover'
                )}
              >
                Evolution
              </button>
            </div>
            <button
              onClick={() => setShowEvoPanel(false)}
              className="p-1 text-gray-400 hover:text-oh-text rounded hover:bg-oh-hover transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* EvoClaw Content */}
          <div className="flex-1 overflow-hidden">
            {evoTab === 'soul' && <SoulPanel />}
            {evoTab === 'memory' && <MemoryPanel />}
            {evoTab === 'evolution' && <EvolutionPanel />}
          </div>
        </div>
      )}

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* EvoClaw Toggle Button */}
        {!showEvoPanel && (
          <button
            onClick={() => setShowEvoPanel(true)}
            className="absolute left-[420px] top-4 z-20 flex items-center gap-2 px-3 py-2 bg-oh-surface border border-oh-border rounded-lg text-sm text-gray-400 hover:text-oh-text hover:border-purple-500/50 transition-all shadow-lg"
          >
            <Brain size={16} className="text-purple-400" />
            EvoClaw
          </button>
        )}
        <Workspace />
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={toggleSettings} />
    </main>
  );
}
