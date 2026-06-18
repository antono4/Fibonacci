'use client';

import { useState, useCallback } from 'react';
import { ChevronDown, Cpu, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { useWorkspaceStore } from '@/store';
import type { Model } from '@/types';

const AVAILABLE_MODELS: Model[] = [
  { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
  { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', provider: 'Anthropic' },
  { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', provider: 'Anthropic' },
  { id: 'gpt-4o-2024-08-06', name: 'GPT-4o', provider: 'OpenAI' },
  { id: 'gpt-4-turbo-2024-04-09', name: 'GPT-4 Turbo', provider: 'OpenAI' },
  { id: 'gemini-1.5-pro-002', name: 'Gemini 1.5 Pro', provider: 'Google' },
];

export function ModelSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedModel, setSelectedModel } = useWorkspaceStore();

  const handleSelect = useCallback(
    (model: Model) => {
      setSelectedModel(model);
      setIsOpen(false);
    },
    [setSelectedModel]
  );

  return (
    <div className="px-4 py-3 border-b border-oh-border space-y-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400 font-medium">Model</label>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between w-full bg-oh-surface text-sm text-oh-text p-2.5 rounded border border-oh-hover hover:border-gray-400 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Cpu size={14} className="text-blue-400" />
              <span className="truncate">{selectedModel.name}</span>
            </div>
            <ChevronDown
              size={14}
              className={clsx(
                'text-gray-400 transition-transform',
                isOpen && 'rotate-180'
              )}
            />
          </button>

          {isOpen && (
            <div className="absolute z-50 mt-1 w-[calc(100%-2rem)] bg-oh-surface border border-oh-hover rounded-lg shadow-xl overflow-hidden animate-fade-in">
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {AVAILABLE_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleSelect(model)}
                    className={clsx(
                      'flex items-center justify-between w-full px-3 py-2.5 text-sm text-left hover:bg-oh-hover transition-colors',
                      selectedModel.id === model.id && 'bg-oh-hover text-blue-400'
                    )}
                  >
                    <div>
                      <div className="font-medium text-oh-text-bright">
                        {model.name}
                      </div>
                      <div className="text-xs text-gray-500">{model.provider}</div>
                    </div>
                    {selectedModel.id === model.id && (
                      <Check size={16} className="text-blue-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
