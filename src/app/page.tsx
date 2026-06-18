'use client';

import { useState, useEffect } from 'react';
import { LeftPanel } from '@/components/LeftPanel';
import { Workspace } from '@/components/Workspace';
import { SettingsModal } from '@/components/shared/Settings';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useWorkspaceStore } from '@/store';

export default function HomePage() {
  const { isSettingsOpen, toggleSettings } = useWorkspaceStore();
  
  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <main className="h-screen w-full flex bg-oh-bg text-oh-text overflow-hidden">
      {/* Left Panel - Chat & Controls */}
      <LeftPanel />

      {/* Main Workspace Area */}
      <Workspace />

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={toggleSettings} />
    </main>
  );
}
