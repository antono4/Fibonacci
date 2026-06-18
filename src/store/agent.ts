'use client';

import { create } from 'zustand';
import type {
  Agent,
  AgentStatus,
  AgentState,
  Conversation,
  Message,
  AgentAction,
  BackendConfig,
} from '@/types/agent';

interface AgentStore {
  // Agent State
  agent: Agent;
  setAgentStatus: (status: AgentStatus) => void;
  setAgentState: (state: AgentState) => void;
  setCurrentTask: (task: string) => void;
  resetAgent: () => void;

  // Conversations
  conversations: Conversation[];
  activeConversationId: string | null;
  createConversation: (title?: string) => Conversation;
  deleteConversation: (id: string) => void;
  setActiveConversation: (id: string) => void;
  updateConversationTitle: (id: string, title: string) => void;

  // Messages
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: (conversationId: string) => void;

  // Actions Log
  actions: AgentAction[];
  addAction: (action: Omit<AgentAction, 'id' | 'timestamp' | 'status'>) => void;
  updateActionStatus: (id: string, status: AgentAction['status']) => void;
  clearActions: () => void;

  // Backends
  backends: BackendConfig[];
  activeBackendId: string | null;
  addBackend: (backend: Omit<BackendConfig, 'id'>) => void;
  removeBackend: (id: string) => void;
  setActiveBackend: (id: string) => void;
  updateBackendStatus: (id: string, status: BackendConfig['status']) => void;
}

// Default agent
const defaultAgent: Agent = {
  id: 'agent-1',
  name: 'OpenHands Agent',
  status: 'idle',
  state: 'idle',
  model: 'claude-sonnet-4-20250514',
  provider: 'Anthropic',
  backend: 'local',
};

// Sample conversations
const sampleConversations: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Fibonacci Implementation',
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 1800000,
    isActive: true,
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'Tolong buatkan skrip Python untuk deret Fibonacci',
        timestamp: Date.now() - 3600000,
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: 'Baik, saya akan membuat skrip Fibonacci untuk Anda.',
        timestamp: Date.now() - 3500000,
        type: 'thought',
      },
      {
        id: 'msg-3',
        role: 'assistant',
        content: 'Saya akan menyimpan kode ke file fibonacci.py',
        timestamp: Date.now() - 3400000,
        type: 'action',
        tool: 'write_file',
        toolInput: 'fibonacci.py',
      },
      {
        id: 'msg-4',
        role: 'tool',
        content: 'File fibonacci.py berhasil dibuat',
        timestamp: Date.now() - 3300000,
        tool: 'write_file',
      },
    ],
  },
  {
    id: 'conv-2',
    title: 'React Component Setup',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
    isActive: false,
    messages: [
      {
        id: 'msg-5',
        role: 'user',
        content: 'Buatkan component counter dengan React',
        timestamp: Date.now() - 86400000,
      },
    ],
  },
];

// Sample actions
const sampleActions: AgentAction[] = [
  {
    id: 'action-1',
    type: 'thought',
    description: 'Analyzing user request',
    timestamp: Date.now() - 3400000,
    status: 'completed',
    duration: 150,
  },
  {
    id: 'action-2',
    type: 'file_edit',
    description: 'Writing fibonacci.py',
    timestamp: Date.now() - 3300000,
    status: 'completed',
    duration: 450,
  },
  {
    id: 'action-3',
    type: 'bash_command',
    description: 'python fibonacci.py',
    timestamp: Date.now() - 3100000,
    status: 'completed',
    details: 'Output: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]',
    duration: 200,
  },
];

// Sample backends
const sampleBackends: BackendConfig[] = [
  {
    id: 'backend-1',
    name: 'Local Agent',
    type: 'local',
    status: 'connected',
    lastPing: Date.now(),
  },
];

export const useAgentStore = create<AgentStore>((set, get) => ({
  // Agent State
  agent: defaultAgent,

  setAgentStatus: (status) =>
    set((state) => ({
      agent: { ...state.agent, status },
    })),

  setAgentState: (agentState) =>
    set((storeState) => ({
      agent: { ...storeState.agent, state: agentState },
    })),

  setCurrentTask: (task) =>
    set((state) => ({
      agent: { ...state.agent, currentTask: task },
    })),

  resetAgent: () =>
    set({
      agent: { ...defaultAgent, startedAt: undefined },
    }),

  // Conversations
  conversations: sampleConversations,
  activeConversationId: 'conv-1',

  createConversation: (title) => {
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      title: title || `New Conversation ${get().conversations.length + 1}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isActive: false,
      messages: [],
    };
    set((state) => ({
      conversations: [newConversation, ...state.conversations],
    }));
    return newConversation;
  },

  deleteConversation: (id) =>
    set((state) => {
      const filtered = state.conversations.filter((c) => c.id !== id);
      return {
        conversations: filtered,
        activeConversationId:
          state.activeConversationId === id
            ? filtered[0]?.id || null
            : state.activeConversationId,
      };
    }),

  setActiveConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.map((c) => ({
        ...c,
        isActive: c.id === id,
      })),
      activeConversationId: id,
    })),

  updateConversationTitle: (id, title) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, title, updatedAt: Date.now() } : c
      ),
    })),

  // Messages
  addMessage: (conversationId, message) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: [
                ...c.messages,
                {
                  ...message,
                  id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  timestamp: Date.now(),
                },
              ],
              updatedAt: Date.now(),
            }
          : c
      ),
    })),

  clearMessages: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, messages: [] } : c
      ),
    })),

  // Actions Log
  actions: sampleActions,

  addAction: (action) =>
    set((state) => ({
      actions: [
        ...state.actions,
        {
          ...action,
          id: `action-${Date.now()}`,
          timestamp: Date.now(),
          status: 'pending' as const,
        },
      ],
    })),

  updateActionStatus: (id, status) =>
    set((state) => ({
      actions: state.actions.map((a) => (a.id === id ? { ...a, status } : a)),
    })),

  clearActions: () => set({ actions: [] }),

  // Backends
  backends: sampleBackends,
  activeBackendId: 'backend-1',

  addBackend: (backend) =>
    set((state) => ({
      backends: [
        ...state.backends,
        { ...backend, id: `backend-${Date.now()}` },
      ],
    })),

  removeBackend: (id) =>
    set((state) => ({
      backends: state.backends.filter((b) => b.id !== id),
      activeBackendId:
        state.activeBackendId === id
          ? state.backends[0]?.id || null
          : state.activeBackendId,
    })),

  setActiveBackend: (id) => set({ activeBackendId: id }),

  updateBackendStatus: (id, status) =>
    set((state) => ({
      backends: state.backends.map((b) =>
        b.id === id ? { ...b, status, lastPing: Date.now() } : b
      ),
    })),
}));
