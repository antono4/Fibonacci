'use client';

import { Settings } from 'lucide-react';
import { ChatArea } from './ChatArea';
import { MessageInput } from './MessageInput';
import { ModelSelector } from './ModelSelector';
import { useWorkspaceStore } from '@/store';

export function LeftPanel() {
  const { toggleSettings } = useWorkspaceStore();

  return (
    <div className="w-[420px] flex flex-col bg-oh-panel border-r border-oh-border flex-shrink-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
      {/* Header Aplikasi */}
      <div className="flex items-center justify-between p-4 border-b border-oh-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xs">OH</span>
          </div>
          <div>
            <span className="font-semibold text-oh-text-bright">OpenHands</span>
            <span className="text-xs text-gray-500 ml-2">v1.0</span>
          </div>
        </div>
        <button
          onClick={toggleSettings}
          className="text-gray-400 hover:text-oh-text-bright p-1.5 rounded-md hover:bg-oh-hover transition-colors"
          title="Settings"
        >
          <Settings size={18} />
        </button>
      </div>

      {/* Model Selector */}
      <ModelSelector />

      {/* Chat Area */}
      <ChatArea />

      {/* Message Input */}
      <MessageInput />
    </div>
  );
}
