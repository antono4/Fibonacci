// Agent and Conversation types inspired by OpenHands

export type AgentStatus = 'idle' | 'running' | 'paused' | 'error' | 'stopped';

export type AgentState = 
  | 'idle'
  | 'running'
  | 'paused'
  | 'error'
  | 'stopped'
  | 'waiting_for_user'
  | 'init'
  | 'finished';

export interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  state: AgentState;
  model?: string;
  provider?: string;
  backend?: string;
  startedAt?: number;
  currentTask?: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
  isActive: boolean;
  tags?: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: number;
  type?: 'thought' | 'action' | 'output' | 'error';
  tool?: string;
  toolInput?: string;
  toolOutput?: string;
  imageUrls?: string[];
  isError?: boolean;
}

export interface AgentAction {
  id: string;
  type: 'thought' | 'file_edit' | 'bash_command' | 'web_browse' | 'api_call' | 'search';
  description: string;
  timestamp: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  details?: string;
  duration?: number;
}

export interface AgentConfig {
  model: string;
  provider: string;
  temperature?: number;
  maxTokens?: number;
  apiKey?: string;
  baseUrl?: string;
  systemPrompt?: string;
}

export interface BackendConfig {
  id: string;
  name: string;
  type: 'local' | 'docker' | 'remote' | 'cloud';
  url?: string;
  status: 'connected' | 'disconnected' | 'error';
  lastPing?: number;
}

export interface FileTreeNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileTreeNode[];
  isExpanded?: boolean;
  language?: string;
  modified?: boolean;
}
