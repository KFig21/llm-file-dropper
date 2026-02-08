import { useState, useCallback } from 'react';
import type { FileNode } from '../types';

export function useFileSystem() {
  const [rootNode, setRootNode] = useState<FileNode | null>(null);
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set());
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [fileStats, setFileStats] = useState<Record<string, number>>({});
  const [directoryHandle, setDirectoryHandle] = useState<FileSystemDirectoryHandle | null>(null);

  // Helper: Recursively build the tree
  const buildFileTree = async (handle: FileSystemHandle, path = ''): Promise<FileNode> => {
    const currentPath = path ? `${path}/${handle.name}` : handle.name;
    if (handle.kind === 'file') {
      return { name: handle.name, kind: 'file', path: currentPath, handle };
    }
    const dirHandle = handle as FileSystemDirectoryHandle;
    const children: FileNode[] = [];
    for await (const entry of dirHandle.values()) {
      if (['node_modules', '.git', 'dist'].includes(entry.name)) continue;
      children.push(await buildFileTree(entry, currentPath));
    }
    children.sort((a, b) => {
      if (a.kind === b.kind) return a.name.localeCompare(b.name);
      return a.kind === 'directory' ? -1 : 1;
    });
    return { name: handle.name, kind: 'directory', path: currentPath, handle, children };
  };

  const handleOpenFolder = async () => {
    try {
      const dirHandle = await window.showDirectoryPicker();
      setDirectoryHandle(dirHandle); // Save handle for refresh
      const tree = await buildFileTree(dirHandle);
      setRootNode(tree);
      setSelectedPaths(new Set());
      setExpandedPaths(new Set([tree.path]));
      setFileStats({});
    } catch (err) {
      console.error('User cancelled or API not supported', err);
    }
  };

  const refresh = async () => {
    if (!directoryHandle) return;
    setLoading(true);
    try {
      const tree = await buildFileTree(directoryHandle);
      setRootNode(tree);
      // We keep selectedPaths and expandedPaths so the user doesn't lose their place!
    } catch (err) {
      console.error('Refresh failed', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to count lines
  const countFileLines = async (node: FileNode) => {
    if (node.kind !== 'file' || fileStats[node.path]) return; // Don't recount if exists
    try {
      const fileHandle = node.handle as FileSystemFileHandle;
      const file = await fileHandle.getFile();
      if (file.type.startsWith('image')) return;
      const text = await file.text();
      const lines = text.split('\n').length;
      setFileStats((prev) => ({ ...prev, [node.path]: lines }));
    } catch (error) {
      console.error('Error reading file lines', error);
    }
  };

  const toggleSelection = useCallback(
    (path: string, isDir: boolean, node: FileNode) => {
      setSelectedPaths((prev) => {
        const next = new Set(prev);
        const isCurrentlySelected = next.has(path);

        const toggleNode = (n: FileNode, forceState: boolean) => {
          if (forceState) {
            next.add(n.path);
            if (n.kind === 'file') countFileLines(n);
          } else {
            next.delete(n.path);
          }
          if (n.children) n.children.forEach((child) => toggleNode(child, forceState));
        };

        if (isDir) toggleNode(node, !isCurrentlySelected);
        else {
          if (isCurrentlySelected) next.delete(path);
          else {
            next.add(path);
            countFileLines(node);
          }
        }
        return next;
      });
    },
    [fileStats],
  );

  const generateOutput = useCallback(async () => {
    if (!rootNode) return '';
    let result = '';
    const processNode = async (node: FileNode) => {
      if (node.kind === 'file' && selectedPaths.has(node.path)) {
        const fileHandle = node.handle as FileSystemFileHandle;
        const file = await fileHandle.getFile();
        if (file.type.startsWith('image') || file.name.endsWith('.ico')) return;
        const text = await file.text();
        result += `// ${node.path}\n\n${text}\n\n`;
      }
      if (node.children) {
        for (const child of node.children) await processNode(child);
      }
    };
    await processNode(rootNode);
    return result.trim();
  }, [rootNode, selectedPaths]);

  const toggleExpand = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  const toggleExpandAll = useCallback(
    (expand: boolean) => {
      if (!expand) {
        setExpandedPaths(new Set());
        return;
      }

      if (!rootNode) return;

      const allPaths = new Set<string>();
      const collectPaths = (node: FileNode) => {
        if (node.kind === 'directory') {
          allPaths.add(node.path);
          node.children?.forEach(collectPaths);
        }
      };

      collectPaths(rootNode);
      setExpandedPaths(allPaths);
    },
    [rootNode],
  );

  return {
    rootNode,
    selectedPaths,
    expandedPaths,
    loading,
    fileStats,
    handleOpenFolder,
    refresh,
    toggleSelection,
    toggleExpand,
    toggleExpandAll,
    generateOutput,
  };
}
