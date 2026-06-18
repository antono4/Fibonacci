'use client';

import { useState } from 'react';
import { Sparkles, Brain, Shield, BookOpen, Target, Heart } from 'lucide-react';
import { clsx } from 'clsx';
import { useEvoClawStore } from '@/store/evoclaw';
import type { SoulSection, SoulTag, SoulEntry } from '@/types/evoclaw';

const SECTION_ICONS: Record<SoulSection, typeof Brain> = {
  personality: Heart,
  philosophy: Sparkles,
  boundaries: Shield,
  continuity: Brain,
  goals: Target,
  learning: BookOpen,
};

const SECTION_LABELS: Record<SoulSection, string> = {
  personality: 'Personality',
  philosophy: 'Philosophy',
  boundaries: 'Boundaries',
  continuity: 'Continuity',
  goals: 'Goals',
  learning: 'Learning',
};

const TAG_COLORS: Record<SoulTag, string> = {
  CORE: 'bg-red-500/20 text-red-400 border-red-500/30',
  MUTABLE: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

export function SoulPanel() {
  const { soul } = useEvoClawStore();
  const [selectedSection, setSelectedSection] = useState<SoulSection | 'all'>('all');

  const filteredEntries =
    selectedSection === 'all'
      ? soul.entries
      : soul.entries.filter((entry) => entry.section === selectedSection);

  const groupedEntries = soul.entries.reduce(
    (acc, entry) => {
      if (!acc[entry.section]) acc[entry.section] = [];
      acc[entry.section].push(entry);
      return acc;
    },
    {} as Record<SoulSection, typeof soul.entries>
  );

  return (
    <div className="h-full flex flex-col bg-oh-panel">
      {/* Header */}
      <div className="p-4 border-b border-oh-border">
        <div className="flex items-center gap-2 mb-3">
          <Brain size={18} className="text-purple-400" />
          <h2 className="font-semibold text-oh-text-bright">Agent Soul</h2>
          <span className="text-xs text-gray-500">v{soul.version}</span>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setSelectedSection('all')}
            className={clsx(
              'px-2 py-1 text-xs rounded transition-colors',
              selectedSection === 'all'
                ? 'bg-purple-500/20 text-purple-400'
                : 'text-gray-400 hover:bg-oh-hover'
            )}
          >
            All
          </button>
          {(Object.keys(SECTION_LABELS) as SoulSection[]).map((section) => {
            const Icon = SECTION_ICONS[section];
            return (
              <button
                key={section}
                onClick={() => setSelectedSection(section)}
                className={clsx(
                  'flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors',
                  selectedSection === section
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'text-gray-400 hover:bg-oh-hover'
                )}
              >
                <Icon size={12} />
                {SECTION_LABELS[section]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Soul Entries */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {selectedSection === 'all' ? (
          // Grouped view
          (Object.keys(groupedEntries) as SoulSection[]).map((section) => {
            const Icon = SECTION_ICONS[section];
            const entries = groupedEntries[section] || [];
            return (
              <div key={section} className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <Icon size={14} className="text-purple-400" />
                  {SECTION_LABELS[section]}
                </div>
                {entries.map((entry) => (
                  <SoulEntryCard key={entry.id} entry={entry} />
                ))}
              </div>
            );
          })
        ) : (
          // Filtered view
          filteredEntries.map((entry) => (
            <SoulEntryCard key={entry.id} entry={entry} />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-oh-border text-xs text-gray-500">
        Last modified: {new Date(soul.lastModified).toLocaleString()}
      </div>
    </div>
  );
}

function SoulEntryCard({ entry }: { entry: SoulEntry }) {
  const Icon = SECTION_ICONS[entry.section];

  return (
    <div className="bg-oh-surface border border-oh-border rounded-lg p-3 hover:border-purple-500/30 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-gray-400" />
          <span className="text-xs text-gray-400">{SECTION_LABELS[entry.section]}</span>
        </div>
        <span
          className={clsx(
            'px-2 py-0.5 text-[10px] font-semibold rounded border',
            TAG_COLORS[entry.tag]
          )}
        >
          {entry.tag}
        </span>
      </div>
      <p className="text-sm text-oh-text leading-relaxed">{entry.content}</p>
      {entry.provenance && (
        <p className="text-[10px] text-gray-500 mt-2 font-mono">
          → {entry.provenance}
        </p>
      )}
    </div>
  );
}
