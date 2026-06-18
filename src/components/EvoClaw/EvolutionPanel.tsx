'use client';

import { useState } from 'react';
import { 
  GitBranch, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Sparkles,
  FileEdit,
  Brain,
  ArrowRight
} from 'lucide-react';
import { clsx } from 'clsx';
import { useEvoClawStore } from '@/store/evoclaw';
import type { Reflection, Proposal, EvolutionEvent } from '@/types/evoclaw';

type TabType = 'reflections' | 'proposals' | 'history';

export function EvolutionPanel() {
  const { reflections, proposals, evolutionHistory, governanceLevel, setGovernanceLevel } = useEvoClawStore();
  const [activeTab, setActiveTab] = useState<TabType>('reflections');

  const pendingReflections = reflections.filter(r => r.status === 'pending');
  const pendingProposals = proposals.filter(p => p.status === 'pending');

  return (
    <div className="h-full flex flex-col bg-oh-panel">
      {/* Header */}
      <div className="p-4 border-b border-oh-border">
        <div className="flex items-center gap-2 mb-3">
          <GitBranch size={18} className="text-green-400" />
          <h2 className="font-semibold text-oh-text-bright">Evolution Center</h2>
        </div>

        {/* Governance Level */}
        <div className="mb-3">
          <label className="text-xs text-gray-400 mb-1 block">Governance Level</label>
          <select
            value={governanceLevel}
            onChange={(e) => setGovernanceLevel(e.target.value as typeof governanceLevel)}
            className="w-full bg-oh-surface border border-oh-border rounded px-2 py-1.5 text-sm text-oh-text focus:outline-none focus:border-green-500"
          >
            <option value="autonomous">🔄 Autonomous - Auto-apply MUTABLE changes</option>
            <option value="supervised">👁️ Supervised - Notify and review</option>
            <option value="gated">🔒 Gated - Manual approval required</option>
          </select>
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          <TabButton
            active={activeTab === 'reflections'}
            onClick={() => setActiveTab('reflections')}
            count={pendingReflections.length}
            label="Reflections"
          />
          <TabButton
            active={activeTab === 'proposals'}
            onClick={() => setActiveTab('proposals')}
            count={pendingProposals.length}
            label="Proposals"
          />
          <TabButton
            active={activeTab === 'history'}
            onClick={() => setActiveTab('history')}
            count={evolutionHistory.length}
            label="History"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === 'reflections' && (
          <ReflectionsList reflections={reflections} />
        )}
        {activeTab === 'proposals' && (
          <ProposalsList proposals={proposals} />
        )}
        {activeTab === 'history' && (
          <EvolutionHistory events={evolutionHistory} />
        )}
      </div>
    </div>
  );
}

function TabButton({ 
  active, 
  onClick, 
  count, 
  label 
}: { 
  active: boolean; 
  onClick: () => void; 
  count: number; 
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex items-center gap-1.5 px-3 py-1.5 text-xs rounded transition-colors',
        active
          ? 'bg-green-500/20 text-green-400'
          : 'text-gray-400 hover:bg-oh-hover'
      )}
    >
      {label}
      {count > 0 && (
        <span className="bg-green-500/30 text-green-400 px-1.5 py-0.5 rounded-full text-[10px]">
          {count}
        </span>
      )}
    </button>
  );
}

function ReflectionsList({ reflections }: { reflections: Reflection[] }) {
  if (reflections.length === 0) {
    return (
      <EmptyState 
        icon={Brain}
        title="No Reflections Yet"
        description="Reflections are created when notable experiences occur"
      />
    );
  }

  return (
    <div className="space-y-3">
      {reflections.map((reflection) => (
        <div
          key={reflection.id}
          className="bg-oh-surface border border-oh-border rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Brain size={14} className="text-purple-400" />
              <span className="text-sm font-medium text-oh-text">Reflection</span>
            </div>
            <StatusBadge status={reflection.status} />
          </div>

          <div className="space-y-2 mb-3">
            <div>
              <span className="text-xs text-gray-500">Experiences:</span>
              <p className="text-sm text-oh-text">{reflection.experiences.length} items analyzed</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Insights:</span>
              <ul className="text-sm text-oh-text list-disc list-inside">
                {reflection.insights.map((insight, i) => (
                  <li key={i}>{insight}</li>
                ))}
              </ul>
            </div>
            {reflection.gaps.length > 0 && (
              <div>
                <span className="text-xs text-yellow-500">Gaps Found:</span>
                <ul className="text-sm text-yellow-400 list-disc list-inside">
                  {reflection.gaps.map((gap, i) => (
                    <li key={i}>{gap}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {reflection.status === 'pending' && (
              <>
                <button className="flex-1 bg-green-500/20 text-green-400 px-3 py-1.5 rounded text-xs hover:bg-green-500/30 transition-colors">
                  Approve
                </button>
                <button className="flex-1 bg-red-500/20 text-red-400 px-3 py-1.5 rounded text-xs hover:bg-red-500/30 transition-colors">
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ProposalsList({ proposals }: { proposals: Proposal[] }) {
  if (proposals.length === 0) {
    return (
      <EmptyState 
        icon={FileEdit}
        title="No Proposals Yet"
        description="Proposals are created from approved reflections"
      />
    );
  }

  return (
    <div className="space-y-3">
      {proposals.map((proposal) => (
        <div
          key={proposal.id}
          className="bg-oh-surface border border-oh-border rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileEdit size={14} className="text-blue-400" />
              <span className="text-sm font-medium text-oh-text">Soul Proposal</span>
            </div>
            <StatusBadge status={proposal.status} />
          </div>

          <div className="space-y-2 mb-3">
            <div>
              <span className="text-xs text-gray-500">Rationale:</span>
              <p className="text-sm text-oh-text">{proposal.rationale}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Proposed Change:</span>
              <div className="bg-oh-bg p-2 rounded text-sm font-mono text-blue-400">
                {proposal.proposedChange}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {proposal.status === 'pending' && (
              <>
                <button className="flex-1 bg-green-500/20 text-green-400 px-3 py-1.5 rounded text-xs hover:bg-green-500/30 transition-colors">
                  Apply Change
                </button>
                <button className="flex-1 bg-red-500/20 text-red-400 px-3 py-1.5 rounded text-xs hover:bg-red-500/30 transition-colors">
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function EvolutionHistory({ events }: { events: EvolutionEvent[] }) {
  if (events.length === 0) {
    return (
      <EmptyState 
        icon={Sparkles}
        title="No Evolution History"
        description="Applied changes will appear here"
      />
    );
  }

  return (
    <div className="relative">
      {/* Timeline */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-green-500 via-blue-500 to-purple-500" />
      
      <div className="space-y-4 pl-8">
        {[...events].reverse().map((event) => (
          <div key={event.id} className="relative">
            <div className="absolute -left-8 w-4 h-4 rounded-full bg-oh-surface border-2 border-green-500" />
            <div className="bg-oh-surface border border-oh-border rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">
                  {new Date(event.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-oh-text">{event.change}</p>
              <span className="text-[10px] text-gray-500 mt-1 block">
                {event.type.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: typeof Brain; 
  title: string; 
  description: string;
}) {
  return (
    <div className="text-center py-12">
      <Icon size={32} className="mx-auto mb-3 text-gray-600" />
      <h3 className="text-sm font-medium text-gray-400 mb-1">{title}</h3>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: Reflection['status'] | Proposal['status'] }) {
  const config = {
    pending: { icon: Clock, color: 'text-yellow-400 bg-yellow-500/20', label: 'Pending' },
    approved: { icon: CheckCircle, color: 'text-green-400 bg-green-500/20', label: 'Approved' },
    rejected: { icon: XCircle, color: 'text-red-400 bg-red-500/20', label: 'Rejected' },
    applied: { icon: CheckCircle, color: 'text-green-400 bg-green-500/20', label: 'Applied' },
  }[status];

  const Icon = config.icon;

  return (
    <span className={clsx('flex items-center gap-1 px-2 py-0.5 rounded text-[10px]', config.color)}>
      <Icon size={10} />
      {config.label}
    </span>
  );
}
