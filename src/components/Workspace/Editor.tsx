'use client';

import { useCallback } from 'react';
import { X, FileCode, Folder } from 'lucide-react';
import dynamic from 'next/dynamic';
import { clsx } from 'clsx';
import { useFileSystem } from '@/hooks/useFileSystem';
import { useWorkspaceStore } from '@/store';
import type { FileNode } from '@/types';

// Dynamic import for Monaco to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-[#282C34] text-gray-400">
      <div className="animate-pulse">Loading editor...</div>
    </div>
  ),
});

export function EditorWorkspace() {
  const { fileTree, openFiles, activeFile, activeFileId, setActiveFile, removeFile, saveFile } =
    useFileSystem();

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      if (activeFileId && value !== undefined) {
        saveFile(activeFileId, value);
      }
    },
    [activeFileId, saveFile]
  );

  return (
    <div className="h-full flex">
      {/* File Explorer */}
      <div className="w-56 bg-[#21252B] border-r border-[#181A1F] flex flex-col">
        <div className="p-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Explorer
        </div>
        <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
          <FileTreeView nodes={fileTree} level={0} />
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col bg-[#282C34]">
        {/* Open File Tabs */}
        {openFiles.length > 0 && (
          <div className="flex bg-[#21252B] border-b border-[#181A1F] overflow-x-auto">
            {openFiles.map((file) => (
              <div
                key={file.id}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 text-xs cursor-pointer border-r border-[#181A1F] transition-colors group',
                  file.id === activeFileId
                    ? 'bg-[#282C34] text-white border-t-2 border-t-blue-500'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-[#2C313A]'
                )}
                onClick={() => setActiveFile(file.id)}
              >
                <FileCode
                  size={12}
                  className={clsx(
                    file.id === activeFileId ? 'text-blue-400' : 'text-yellow-400'
                  )}
                />
                <span>{file.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-[#3E4451] rounded transition-all"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* File Breadcrumb */}
        {activeFile && (
          <div className="flex items-center px-4 py-1.5 bg-[#21252B] text-xs text-gray-400 border-b border-[#181A1F]">
            <span>workspace</span>
            <span className="mx-2 text-gray-600">/</span>
            <span className="text-gray-300">{activeFile.name}</span>
          </div>
        )}

        {/* Monaco Editor */}
        {activeFile ? (
          <div className="flex-1">
            <MonacoEditor
              height="100%"
              language={activeFile.language || 'plaintext'}
              value={activeFile.content}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                fontFamily: 'JetBrains Mono, Consolas, monospace',
                lineNumbers: 'on',
                roundedSelection: true,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                wordWrap: 'on',
                padding: { top: 16 },
              }}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#282C34] text-gray-400">
            <div className="text-center">
              <FileCode size={48} className="mx-auto mb-4 opacity-20" />
              <p>No file open</p>
              <p className="text-xs mt-1">Select a file from the explorer</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FileTreeView({ nodes, level }: { nodes: FileNode[]; level: number }) {
  const { setActiveFile, openFiles } = useFileSystem();

  return (
    <div>
      {nodes.map((node) => {
        const isOpen = openFiles.some((f) => f.id === node.id);

        return (
          <div key={node.id}>
            <div
              className={clsx(
                'flex items-center gap-2 px-4 py-1.5 text-sm cursor-pointer transition-colors',
                isOpen
                  ? 'bg-[#2C313A] text-gray-200'
                  : 'text-gray-400 hover:bg-[#2C313A]/50 hover:text-gray-300'
              )}
              style={{ paddingLeft: `${16 + level * 12}px` }}
              onClick={() => {
                if (node.type === 'file') {
                  setActiveFile(node.id);
                }
              }}
            >
              {node.type === 'folder' ? (
                <>
                  <Folder size={14} className="text-blue-400" />
                  <span>{node.name}</span>
                </>
              ) : (
                <>
                  <FileCode
                    size={14}
                    className={clsx(
                      isOpen ? 'text-blue-400' : 'text-yellow-400'
                    )}
                  />
                  <span>{node.name}</span>
                </>
              )}
            </div>
            {node.type === 'folder' && node.children && (
              <FileTreeView nodes={node.children} level={level + 1} />
            )}
          </div>
        );
      })}
    </div>
  );
}
