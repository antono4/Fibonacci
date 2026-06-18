// Message Types
export type MessageRole = 'system' | 'user' | 'agent';
export type MessageType = 'thought' | 'action' | 'text';

export interface Message {
  id: string;
  role: MessageRole;
  type?: MessageType;
  content: string;
  actionType?: string;
  file?: string;
  timestamp: number;
}

export interface ActionResult {
  type: 'write_file' | 'read_file' | 'run_command' | 'browse' | 'edit_file';
  file?: string;
  command?: string;
  url?: string;
  content?: string;
  success: boolean;
  output?: string;
}

// Model Types
export interface Model {
  id: string;
  name: string;
  provider: string;
}

export interface AgentConfig {
  model: Model;
  temperature: number;
  maxTokens: number;
}

// File System Types
export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  content?: string;
  language?: string;
  children?: FileNode[];
}

// Terminal Types
export interface TerminalSession {
  id: string;
  name: string;
  output: string[];
  isActive: boolean;
}

// Workspace Types
export type WorkspaceTab = 'terminal' | 'editor' | 'browser';

export interface BrowserTab {
  id: string;
  url: string;
  title: string;
  canGoBack: boolean;
  canGoForward: boolean;
  isLoading: boolean;
}

// Store Types
export interface WorkspaceState {
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
  
  // Filesystem
  workspaceFiles: Map<string, FileNode>;
  
  // UI
  sidebarWidth: number;
  isSettingsOpen: boolean;
}

export type WorkspaceAction =
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'SET_AGENT_RUNNING'; payload: boolean }
  | { type: 'SET_ACTIVE_TAB'; payload: WorkspaceTab }
  | { type: 'ADD_TERMINAL_SESSION'; payload: TerminalSession }
  | { type: 'SET_ACTIVE_TERMINAL'; payload: string }
  | { type: 'APPEND_TERMINAL_OUTPUT'; payload: { sessionId: string; output: string } }
  | { type: 'CLEAR_TERMINAL'; payload: string }
  | { type: 'ADD_FILE'; payload: FileNode }
  | { type: 'UPDATE_FILE'; payload: { id: string; content: string } }
  | { type: 'DELETE_FILE'; payload: string }
  | { type: 'SET_ACTIVE_FILE'; payload: string | null }
  | { type: 'SET_FILE_TREE'; payload: FileNode[] }
  | { type: 'ADD_BROWSER_TAB'; payload: BrowserTab }
  | { type: 'SET_ACTIVE_BROWSER_TAB'; payload: string }
  | { type: 'UPDATE_BROWSER_TAB'; payload: { id: string; updates: Partial<BrowserTab> } }
  | { type: 'CLOSE_BROWSER_TAB'; payload: string }
  | { type: 'SET_SIDEBAR_WIDTH'; payload: number }
  | { type: 'TOGGLE_SETTINGS' };

// Keyboard Shortcuts
export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: string;
  description: string;
}
