'use client';

import { useState, useCallback, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Plus,
  X,
  Search,
  Globe,
  Home,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useWorkspaceStore } from '@/store';
import type { BrowserTab } from '@/types';

export function BrowserPreview() {
  const {
    browserTabs,
    activeBrowserTabId,
    activeBrowserTab,
    addBrowserTab,
    setActiveBrowserTab,
    updateBrowserTab,
    closeBrowserTab,
  } = useBrowserTabs();

  const [inputUrl, setInputUrl] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleUrlSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (inputUrl.trim() && activeBrowserTabId) {
        let url = inputUrl.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = `http://${url}`;
        }
        updateBrowserTab(activeBrowserTabId, { url, isLoading: true });
        setInputUrl('');
        
        // Simulate loading
        setTimeout(() => {
          updateBrowserTab(activeBrowserTabId, { isLoading: false });
        }, 1000);
      }
    },
    [inputUrl, activeBrowserTabId, updateBrowserTab]
  );

  const handleRefresh = useCallback(() => {
    if (activeBrowserTabId) {
      updateBrowserTab(activeBrowserTabId, { isLoading: true });
      iframeRef.current?.contentWindow?.location.reload();
      setTimeout(() => {
        updateBrowserTab(activeBrowserTabId, { isLoading: false });
      }, 1000);
    }
  }, [activeBrowserTabId, updateBrowserTab]);

  const handleNewTab = useCallback(() => {
    addBrowserTab({
      id: `browser-${Date.now()}`,
      url: 'about:blank',
      title: 'New Tab',
      canGoBack: false,
      canGoForward: false,
      isLoading: false,
    });
  }, [addBrowserTab]);

  const handleIframeLoad = useCallback(() => {
    if (activeBrowserTabId) {
      updateBrowserTab(activeBrowserTabId, { isLoading: false });
    }
  }, [activeBrowserTabId, updateBrowserTab]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Tab Bar */}
      <div className="flex items-center bg-[#F1F3F4] border-b border-gray-300 overflow-x-auto">
        {browserTabs.map((tab) => (
          <div
            key={tab.id}
            className={clsx(
              'flex items-center gap-2 px-3 py-2 text-sm border-r border-gray-300 cursor-pointer min-w-[120px] max-w-[200px] group',
              tab.id === activeBrowserTabId
                ? 'bg-white text-gray-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-50'
            )}
            onClick={() => setActiveBrowserTab(tab.id)}
          >
            <Globe size={14} className="flex-shrink-0" />
            <span className="truncate flex-1">{tab.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeBrowserTab(tab.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-200 rounded transition-all"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <button
          onClick={handleNewTab}
          className="p-2 text-gray-500 hover:bg-gray-200 transition-colors"
          title="New Tab"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center gap-2 p-2 bg-[#F1F3F4] border-b border-gray-300">
        <div className="flex items-center gap-1">
          <button
            className="p-1.5 hover:bg-gray-200 rounded-full text-gray-600 transition-colors disabled:opacity-50"
            disabled={!activeBrowserTab?.canGoBack}
            title="Go Back"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            className="p-1.5 hover:bg-gray-200 rounded-full text-gray-600 transition-colors disabled:opacity-50"
            disabled={!activeBrowserTab?.canGoForward}
            title="Go Forward"
          >
            <ArrowRight size={16} />
          </button>
          <button
            onClick={handleRefresh}
            className={clsx(
              'p-1.5 hover:bg-gray-200 rounded-full text-gray-600 transition-colors',
              activeBrowserTab?.isLoading && 'animate-spin'
            )}
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={() => {
              if (activeBrowserTabId) {
                updateBrowserTab(activeBrowserTabId, {
                  url: 'about:blank',
                  title: 'New Tab',
                });
              }
            }}
            className="p-1.5 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
            title="Home"
          >
            <Home size={16} />
          </button>
        </div>

        {/* URL Bar */}
        <form
          onSubmit={handleUrlSubmit}
          className="flex-1 flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-300 shadow-sm"
        >
          <Search size={14} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Enter URL or search..."
            className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
          />
        </form>
      </div>

      {/* Browser Content */}
      <div className="flex-1 relative bg-gray-50">
        {activeBrowserTab?.url && activeBrowserTab.url !== 'about:blank' ? (
          <iframe
            ref={iframeRef}
            src={activeBrowserTab.url}
            className="w-full h-full border-0"
            onLoad={handleIframeLoad}
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center space-y-4">
              <Globe size={64} className="mx-auto opacity-20" />
              <p className="text-lg">Browser Preview</p>
              <p className="text-sm max-w-md">
                Enter a URL above to preview websites or web applications.
                <br />
                Ask the agent to run your web app to see it here.
              </p>
              <div className="text-xs text-gray-400 space-y-1">
                <p>Tips:</p>
                <p>• Type a URL and press Enter to navigate</p>
                <p>• The agent can run development servers for you</p>
                <p>• Click the home button to reset</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {activeBrowserTab?.isLoading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="animate-spin text-blue-500">
              <RefreshCw size={32} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Custom hook for browser tab management
function useBrowserTabs() {
  const {
    browserTabs,
    activeBrowserTabId,
    addBrowserTab,
    setActiveBrowserTab,
    updateBrowserTab,
    closeBrowserTab,
  } = useWorkspaceStore();

  const activeBrowserTab = browserTabs.find((t) => t.id === activeBrowserTabId);

  return {
    browserTabs,
    activeBrowserTabId,
    activeBrowserTab,
    addBrowserTab,
    setActiveBrowserTab,
    updateBrowserTab,
    closeBrowserTab,
  };
}
