'use client';

import { clsx } from 'clsx';
import { FileCode, Loader2 } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { Scrollbar } from '@/components/shared/Scrollbar';
import type { Message } from '@/types';

export function ChatArea() {
  const { messages, isAgentRunning, chatEndRef } = useChat();

  return (
    <Scrollbar className="flex-1 p-4 space-y-4">
      {messages.map((msg, index) => (
        <MessageBubble key={msg.id} message={msg} index={index} />
      ))}
      {isAgentRunning && <TypingIndicator />}
      <div ref={chatEndRef} className="h-px" />
    </Scrollbar>
  );
}

function MessageBubble({ message, index }: { message: Message; index: number }) {
  const isNew = index === -1; // Could track new messages

  if (message.role === 'system') {
    return (
      <div className="animate-fade-in text-xs text-center text-gray-500 my-2 px-4 py-1 bg-oh-surface rounded-full self-center">
        {message.content}
      </div>
    );
  }

  if (message.role === 'user') {
    return (
      <div className="animate-slide-in bg-oh-surface border border-oh-hover rounded-lg p-3 text-sm text-oh-text-bright w-[90%] self-end">
        {message.content}
      </div>
    );
  }

  if (message.role === 'agent') {
    const isThought = message.type === 'thought';
    const isAction = message.type === 'action';

    return (
      <div
        className={clsx(
          'animate-fade-in text-sm w-[95%]',
          isThought
            ? 'bg-oh-panel border-l-2 border-yellow-500 text-gray-400 italic'
            : 'bg-oh-panel border border-oh-border text-oh-text',
          'p-3 rounded-r-lg rounded-bl-lg mt-2'
        )}
      >
        {isAction && message.actionType && (
          <div className="flex items-center gap-2 text-blue-400 mb-2 text-xs font-semibold not-italic">
            <FileCode size={12} />
            {message.actionType.toUpperCase()}
            {message.file && <span className="text-gray-400">- {message.file}</span>}
          </div>
        )}
        <span className={clsx(isThought && 'text-yellow-400/70')}>
          {message.content}
        </span>
      </div>
    );
  }

  return null;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 text-gray-400 text-sm animate-pulse">
      <Loader2 size={16} className="animate-spin" />
      <span>Agent sedang mengetik...</span>
    </div>
  );
}
