'use client';

import { TabBar } from './TabBar';
import { TerminalWorkspace } from './Terminal';
import { EditorWorkspace } from './Editor';
import { BrowserPreview } from './BrowserPreview';
import { useWorkspaceStore } from '@/store';

export function Workspace() {
  const { activeTab } = useWorkspaceStore();

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-oh-surface">
      {/* Tab Bar */}
      <TabBar />

      {/* Workspace Content */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'terminal' && <TerminalWorkspace />}
        {activeTab === 'editor' && <EditorWorkspace />}
        {activeTab === 'browser' && <BrowserPreview />}
      </div>
    </div>
  );
}
