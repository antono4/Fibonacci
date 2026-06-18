'use client';

import { useState } from 'react';
import {
  Bot,
  Cpu,
  Wifi,
  WifiOff,
  Clock,
  Play,
  Pause,
  Square,
  RefreshCw,
  Settings,
  CheckCircle,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAgentStore } from '@/store/agent';
import type { AgentStatus, AgentState } from '@/types/agent';

const STATUS_CONFIG: Record<AgentStatus, { color: string; icon: typeof Play; label: string }> = {
  idle: { color: 'text-gray-400 bg-gray-500/20', icon: Clock, label: 'Idle' },
  running: { color: 'text-green-400 bg-green-500/20', icon: Play, label: 'Running' },
  paused: { color: 'text-yellow-400 bg-yellow-500/20', icon: Pause, label: 'Paused' },
  error: { color: 'text-red-400 bg-red-500/20', icon: AlertCircle, label: 'Error' },
  stopped: { color: 'text-gray-400 bg-gray-500/20', icon: Square, label: 'Stopped' },
};

const STATE_CONFIG: Record<AgentState, { color: string; description: string }> = {
  idle: { color: 'text-gray-400', description: 'Agent is waiting for input' },
  running: { color: 'text-green-400', description: 'Agent is processing' },
  paused: { color: 'text-yellow-400', description: 'Agent is paused' },
  error: { color: 'text-red-400', description: 'An error occurred' },
  stopped: { color: 'text-gray-400', description: 'Agent has stopped' },
  waiting_for_user: { color: 'text-blue-400', description: 'Waiting for user confirmation' },
  init: { color: 'text-purple-400', description: 'Initializing agent' },
  finished: { color: 'text-green-400', description: 'Task completed' },
};

export function AgentStatus() {
  const { agent, backends, activeBackendId, setAgentStatus } = useAgentStore();
  const [showDetails, setShowDetails] = useState(false);

  const statusConfig = STATUS_CONFIG[agent.status];
  const StatusIcon = statusConfig.icon;
  const activeBackend = backends.find((b) => b.id === activeBackendId);

  const handleStart = () => setAgentStatus('running');
  const handlePause = () => setAgentStatus('paused');
  const handleStop = () => setAgentStatus('stopped');

  return (
    <div className="bg-oh-surface border border-oh-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-oh-border">
        <div className="flex items-center gap-2">
          <Bot size={18} className="text-blue-400" />
          <span className="font-medium text-oh-text-bright">Agent Status</span>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="p-1 text-gray-400 hover:text-oh-text rounded hover:bg-oh-hover transition-colors"
        >
          <Settings size={14} />
        </button>
      </div>

      {/* Status Display */}
      <div className="p-4 space-y-4">
        {/* Agent Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={clsx('p-2 rounded-lg', agent.status === 'running' ? 'bg-green-500/20' : 'bg-oh-hover')}>
              <Bot size={24} className={agent.status === 'running' ? 'text-green-400' : 'text-gray-400'} />
            </div>
            <div>
              <h3 className="font-medium text-oh-text">{agent.name}</h3>
              <p className="text-xs text-gray-500">{agent.id}</p>
            </div>
          </div>
          <span className={clsx('flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium', statusConfig.color)}>
            <StatusIcon size={12} />
            {statusConfig.label}
          </span>
        </div>

        {/* Model Info */}
        <div className="flex items-center gap-2 text-sm">
          <Cpu size={14} className="text-purple-400" />
          <span className="text-gray-400">Model:</span>
          <span className="text-oh-text font-mono text-xs">{agent.model}</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-400">{agent.provider}</span>
        </div>

        {/* Backend Status */}
        {activeBackend && (
          <div className="flex items-center gap-2 text-sm">
            {activeBackend.status === 'connected' ? (
              <Wifi size={14} className="text-green-400" />
            ) : activeBackend.status === 'error' ? (
              <WifiOff size={14} className="text-red-400" />
            ) : (
              <WifiOff size={14} className="text-gray-400" />
            )}
            <span className="text-gray-400">Backend:</span>
            <span className="text-oh-text">{activeBackend.name}</span>
            <span className={clsx('text-xs', 
              activeBackend.status === 'connected' ? 'text-green-400' : 
              activeBackend.status === 'error' ? 'text-red-400' : 'text-gray-500'
            )}>
              ({activeBackend.status})
            </span>
          </div>
        )}

        {/* Current Task */}
        {agent.currentTask && (
          <div className="bg-oh-hover rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Current Task</p>
            <p className="text-sm text-oh-text truncate">{agent.currentTask}</p>
          </div>
        )}

        {/* State Info */}
        <div className="flex items-center gap-2 text-sm">
          <span className={clsx('w-2 h-2 rounded-full', agent.status === 'running' ? 'bg-green-400 animate-pulse' : 'bg-gray-500')} />
          <span className={clsx('text-xs', STATE_CONFIG[agent.state].color)}>
            {STATE_CONFIG[agent.state].description}
          </span>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-2 pt-2">
          {agent.status === 'idle' || agent.status === 'stopped' ? (
            <button
              onClick={handleStart}
              className="flex-1 flex items-center justify-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-lg transition-colors"
            >
              <Play size={16} />
              <span className="text-sm font-medium">Start</span>
            </button>
          ) : agent.status === 'running' ? (
            <>
              <button
                onClick={handlePause}
                className="flex-1 flex items-center justify-center gap-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 px-4 py-2 rounded-lg transition-colors"
              >
                <Pause size={16} />
                <span className="text-sm font-medium">Pause</span>
              </button>
              <button
                onClick={handleStop}
                className="flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors"
              >
                <Square size={16} />
              </button>
            </>
          ) : agent.status === 'paused' ? (
            <>
              <button
                onClick={handleStart}
                className="flex-1 flex items-center justify-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-lg transition-colors"
              >
                <Play size={16} />
                <span className="text-sm font-medium">Resume</span>
              </button>
              <button
                onClick={handleStop}
                className="flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors"
              >
                <Square size={16} />
              </button>
            </>
          ) : null}
        </div>
      </div>

      {/* Details Panel */}
      {showDetails && (
        <div className="border-t border-oh-border p-4 bg-oh-bg/50">
          <h4 className="text-xs font-medium text-gray-400 mb-3">Configuration</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Agent ID</span>
              <span className="text-oh-text font-mono">{agent.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">State</span>
              <span className={STATE_CONFIG[agent.state].color}>{agent.state}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Provider</span>
              <span className="text-oh-text">{agent.provider || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Backend</span>
              <span className="text-oh-text">{agent.backend || 'local'}</span>
            </div>
            {agent.startedAt && (
              <div className="flex justify-between">
                <span className="text-gray-500">Started</span>
                <span className="text-oh-text">{new Date(agent.startedAt).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
