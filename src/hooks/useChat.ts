'use client';

import { useCallback, useRef, useEffect } from 'react';
import { useWorkspaceStore } from '@/store';
import type { Message } from '@/types';

export function useChat() {
  const { messages, isAgentRunning, addMessage, setIsAgentRunning, setActiveTab } = 
    useWorkspaceStore();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isAgentRunning) return;

      // Add user message
      addMessage({ role: 'user', content });
      setIsAgentRunning(true);
      setActiveTab('terminal');

      // Simulate agent response (replace with actual API call)
      try {
        // Add thinking message
        addMessage({
          role: 'agent',
          type: 'thought',
          content: 'Memproses permintaan Anda...',
        });

        // Simulate delay for agent processing
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Add mock action
        addMessage({
          role: 'agent',
          type: 'action',
          actionType: 'thinking',
          content: 'Menganalisis permintaan...',
        });

        // Simulate more processing
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Add final response
        addMessage({
          role: 'agent',
          type: 'text',
          content: 'Permintaan Anda sedang diproses. Anda dapat memantau progres di panel Terminal.',
        });
      } catch (error) {
        addMessage({
          role: 'agent',
          type: 'text',
          content: 'Maaf, terjadi kesalahan saat memproses permintaan Anda.',
        });
      } finally {
        setIsAgentRunning(false);
      }
    },
    [addMessage, isAgentRunning, setIsAgentRunning, setActiveTab]
  );

  const stopAgent = useCallback(() => {
    setIsAgentRunning(false);
  }, [setIsAgentRunning]);

  const clearChat = useCallback(() => {
    useWorkspaceStore.getState().clearMessages();
  }, []);

  const simulateAgentAction = useCallback(
    async (action: {
      type: 'write_file' | 'read_file' | 'run_command';
      content?: string;
      file?: string;
      command?: string;
    }) => {
      const { type, content, file, command } = action;

      addMessage({
        role: 'agent',
        type: 'action',
        actionType: type,
        file,
        content: content || `Melakukan ${type}...`,
      });

      // Simulate action processing
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Add result based on action type
      let resultContent = '';
      switch (type) {
        case 'write_file':
          resultContent = `File ${file} berhasil ditulis.`;
          break;
        case 'read_file':
          resultContent = `File ${file} berhasil dibaca.`;
          break;
        case 'run_command':
          resultContent = `Command "${command}" selesai dieksekusi.`;
          break;
      }

      addMessage({
        role: 'agent',
        type: 'text',
        content: resultContent,
      });
    },
    [addMessage]
  );

  return {
    messages,
    isAgentRunning,
    chatEndRef,
    sendMessage,
    stopAgent,
    clearChat,
    simulateAgentAction,
  };
}

// Hook for agent streaming responses
export function useAgentStream() {
  const { addMessage, setIsAgentRunning } = useWorkspaceStore();
  const abortControllerRef = useRef<AbortController | null>(null);

  const startStream = useCallback(
    async (prompt: string, onComplete?: () => void) => {
      // Cancel any existing stream
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setIsAgentRunning(true);

      // Add user message
      addMessage({ role: 'user', content: prompt });

      // Add placeholder for streaming response
      const messageId = `${Date.now()}-stream`;
      addMessage({
        role: 'agent',
        type: 'text',
        content: '',
      });

      try {
        // This is where you would connect to your actual agent API
        // For now, simulate streaming with mock data
        const mockStream = async function* () {
          const responses = [
            { type: 'thought', content: 'Memproses permintaan Anda...' },
            { type: 'action', content: 'Menganalisis file system...' },
            { type: 'text', content: 'Saya akan membantu Anda dengan itu.' },
          ];

          for (const response of responses) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            yield response;
          }
        };

        // For actual implementation, you would:
        // const response = await fetch('/api/agent', {
        //   method: 'POST',
        //   body: JSON.stringify({ prompt }),
        //   signal: abortControllerRef.current.signal,
        // });
        // const reader = response.body?.getReader();
        // ... handle streaming

        for await (const chunk of mockStream()) {
          if (abortControllerRef.current?.signal.aborted) break;
          
          const messages = useWorkspaceStore.getState().messages;
          const lastMessage = messages[messages.length - 1];
          
          if (lastMessage && lastMessage.id === messageId) {
            useWorkspaceStore.setState({
              messages: [
                ...messages.slice(0, -1),
                {
                  ...lastMessage,
                  type: chunk.type as 'thought' | 'action' | 'text',
                  content: chunk.content,
                },
              ],
            });
          }
        }

        onComplete?.();
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Stream error:', error);
        }
      } finally {
        setIsAgentRunning(false);
      }
    },
    [addMessage, setIsAgentRunning]
  );

  const stopStream = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsAgentRunning(false);
  }, [setIsAgentRunning]);

  return { startStream, stopStream };
}
