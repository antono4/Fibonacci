'use client';

import { Terminal, Code2, Globe } from 'lucide-react';
import { clsx } from 'clsx';
import { useWorkspaceStore } from '@/store';
import type { WorkspaceTab } from '@/types';

const TABS: { id: WorkspaceTab; label: string; icon: typeof Terminal }[] = [
  { id: 'terminal', label: 'Terminal', icon: Terminal },
  { id: 'editor', label: 'Code Editor', icon: Code2 },
  { id: 'browser', label: 'Browser', icon: Globe },
];

export function TabBar() {
  const { activeTab, setActiveTab } = useWorkspaceStore();

  return (
    <div className="flex bg-oh-panel border-b border-[#181A1F] overflow-x-auto select-none">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={clsx(
            'flex items-center gap-2 px-5 py-3 text-sm font-medium border-t-2 transition-all whitespace-nowrap',
            activeTab === tab.id
              ? 'bg-oh-surface text-white border-blue-500'
              : 'text-gray-400 border-transparent hover:bg-oh-surface/50 hover:text-gray-300'
          )}
        >
          <tab.icon size={16} />
          {tab.label}
        </button>
      ))}
    </div>
  );
}
