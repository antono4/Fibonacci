'use client';

import { useState } from 'react';
import {
  Activity,
  FileEdit,
  Terminal,
  Globe,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Filter,
  Trash2,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAgentStore } from '@/store/agent';
import type { AgentAction } from '@/types/agent';

const ACTION_ICONS: Record<AgentAction['type'], typeof Activity> = {
  thought: Activity,
  file_edit: FileEdit,
  bash_command: Terminal,
  web_browse: Globe,
  api_call: Globe,
  search: Search,
};

const ACTION_COLORS: Record<AgentAction['type'], string> = {
  thought: 'text-purple-400 bg-purple-500/20',
  file_edit: 'text-blue-400 bg-blue-500/20',
  bash_command: 'text-green-400 bg-green-500/20',
  web_browse: 'text-cyan-400 bg-cyan-500/20',
  api_call: 'text-yellow-400 bg-yellow-500/20',
  search: 'text-orange-400 bg-orange-500/20',
};

const STATUS_ICONS: Record<AgentAction['status'], typeof CheckCircle | typeof Loader2 | typeof XCircle> = {
  pending: Loader2,
  running: Loader2,
  completed: CheckCircle,
  failed: XCircle,
};

const STATUS_COLORS: Record<AgentAction['status'], string> = {
  pending: 'text-gray-400',
  running: 'text-blue-400',
  completed: 'text-green-400',
  failed: 'text-red-400',
};

export function AgentActionsLog() {
  const { actions, clearActions } = useAgentStore();
  const [filter, setFilter] = useState<AgentAction['type'] | 'all'>('all');

  const filteredActions = filter === 'all'
    ? actions
    : actions.filter((a) => a.type === filter);

  const formatDuration = (ms?: number) => {
    if (!ms) return '';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="bg-oh-surface border border-oh-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-oh-border">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-orange-400" />
          <span className="font-medium text-oh-text-bright">Actions Log</span>
          <span className="text-xs text-gray-500">({actions.length})</span>
        </div>
        <button
          onClick={clearActions}
          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
          title="Clear log"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Filter */}
      <div className="px-3 py-2 border-b border-oh-border">
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar-hidden">
          <Filter size={12} className="text-gray-500 flex-shrink-0" />
          <button
            onClick={() => setFilter('all')}
            className={clsx(
              'px-2 py-1 text-xs rounded transition-colors whitespace-nowrap',
              filter === 'all'
                ? 'bg-orange-500/20 text-orange-400'
                : 'text-gray-400 hover:bg-oh-hover'
            )}
          >
            All
          </button>
          {(Object.keys(ACTION_ICONS) as AgentAction['type'][]).map((type) => {
            const Icon = ACTION_ICONS[type];
            return (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={clsx(
                  'flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors whitespace-nowrap',
                  filter === type
                    ? `${ACTION_COLORS[type]} opacity-100`
                    : 'text-gray-400 hover:bg-oh-hover'
                )}
              >
                <Icon size={12} />
                {type.replace('_', ' ')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions List */}
      <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
        {filteredActions.length === 0 ? (
          <div className="p-8 text-center">
            <Activity size={32} className="mx-auto mb-2 text-gray-600" />
            <p className="text-sm text-gray-500">No actions recorded</p>
          </div>
        ) : (
          <div className="divide-y divide-oh-border">
            {[...filteredActions].reverse().map((action) => {
              const Icon = ACTION_ICONS[action.type];
              const StatusIcon = STATUS_ICONS[action.status];
              return (
                <div
                  key={action.id}
                  className="px-4 py-3 hover:bg-oh-hover transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={clsx('p-1.5 rounded-lg flex-shrink-0', ACTION_COLORS[action.type])}>
                      <Icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-oh-text">{action.description}</span>
                        <span className={clsx('flex items-center gap-1', STATUS_COLORS[action.status])}>
                          {action.status === 'running' && (
                            <StatusIcon size={12} className="animate-spin" />
                          )}
                          {action.status !== 'running' && <StatusIcon size={12} />}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="uppercase font-medium">{action.type.replace('_', ' ')}</span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {formatTime(action.timestamp)}
                        </span>
                        {action.duration && (
                          <span className="text-gray-400">
                            ({formatDuration(action.duration)})
                          </span>
                        )}
                      </div>
                      {action.details && (
                        <div className="mt-2 p-2 bg-oh-bg rounded text-xs font-mono text-gray-400 truncate">
                          {action.details}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
