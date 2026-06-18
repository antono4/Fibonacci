'use client';

import { useEffect, useCallback } from 'react';
import { useWorkspaceStore } from '@/store';
import type { WorkspaceTab } from '@/types';

export function useKeyboardShortcuts() {
  const { setActiveTab, toggleSettings } = useWorkspaceStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore if typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Ctrl/Cmd + number to switch tabs
      if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '3') {
        e.preventDefault();
        const tabs: WorkspaceTab[] = ['terminal', 'editor', 'browser'];
        const tabIndex = parseInt(e.key) - 1;
        if (tabs[tabIndex]) {
          setActiveTab(tabs[tabIndex]);
        }
      }

      // Ctrl/Cmd + K for command palette / settings
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleSettings();
      }

      // Ctrl/Cmd + ` to focus terminal
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        setActiveTab('terminal');
      }
    },
    [setActiveTab, toggleSettings]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
