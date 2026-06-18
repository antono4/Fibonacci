'use client';

import { create } from 'zustand';
import type { 
  Message, 
  WorkspaceTab, 
  FileNode, 
  BrowserTab, 
  TerminalSession,
  Model 
} from '@/types';

interface WorkspaceStore {
  // Chat
  messages: Message[];
  isAgentRunning: boolean;
  
  // Workspace
  activeTab: WorkspaceTab;
  terminalSessions: TerminalSession[];
  activeTerminalId: string | null;
  
  // Editor
  openFiles: FileNode[];
  activeFileId: string | null;
  fileTree: FileNode[];
  
  // Browser
  browserTabs: BrowserTab[];
  activeBrowserTabId: string | null;
  
  // Model
  selectedModel: Model;
  
  // UI
  sidebarWidth: number;
  isSettingsOpen: boolean;
  
  // Chat Actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setMessages: (messages: Message[]) => void;
  clearMessages: () => void;
  setIsAgentRunning: (running: boolean) => void;
  
  // Workspace Actions
  setActiveTab: (tab: WorkspaceTab) => void;
  
  // Terminal Actions
  addTerminalSession: (session: TerminalSession) => void;
  setActiveTerminal: (id: string | null) => void;
  updateTerminalOutput: (sessionId: string, output: string[]) => void;
  clearTerminal: (sessionId: string) => void;
  
  // Editor Actions
  addFile: (file: FileNode) => void;
  updateFile: (id: string, content: string) => void;
  deleteFile: (id: string) => void;
  setActiveFile: (id: string | null) => void;
  setFileTree: (tree: FileNode[]) => void;
  
  // Browser Actions
  addBrowserTab: (tab: BrowserTab) => void;
  setActiveBrowserTab: (id: string) => void;
  updateBrowserTab: (id: string, updates: Partial<BrowserTab>) => void;
  closeBrowserTab: (id: string) => void;
  
  // Model Actions
  setSelectedModel: (model: Model) => void;
  
  // UI Actions
  setSidebarWidth: (width: number) => void;
  toggleSettings: () => void;
}

const defaultModel: Model = {
  id: 'claude-3-5-sonnet-20241022',
  name: 'Claude 3.5 Sonnet',
  provider: 'Anthropic',
};

const initialFibonacciFile: FileNode = {
  id: 'fibonacci-py',
  name: 'fibonacci.py',
  type: 'file',
  path: '/workspace/fibonacci.py',
  language: 'python',
  content: `def fibonacci(n):
    """Menghitung deret Fibonacci hingga n elemen."""
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    
    sequence = [0, 1]
    for _ in range(2, n):
        next_val = sequence[-1] + sequence[-2]
        sequence.append(next_val)
    return sequence

# Menjalankan fungsi
if __name__ == "__main__":
    result = fibonacci(10)
    print(f"Deret Fibonacci (10 pertama):")
    print(result)
`,
};

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  // Initial State
  messages: [
    { 
      id: '1', 
      role: 'system', 
      content: 'Workspace initialized. Ready to start hacking!',
      timestamp: Date.now() - 60000,
    },
  ],
  isAgentRunning: false,
  activeTab: 'terminal',
  terminalSessions: [
    {
      id: 'main',
      name: 'Terminal 1',
      output: [
        'workspace@openhands:~$ ls -la',
        'total 12',
        'drwxr-xr-x 2 workspace workspace 4096 Jun 18 16:48 .',
        'drwxr-xr-x 3 root      root      4096 Jun 18 16:48 ..',
        '-rw-r--r-- 1 workspace workspace  240 Jun 18 16:50 fibonacci.py',
        '',
        'workspace@openhands:~$ python3 fibonacci.py',
        'Deret Fibonacci (10 pertama):',
        '[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]',
        '',
      ],
      isActive: true,
    },
  ],
  activeTerminalId: 'main',
  openFiles: [initialFibonacciFile],
  activeFileId: 'fibonacci-py',
  fileTree: [
    initialFibonacciFile,
    {
      id: 'package-json',
      name: 'package.json',
      type: 'file' as const,
      path: '/workspace/package.json',
      language: 'json',
      content: JSON.stringify({
        name: 'my-project',
        version: '1.0.0',
        dependencies: {},
      }, null, 2),
    },
    {
      id: 'src-folder',
      name: 'src',
      type: 'folder' as const,
      path: '/workspace/src',
      children: [],
    },
  ],
  browserTabs: [
    {
      id: 'browser-1',
      url: 'http://localhost:3000',
      title: 'Localhost:3000',
      canGoBack: false,
      canGoForward: false,
      isLoading: false,
    },
  ],
  activeBrowserTabId: 'browser-1',
  selectedModel: defaultModel,
  sidebarWidth: 420,
  isSettingsOpen: false,

  // Chat Actions
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { ...message, id: `${Date.now()}-${Math.random()}`, timestamp: Date.now() },
      ],
    })),

  setMessages: (messages) => set({ messages }),

  clearMessages: () =>
    set({
      messages: [
        { 
          id: `${Date.now()}`, 
          role: 'system', 
          content: 'Workspace cleared. Ready to start hacking!',
          timestamp: Date.now(),
        },
      ],
    }),

  setIsAgentRunning: (running) => set({ isAgentRunning: running }),

  // Workspace Actions
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Terminal Actions
  addTerminalSession: (session) =>
    set((state) => ({
      terminalSessions: [...state.terminalSessions, session],
      activeTerminalId: session.id,
    })),

  setActiveTerminal: (id) => set({ activeTerminalId: id }),

  updateTerminalOutput: (sessionId, output) =>
    set((state) => ({
      terminalSessions: state.terminalSessions.map((session) =>
        session.id === sessionId ? { ...session, output } : session
      ),
    })),

  clearTerminal: (sessionId) =>
    set((state) => ({
      terminalSessions: state.terminalSessions.map((session) =>
        session.id === sessionId ? { ...session, output: [] } : session
      ),
    })),

  // Editor Actions
  addFile: (file) =>
    set((state) => ({
      openFiles: [...state.openFiles.filter((f) => f.id !== file.id), file],
      activeFileId: file.id,
    })),

  updateFile: (id, content) =>
    set((state) => ({
      openFiles: state.openFiles.map((file) =>
        file.id === id ? { ...file, content } : file
      ),
      fileTree: updateFileInTree(state.fileTree, id, content),
    })),

  deleteFile: (id) =>
    set((state) => ({
      openFiles: state.openFiles.filter((file) => file.id !== id),
      activeFileId:
        state.activeFileId === id
          ? state.openFiles[0]?.id || null
          : state.activeFileId,
    })),

  setActiveFile: (id) => set({ activeFileId: id }),

  setFileTree: (tree) => set({ fileTree: tree }),

  // Browser Actions
  addBrowserTab: (tab) =>
    set((state) => ({
      browserTabs: [...state.browserTabs, tab],
      activeBrowserTabId: tab.id,
    })),

  setActiveBrowserTab: (id) => set({ activeBrowserTabId: id }),

  updateBrowserTab: (id, updates) =>
    set((state) => ({
      browserTabs: state.browserTabs.map((tab) =>
        tab.id === id ? { ...tab, ...updates } : tab
      ),
    })),

  closeBrowserTab: (id) =>
    set((state) => {
      const newTabs = state.browserTabs.filter((tab) => tab.id !== id);
      return {
        browserTabs: newTabs,
        activeBrowserTabId:
          state.activeBrowserTabId === id
            ? newTabs[0]?.id || null
            : state.activeBrowserTabId,
      };
    }),

  // Model Actions
  setSelectedModel: (model) => set({ selectedModel: model }),

  // UI Actions
  setSidebarWidth: (width) => set({ sidebarWidth: width }),

  toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
}));

// Helper function to update file in tree
function updateFileInTree(tree: FileNode[], id: string, content: string): FileNode[] {
  return tree.map((node) => {
    if (node.id === id) {
      return { ...node, content };
    }
    if (node.children) {
      return { ...node, children: updateFileInTree(node.children, id, content) };
    }
    return node;
  });
}
