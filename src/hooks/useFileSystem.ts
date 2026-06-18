'use client';

import { useCallback } from 'react';
import { useWorkspaceStore } from '@/store';
import type { FileNode } from '@/types';

export function useFileSystem() {
  const {
    fileTree,
    openFiles,
    activeFileId,
    setFileTree,
    addFile,
    updateFile,
    deleteFile,
    setActiveFile,
  } = useWorkspaceStore();

  const activeFile = openFiles.find((f) => f.id === activeFileId);

  const createFile = useCallback(
    (name: string, content: string = '', language?: string) => {
      const id = `file-${Date.now()}`;
      const newFile: FileNode = {
        id,
        name,
        type: 'file',
        path: `/workspace/${name}`,
        content,
        language: language || getLanguageFromFileName(name),
      };
      addFile(newFile);
      return id;
    },
    [addFile]
  );

  const saveFile = useCallback(
    (id: string, content: string) => {
      updateFile(id, content);
    },
    [updateFile]
  );

  const removeFile = useCallback(
    (id: string) => {
      deleteFile(id);
    },
    [deleteFile]
  );

  const findFile = useCallback(
    (path: string): FileNode | undefined => {
      return findInTree(fileTree, path);
    },
    [fileTree]
  );

  const readFile = useCallback(
    (id: string): string | undefined => {
      const file = openFiles.find((f) => f.id === id);
      return file?.content;
    },
    [openFiles]
  );

  const getLanguageFromFileName = (name: string): string => {
    const ext = name.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      py: 'python',
      json: 'json',
      md: 'markdown',
      css: 'css',
      html: 'html',
      xml: 'xml',
      yml: 'yaml',
      yaml: 'yaml',
      sh: 'shell',
      bash: 'shell',
      sql: 'sql',
      go: 'go',
      rs: 'rust',
      java: 'java',
      c: 'c',
      cpp: 'cpp',
      h: 'c',
      hpp: 'cpp',
    };
    return languageMap[ext || ''] || 'plaintext';
  };

  return {
    fileTree,
    openFiles,
    activeFile,
    activeFileId,
    createFile,
    saveFile,
    removeFile,
    findFile,
    readFile,
    setActiveFile,
    getLanguageFromFileName,
  };
}

// Helper functions
function findInTree(tree: FileNode[], path: string): FileNode | undefined {
  for (const node of tree) {
    if (node.path === path) return node;
    if (node.children) {
      const found = findInTree(node.children, path);
      if (found) return found;
    }
  }
  return undefined;
}

function flattenTree(tree: FileNode[]): FileNode[] {
  const result: FileNode[] = [];
  for (const node of tree) {
    result.push(node);
    if (node.children) {
      result.push(...flattenTree(node.children));
    }
  }
  return result;
}

export function useFileTree() {
  const { fileTree, setFileTree } = useWorkspaceStore();

  const addToTree = useCallback(
    (parentPath: string, node: FileNode) => {
      const newTree = addNodeToTree(fileTree, parentPath, node);
      setFileTree(newTree);
    },
    [fileTree, setFileTree]
  );

  const removeFromTree = useCallback(
    (path: string) => {
      const newTree = removeNodeFromTree(fileTree, path);
      setFileTree(newTree);
    },
    [fileTree, setFileTree]
  );

  const renameInTree = useCallback(
    (oldPath: string, newPath: string, newName: string) => {
      const newTree = renameNodeInTree(fileTree, oldPath, newPath, newName);
      setFileTree(newTree);
    },
    [fileTree, setFileTree]
  );

  return {
    fileTree,
    flattenTree: () => flattenTree(fileTree),
    addToTree,
    removeFromTree,
    renameInTree,
  };
}

function addNodeToTree(
  tree: FileNode[],
  parentPath: string,
  node: FileNode
): FileNode[] {
  return tree.map((n) => {
    if (n.path === parentPath && n.type === 'folder') {
      return {
        ...n,
        children: [...(n.children || []), node],
      };
    }
    if (n.children) {
      return {
        ...n,
        children: addNodeToTree(n.children, parentPath, node),
      };
    }
    return n;
  });
}

function removeNodeFromTree(tree: FileNode[], path: string): FileNode[] {
  return tree
    .filter((n) => n.path !== path)
    .map((n) => ({
      ...n,
      children: n.children ? removeNodeFromTree(n.children, path) : undefined,
    }));
}

function renameNodeInTree(
  tree: FileNode[],
  oldPath: string,
  newPath: string,
  newName: string
): FileNode[] {
  return tree.map((n) => {
    if (n.path === oldPath) {
      return { ...n, path: newPath, name: newName };
    }
    if (n.children) {
      return {
        ...n,
        children: renameNodeInTree(n.children, oldPath, newPath, newName),
      };
    }
    return n;
  });
}
