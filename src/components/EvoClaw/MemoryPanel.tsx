'use client';

import { useState } from 'react';
import { Clock, Star, Zap, Archive, Filter } from 'lucide-react';
import { clsx } from 'clsx';
import { useEvoClawStore } from '@/store/evoclaw';
import type { MemoryLevel } from '@/types/evoclaw';

const MEMORY_CONFIG: Record<MemoryLevel, {
  label: string;
  icon: typeof Clock;
  color: string;
  bgColor: string;
  description: string;
}> = {
  routine: {
    label: 'Routine',
    icon: Archive,
    color: 'text-gray-400',
    bgColor: 'bg-gray-500',
    description: 'Standard tasks and everyday exchanges',
  },
  notable: {
    label: 'Notable',
    icon: Star,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500',
    description: 'Meaningful moments and feedback',
  },
  pivotal: {
    label: 'Pivotal',
    icon: Zap,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500',
    description: 'High-impact learning events',
  },
};

export function MemoryPanel() {
  const { experiences } = useEvoClawStore();
  const [selectedLevel, setSelectedLevel] = useState<MemoryLevel | 'all'>('all');

  const filteredExperiences =
    selectedLevel === 'all'
      ? experiences
      : experiences.filter((exp) => exp.level === selectedLevel);

  // Sort by timestamp (newest first)
  const sortedExperiences = [...filteredExperiences].sort(
    (a, b) => b.timestamp - a.timestamp
  );

  const counts = {
    routine: experiences.filter((e) => e.level === 'routine').length,
    notable: experiences.filter((e) => e.level === 'notable').length,
    pivotal: experiences.filter((e) => e.level === 'pivotal').length,
  };

  return (
    <div className="h-full flex flex-col bg-oh-panel">
      {/* Header */}
      <div className="p-4 border-b border-oh-border">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={18} className="text-blue-400" />
          <h2 className="font-semibold text-oh-text-bright">Experience Memory</h2>
        </div>

        {/* Level Filter */}
        <div className="flex items-center gap-2 mb-3">
          <Filter size={14} className="text-gray-500" />
          <div className="flex gap-1">
            <button
              onClick={() => setSelectedLevel('all')}
              className={clsx(
                'px-2 py-1 text-xs rounded transition-colors',
                selectedLevel === 'all'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-gray-400 hover:bg-oh-hover'
              )}
            >
              All ({experiences.length})
            </button>
            {(Object.keys(MEMORY_CONFIG) as MemoryLevel[]).map((level) => {
              const config = MEMORY_CONFIG[level];
              const Icon = config.icon;
              return (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={clsx(
                    'flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors',
                    selectedLevel === level
                      ? `${config.bgColor}/20 text-${config.color.replace('text-', '')}`
                      : 'text-gray-400 hover:bg-oh-hover'
                  )}
                  style={
                    selectedLevel === level
                      ? {
                          backgroundColor: 'rgba(234, 179, 8, 0.1)',
                          color: '#fbbf24',
                        }
                      : undefined
                  }
                >
                  <Icon size={12} />
                  {config.label} ({counts[level]})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Memory List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {sortedExperiences.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Clock size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No memories yet</p>
            <p className="text-xs">Experiences will appear here</p>
          </div>
        ) : (
          sortedExperiences.map((experience) => {
            const config = MEMORY_CONFIG[experience.level];
            const Icon = config.icon;
            const timeAgo = getTimeAgo(experience.timestamp);

            return (
              <div
                key={experience.id}
                className={clsx(
                  'bg-oh-surface border rounded-lg p-3 hover:border-opacity-50 transition-colors',
                  experience.level === 'routine' && 'border-gray-600 hover:border-gray-500',
                  experience.level === 'notable' && 'border-yellow-600/30 hover:border-yellow-500/50',
                  experience.level === 'pivotal' && 'border-purple-600/30 hover:border-purple-500/50'
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon size={14} className={config.color} />
                    <span
                      className={clsx(
                        'px-2 py-0.5 text-[10px] font-semibold rounded',
                        config.bgColor,
                        experience.level === 'routine' && 'bg-gray-500/20 text-gray-400',
                        experience.level === 'notable' && 'bg-yellow-500/20 text-yellow-400',
                        experience.level === 'pivotal' && 'bg-purple-500/20 text-purple-400'
                      )}
                    >
                      {config.label.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-gray-500">{timeAgo}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 uppercase">{experience.source}</span>
                </div>
                <p className="text-sm text-oh-text leading-relaxed mb-2">
                  {experience.content}
                </p>
                {experience.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {experience.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-[10px] bg-oh-hover text-gray-400 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-3 border-t border-oh-border">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Total Experiences: {experiences.length}</span>
          <span>Memory Level: {selectedLevel === 'all' ? 'All' : MEMORY_CONFIG[selectedLevel].label}</span>
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
