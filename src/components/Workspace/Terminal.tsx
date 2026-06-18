'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Plus, Trash2, Terminal as TerminalIcon } from 'lucide-react';
import { useTerminal } from '@/hooks/useTerminal';

export function TerminalWorkspace() {
  const {
    sessions,
    activeSession,
    activeTerminalId,
    inputRef,
    createNewSession,
    setActiveSession,
    executeCommand,
    clearCurrentTerminal,
  } = useTerminal();

  const [input, setInput] = useState('');
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [activeSession?.output]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (input.trim()) {
        executeCommand(input);
        setInput('');
      }
    },
    [input, executeCommand]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSubmit(e);
      }
      // Command history (simple implementation)
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        // Could implement command history navigation here
      }
    },
    [handleSubmit]
  );

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      {/* Terminal Header with Sessions */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#252526] border-b border-[#181A1F]">
        <div className="flex items-center gap-2">
          <TerminalIcon size={14} className="text-gray-400" />
          <span className="text-xs text-gray-400 font-medium">TERMINAL</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => createNewSession()}
            className="p-1 text-gray-400 hover:text-white hover:bg-[#2C2C2C] rounded transition-colors"
            title="New Terminal"
          >
            <Plus size={14} />
          </button>
          <button
            onClick={clearCurrentTerminal}
            className="p-1 text-gray-400 hover:text-white hover:bg-[#2C2C2C] rounded transition-colors"
            title="Clear Terminal"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Session Tabs */}
      {sessions.length > 1 && (
        <div className="flex bg-[#252526] border-b border-[#181A1F] overflow-x-auto">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => setActiveSession(session.id)}
              className={`px-3 py-1.5 text-xs flex items-center gap-2 border-b-2 transition-colors ${
                session.id === activeTerminalId
                  ? 'text-white border-blue-500 bg-[#1e1e1e]'
                  : 'text-gray-400 border-transparent hover:text-gray-300'
              }`}
            >
              {session.name}
            </button>
          ))}
        </div>
      )}

      {/* Terminal Output */}
      <div
        ref={outputRef}
        className="flex-1 p-4 font-mono text-[13px] text-gray-300 overflow-y-auto custom-scrollbar"
      >
        {activeSession?.output.map((line, index) => (
          <div
            key={index}
            className={line.startsWith('workspace@') ? 'text-green-400' : ''}
          >
            {line || '\u00A0'}
          </div>
        ))}
        
        {/* Input Line */}
        <form onSubmit={handleSubmit} className="flex items-center mt-1">
          <span className="text-green-400">workspace@openhands:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 ml-2 bg-transparent text-gray-300 outline-none font-mono text-[13px]"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  );
}
