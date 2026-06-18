'use client';

import { create } from 'zustand';
import type {
  SoulDocument,
  SoulEntry,
  Experience,
  Reflection,
  Proposal,
  EvolutionEvent,
  GovernanceLevel,
  MemoryLevel,
  SoulSection,
} from '@/types/evoclaw';

interface EvoClawStore {
  // Soul
  soul: SoulDocument;
  updateSoul: (entryId: string, content: string) => void;
  addSoulEntry: (entry: Omit<SoulEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;

  // Experience & Memory
  experiences: Experience[];
  addExperience: (experience: Omit<Experience, 'id' | 'timestamp'>) => void;
  getMemoriesByLevel: (level: MemoryLevel) => Experience[];

  // Reflections
  reflections: Reflection[];
  createReflection: (reflection: Omit<Reflection, 'id' | 'createdAt' | 'status'>) => void;
  updateReflectionStatus: (id: string, status: Reflection['status']) => void;

  // Proposals
  proposals: Proposal[];
  createProposal: (proposal: Omit<Proposal, 'id' | 'createdAt' | 'status'>) => void;
  updateProposalStatus: (id: string, status: Proposal['status']) => void;

  // Evolution
  evolutionHistory: EvolutionEvent[];
  addEvolutionEvent: (event: Omit<EvolutionEvent, 'id' | 'timestamp'>) => void;

  // Governance
  governanceLevel: GovernanceLevel;
  setGovernanceLevel: (level: GovernanceLevel) => void;
  isEvolving: boolean;
  setIsEvolving: (evolving: boolean) => void;

  // Settings
  reflectionIntervalMinutes: number;
  setReflectionInterval: (minutes: number) => void;
}

// Default soul document
const defaultSoul: SoulDocument = {
  agentName: 'OpenHands Clone',
  version: '1.0.0',
  lastModified: Date.now(),
  entries: [
    {
      id: 'soul-1',
      section: 'personality',
      tag: 'CORE',
      content: 'Helpful and respectful - I assist users with their coding tasks while maintaining professionalism.',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: 'soul-2',
      section: 'personality',
      tag: 'MUTABLE',
      content: 'Curious and eager to learn - I explore different approaches to solve problems.',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: 'soul-3',
      section: 'philosophy',
      tag: 'CORE',
      content: 'Code quality matters - I write clean, efficient, and maintainable code.',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: 'soul-4',
      section: 'boundaries',
      tag: 'CORE',
      content: 'I do not execute harmful code, access unauthorized systems, or perform malicious activities.',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: 'soul-5',
      section: 'boundaries',
      tag: 'MUTABLE',
      content: 'I can suggest improvements but users make final decisions about their code.',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: 'soul-6',
      section: 'continuity',
      tag: 'MUTABLE',
      content: 'I remember previous conversations in this session and maintain context.',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ],
};

// Sample memories
const sampleExperiences: Experience[] = [
  {
    id: 'exp-1',
    level: 'routine',
    content: 'User asked to create a Fibonacci script',
    timestamp: Date.now() - 3600000,
    source: 'chat',
    tags: ['fibonacci', 'python', 'basic'],
  },
  {
    id: 'exp-2',
    level: 'notable',
    content: 'User provided positive feedback on code organization',
    timestamp: Date.now() - 1800000,
    source: 'chat',
    tags: ['feedback', 'code-quality'],
  },
  {
    id: 'exp-3',
    level: 'pivotal',
    content: 'Learned a new approach to state management using Zustand',
    timestamp: Date.now() - 900000,
    source: 'file',
    tags: ['zustand', 'learning', 'architecture'],
  },
];

export const useEvoClawStore = create<EvoClawStore>((set, get) => ({
  // Soul
  soul: defaultSoul,

  updateSoul: (entryId, content) =>
    set((state) => ({
      soul: {
        ...state.soul,
        entries: state.soul.entries.map((entry) =>
          entry.id === entryId
            ? { ...entry, content, updatedAt: Date.now() }
            : entry
        ),
        lastModified: Date.now(),
      },
    })),

  addSoulEntry: (entry) =>
    set((state) => ({
      soul: {
        ...state.soul,
        entries: [
          ...state.soul.entries,
          {
            ...entry,
            id: `soul-${Date.now()}`,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        ],
        lastModified: Date.now(),
      },
    })),

  // Experience & Memory
  experiences: sampleExperiences,

  addExperience: (experience) =>
    set((state) => ({
      experiences: [
        ...state.experiences,
        {
          ...experience,
          id: `exp-${Date.now()}`,
          timestamp: Date.now(),
        },
      ],
    })),

  getMemoriesByLevel: (level) => {
    return get().experiences.filter((exp) => exp.level === level);
  },

  // Reflections
  reflections: [],

  createReflection: (reflection) =>
    set((state) => ({
      reflections: [
        ...state.reflections,
        {
          ...reflection,
          id: `ref-${Date.now()}`,
          createdAt: Date.now(),
          status: 'pending',
        },
      ],
    })),

  updateReflectionStatus: (id, status) =>
    set((state) => ({
      reflections: state.reflections.map((ref) =>
        ref.id === id ? { ...ref, status } : ref
      ),
    })),

  // Proposals
  proposals: [],

  createProposal: (proposal) =>
    set((state) => ({
      proposals: [
        ...state.proposals,
        {
          ...proposal,
          id: `prop-${Date.now()}`,
          createdAt: Date.now(),
          status: 'pending',
        },
      ],
    })),

  updateProposalStatus: (id, status) =>
    set((state) => ({
      proposals: state.proposals.map((prop) =>
        prop.id === id ? { ...prop, status } : prop
      ),
    })),

  // Evolution
  evolutionHistory: [],

  addEvolutionEvent: (event) =>
    set((state) => ({
      evolutionHistory: [
        ...state.evolutionHistory,
        {
          ...event,
          id: `evo-${Date.now()}`,
          timestamp: Date.now(),
        },
      ],
    })),

  // Governance
  governanceLevel: 'supervised',
  setGovernanceLevel: (level) => set({ governanceLevel: level }),
  isEvolving: false,
  setIsEvolving: (evolving) => set({ isEvolving: evolving }),

  // Settings
  reflectionIntervalMinutes: 15,
  setReflectionInterval: (minutes) => set({ reflectionIntervalMinutes: minutes }),
}));
