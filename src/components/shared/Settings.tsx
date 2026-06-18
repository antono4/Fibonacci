'use client';

import { useEffect, useCallback } from 'react';
import { X, Keyboard, Moon, Bell, Shield } from 'lucide-react';
import { clsx } from 'clsx';
import { useWorkspaceStore } from '@/store';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const KEYBOARD_SHORTCUTS = [
  { keys: ['Ctrl', 'Enter'], action: 'Send message' },
  { keys: ['Ctrl', 'K'], action: 'Quick command' },
  { keys: ['Ctrl', 'B'], action: 'Toggle sidebar' },
  { keys: ['Ctrl', '`'], action: 'Focus terminal' },
  { keys: ['Ctrl', '1'], action: 'Switch to Terminal' },
  { keys: ['Ctrl', '2'], action: 'Switch to Editor' },
  { keys: ['Ctrl', '3'], action: 'Switch to Browser' },
  { keys: ['Escape'], action: 'Close modal/dialog' },
];

export function SettingsModal({ isOpen, onClose }: SettingsProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-oh-panel border border-oh-border rounded-xl shadow-2xl animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-oh-border">
          <h2 className="text-lg font-semibold text-oh-text-bright">Settings</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-oh-hover rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Keyboard Shortcuts */}
          <div className="p-4 border-b border-oh-border">
            <div className="flex items-center gap-2 mb-4">
              <Keyboard size={18} className="text-blue-400" />
              <h3 className="font-medium text-oh-text-bright">Keyboard Shortcuts</h3>
            </div>
            <div className="space-y-2">
              {KEYBOARD_SHORTCUTS.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 px-3 bg-oh-surface rounded-lg"
                >
                  <span className="text-sm text-oh-text">{shortcut.action}</span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, i) => (
                      <span key={i}>
                        <kbd className="px-2 py-1 text-xs font-mono bg-oh-hover text-oh-text-bright rounded border border-oh-border">
                          {key}
                        </kbd>
                        {i < shortcut.keys.length - 1 && (
                          <span className="text-gray-500 mx-0.5">+</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Appearance */}
          <div className="p-4 border-b border-oh-border">
            <div className="flex items-center gap-2 mb-4">
              <Moon size={18} className="text-blue-400" />
              <h3 className="font-medium text-oh-text-bright">Appearance</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-oh-text">Theme</span>
                <select className="bg-oh-surface text-oh-text text-sm px-3 py-1.5 rounded border border-oh-border focus:border-blue-500 outline-none">
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-oh-text">Font Size</span>
                <select className="bg-oh-surface text-oh-text text-sm px-3 py-1.5 rounded border border-oh-border focus:border-blue-500 outline-none">
                  <option value="12">12px</option>
                  <option value="13">13px</option>
                  <option value="14" selected>14px</option>
                  <option value="15">15px</option>
                  <option value="16">16px</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-oh-text">Font Family</span>
                <select className="bg-oh-surface text-oh-text text-sm px-3 py-1.5 rounded border border-oh-border focus:border-blue-500 outline-none">
                  <option value="inter">Inter</option>
                  <option value="system">System</option>
                  <option value="mono">Monospace</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="p-4 border-b border-oh-border">
            <div className="flex items-center gap-2 mb-4">
              <Bell size={18} className="text-blue-400" />
              <h3 className="font-medium text-oh-text-bright">Notifications</h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between py-2 cursor-pointer">
                <span className="text-sm text-oh-text">Agent response notifications</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-oh-border bg-oh-surface text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                />
              </label>
              <label className="flex items-center justify-between py-2 cursor-pointer">
                <span className="text-sm text-oh-text">Sound effects</span>
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-oh-border bg-oh-surface text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                />
              </label>
              <label className="flex items-center justify-between py-2 cursor-pointer">
                <span className="text-sm text-oh-text">Error alerts</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-oh-border bg-oh-surface text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                />
              </label>
            </div>
          </div>

          {/* About */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={18} className="text-blue-400" />
              <h3 className="font-medium text-oh-text-bright">About</h3>
            </div>
            <div className="space-y-2 text-sm text-oh-text">
              <p>OpenHands Clone v1.0.0</p>
              <p className="text-gray-500">
                A web-based AI coding assistant interface inspired by OpenHands.
                Built with Next.js, React, and TypeScript.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
