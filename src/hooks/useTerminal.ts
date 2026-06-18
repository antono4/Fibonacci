'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useWorkspaceStore } from '@/store';
import type { TerminalSession } from '@/types';

export function useTerminal() {
  const {
    terminalSessions,
    activeTerminalId,
    addTerminalSession,
    setActiveTerminal,
    updateTerminalOutput,
    clearTerminal,
  } = useWorkspaceStore();

  const activeSession = terminalSessions.find((s) => s.id === activeTerminalId);
  const inputRef = useRef<HTMLInputElement>(null);

  const createNewSession = useCallback(() => {
    const newSession: TerminalSession = {
      id: `terminal-${Date.now()}`,
      name: `Terminal ${terminalSessions.length + 1}`,
      output: [`workspace@openhands:~$ Welcome to OpenHands Terminal`],
      isActive: true,
    };
    addTerminalSession(newSession);
    return newSession.id;
  }, [terminalSessions.length, addTerminalSession]);

  const executeCommand = useCallback(
    async (command: string) => {
      if (!activeTerminalId) return;

      const session = terminalSessions.find((s) => s.id === activeTerminalId);
      if (!session) return;

      // Add command to output
      const newOutput = [...session.output, `workspace@openhands:~$ ${command}`];

      // Process command
      let result = '';
      const args = command.trim().split(' ');
      const cmd = args[0];

      switch (cmd) {
        case 'ls':
          result = 'fibonacci.py  package.json  src/';
          break;
        case 'cat':
          if (args[1] === 'fibonacci.py') {
            result = `def fibonacci(n):
    """Menghitung deret Fibonacci."""
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    sequence = [0, 1]
    for _ in range(2, n):
        next_val = sequence[-1] + sequence[-2]
        sequence.append(next_val)
    return sequence

if __name__ == "__main__":
    result = fibonacci(10)
    print(f"Deret Fibonacci: {result}")`;
          } else if (args[1] === 'package.json') {
            result = '{"name":"my-project","version":"1.0.0"}';
          } else {
            result = `cat: ${args[1]}: No such file or directory`;
          }
          break;
        case 'python':
        case 'python3':
          if (args[1]?.endsWith('.py')) {
            result = `Deret Fibonacci: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`;
          } else {
            result = `Python 3.11.4\nType "help()" for more information.`;
          }
          break;
        case 'echo':
          result = args.slice(1).join(' ');
          break;
        case 'pwd':
          result = '/workspace';
          break;
        case 'cd':
          if (args[1]) {
            result = ''; // Directory change (no output)
          }
          break;
        case 'clear':
          clearTerminal(activeTerminalId);
          return;
        case 'help':
          result = `Available commands:
  ls          - List directory contents
  cat <file>  - Display file contents
  python <f>   - Run Python file
  echo <text>  - Print text
  pwd         - Print working directory
  cd <dir>    - Change directory
  clear       - Clear terminal
  help        - Show this help`;
          break;
        case '':
          break;
        default:
          result = `${cmd}: command not found. Type 'help' for available commands.`;
      }

      if (result) {
        updateTerminalOutput(activeTerminalId, [...newOutput, result, '']);
      } else {
        updateTerminalOutput(activeTerminalId, [...newOutput, '']);
      }
    },
    [activeTerminalId, terminalSessions, updateTerminalOutput, clearTerminal]
  );

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // Auto-focus terminal when tab is selected
  useEffect(() => {
    if (activeTerminalId) {
      setTimeout(focusInput, 100);
    }
  }, [activeTerminalId, focusInput]);

  return {
    sessions: terminalSessions,
    activeSession,
    activeTerminalId,
    inputRef,
    createNewSession,
    setActiveSession: setActiveTerminal,
    executeCommand,
    clearCurrentTerminal: () => {
      if (activeTerminalId) clearTerminal(activeTerminalId);
    },
    focusInput,
  };
}
