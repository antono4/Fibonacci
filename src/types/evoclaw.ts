// EvoClaw-inspired types for Soul and Memory management

export type MemoryLevel = 'routine' | 'notable' | 'pivotal';

export type GovernanceLevel = 'autonomous' | 'supervised' | 'gated';

export type SoulSection = 'personality' | 'philosophy' | 'boundaries' | 'continuity' | 'goals' | 'learning';

export type SoulTag = 'CORE' | 'MUTABLE';

export interface SoulEntry {
  id: string;
  section: SoulSection;
  tag: SoulTag;
  content: string;
  createdAt: number;
  updatedAt: number;
  provenance?: string;
}

export interface SoulDocument {
  agentName: string;
  version: string;
  entries: SoulEntry[];
  lastModified: number;
}

export interface Experience {
  id: string;
  level: MemoryLevel;
  content: string;
  timestamp: number;
  source: 'chat' | 'terminal' | 'browser' | 'file' | 'social';
  tags: string[];
}

export interface Reflection {
  id: string;
  experiences: string[]; // Experience IDs
  insights: string[];
  gaps: string[]; // Gaps between soul and behavior
  createdAt: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Proposal {
  id: string;
  reflectionId: string;
  currentState: string;
  proposedChange: string;
  rationale: string;
  createdAt: number;
  status: 'pending' | 'approved' | 'applied' | 'rejected';
  approvedBy?: string;
}

export interface EvolutionEvent {
  id: string;
  proposalId: string;
  change: string;
  timestamp: number;
  type: 'soul_update' | 'memory_add' | 'reflection_complete';
}

export interface EvoClawState {
  soul: SoulDocument;
  memories: Experience[];
  reflections: Reflection[];
  proposals: Proposal[];
  evolutionHistory: EvolutionEvent[];
  governanceLevel: GovernanceLevel;
  isEvolving: boolean;
}
