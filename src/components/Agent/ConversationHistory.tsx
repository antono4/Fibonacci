'use client';

import { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Trash2,
  Clock,
  ChevronRight,
  Search,
  MoreVertical,
  Edit3,
  Copy,
  Pin,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAgentStore } from '@/store/agent';

export function ConversationHistory() {
  const {
    conversations,
    activeConversationId,
    createConversation,
    deleteConversation,
    setActiveConversation,
    updateConversationTitle,
  } = useAgentStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateConversation = () => {
    const newConv = createConversation();
    setActiveConversation(newConv.id);
  };

  const handleStartEdit = (id: string, title: string) => {
    setEditingId(id);
    setEditTitle(title);
  };

  const handleSaveEdit = () => {
    if (editingId && editTitle.trim()) {
      updateConversationTitle(editingId, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setEditTitle('');
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="bg-oh-surface border border-oh-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-oh-border">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-blue-400" />
          <span className="font-medium text-oh-text-bright">Conversations</span>
        </div>
        <button
          onClick={handleCreateConversation}
          className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded transition-colors"
          title="New conversation"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-oh-border">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-oh-hover border border-oh-border rounded pl-9 pr-3 py-1.5 text-sm text-oh-text placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare size={32} className="mx-auto mb-2 text-gray-600" />
            <p className="text-sm text-gray-500">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreateConversation}
                className="mt-3 text-sm text-blue-400 hover:text-blue-300"
              >
                Create your first conversation
              </button>
            )}
          </div>
        ) : (
          <div className="py-1">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                className={clsx(
                  'group relative px-3 py-2.5 cursor-pointer transition-colors',
                  conv.id === activeConversationId
                    ? 'bg-blue-500/10 border-l-2 border-blue-500'
                    : 'hover:bg-oh-hover border-l-2 border-transparent'
                )}
                onClick={() => setActiveConversation(conv.id)}
              >
                {editingId === conv.id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={handleSaveEdit}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-oh-bg border border-blue-500 rounded px-2 py-1 text-sm text-oh-text focus:outline-none"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <MessageSquare size={14} className="text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-oh-text truncate">{conv.title}</span>
                      </div>
                      <span className="text-xs text-gray-500">{formatTime(conv.updatedAt)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500 ml-6">
                        {conv.messages.length} message{conv.messages.length !== 1 ? 's' : ''}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEdit(conv.id, conv.title);
                          }}
                          className="p-1 text-gray-400 hover:text-oh-text rounded"
                          title="Rename"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Delete this conversation?')) {
                              deleteConversation(conv.id);
                            }
                          }}
                          className="p-1 text-gray-400 hover:text-red-400 rounded"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-oh-border bg-oh-bg/50">
        <p className="text-xs text-gray-500">
          {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
