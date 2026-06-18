'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Paperclip, ArrowUp, Square } from 'lucide-react';
import { clsx } from 'clsx';
import { useChat } from '@/hooks/useChat';

export function MessageInput() {
  const [inputText, setInputText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, stopAgent, isAgentRunning } = useChat();

  const handleSubmit = useCallback(() => {
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  }, [inputText, sendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputText(e.target.value);
      // Auto-resize textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(
          textareaRef.current.scrollHeight,
          200
        )}px`;
      }
    },
    []
  );

  // Keyboard shortcut: Ctrl/Cmd + Enter to send
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleSubmit]);

  return (
    <div className="p-4 bg-oh-panel border-t border-oh-border">
      <div
        className={clsx(
          'relative flex flex-col bg-oh-surface border rounded-xl transition-all overflow-hidden',
          isFocused ? 'border-blue-500 ring-1 ring-blue-500' : 'border-oh-hover'
        )}
      >
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Ketik pesan untuk agen... (Enter untuk kirim, Shift+Enter untuk baris baru)"
          disabled={isAgentRunning}
          className="w-full bg-transparent text-oh-text-bright text-sm p-3 min-h-[80px] max-h-[200px] resize-none focus:outline-none custom-scrollbar disabled:opacity-50"
          rows={3}
        />

        <div className="flex items-center justify-between p-2 bg-oh-panel border-t border-oh-hover">
          <div className="flex items-center gap-2">
            <button
              className="text-gray-400 hover:text-oh-text-bright p-1.5 rounded-lg hover:bg-oh-hover transition-colors"
              title="Attach file (coming soon)"
              disabled
            >
              <Paperclip size={16} />
            </button>
            <span className="text-xs text-gray-500 hidden sm:block">
              {isAgentRunning ? 'Agent sedang berjalan...' : 'Tekan Enter untuk kirim'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isAgentRunning ? (
              <button
                onClick={stopAgent}
                className="flex items-center gap-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              >
                <Square size={12} fill="currentColor" />
                Stop
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!inputText.trim()}
                className={clsx(
                  'p-2 rounded-lg transition-colors',
                  inputText.trim()
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-oh-hover text-gray-500 cursor-not-allowed'
                )}
              >
                <ArrowUp size={18} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
