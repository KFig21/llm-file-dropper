import { useState, useCallback, useRef, useEffect } from 'react';
import './App.css';

// --- Types ---
type FileNode = {
  name: string;
  kind: 'file' | 'directory';
  path: string;
  handle: FileSystemHandle;
  children?: FileNode[];
};

// file type icons
const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();

  switch (ext) {
    case 'ts':
    case 'tsx':
      return { icon: '', color: '#3178c6', label: 'TS' }; // Blue
    case 'js':
    case 'jsx':
      return { icon: '', color: '#f7df1e', label: 'JS' }; // Yellow
    case 'html':
      return { icon: '', color: '#e34f26', label: 'HTML' }; // Orange
    case 'css':
      return { icon: '', color: '#1572b6', label: 'CSS' }; // Blue
    case 'scss':
    case 'sass':
      return { icon: '', color: '#c6308fff', label: 'SCSS' }; // Pink
    case 'json':
      return { icon: '', color: '#cbcb41', label: 'JSON' }; // Yellowish
    case 'md':
      return { icon: '', color: '#ffffff', label: 'MD' };
    case 'svg':
    case 'png':
    case 'jpg':
      return { icon: '', color: '#a074c4', label: 'IMG' };
    default:
      return { icon: '', color: '#8b949e', label: 'FILE' };
  }
};

// --- Recursive Tree Component ---
const FileTreeItem = ({
  node,
  selectedPaths,
  toggleSelection,
}: {
  node: FileNode;
  selectedPaths: Set<string>;
  toggleSelection: (path: string, isDir: boolean, node: FileNode) => void;
}) => {
  const isSelected = selectedPaths.has(node.path);
  const fileInfo = node.kind === 'file' ? getFileIcon(node.name) : null;

  return (
    <div style={{ marginLeft: '16px', fontFamily: 'Inter, system-ui' }}>
      <div className="tree-row">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleSelection(node.path, node.kind === 'directory', node)}
        />

        {node.kind === 'directory' ? (
          <span className="folder-icon">📁</span>
        ) : (
          <span className="file-badge" style={{ backgroundColor: fileInfo?.color }}>
            {fileInfo?.label}
          </span>
        )}

        <span className={`node-name ${isSelected ? 'selected' : ''}`}>{node.name}</span>
      </div>

      {node.children &&
        node.children.map((child) => (
          <FileTreeItem
            key={child.path}
            node={child}
            selectedPaths={selectedPaths}
            toggleSelection={toggleSelection}
          />
        ))}
    </div>
  );
};

export default function App() {
  const [rootNode, setRootNode] = useState<FileNode | null>(null);
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set());
  const [outputText, setOutputText] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Load Directory Structure
  const handleOpenFolder = async () => {
    try {
      const dirHandle = await window.showDirectoryPicker();
      const tree = await buildFileTree(dirHandle);
      setRootNode(tree);
      setSelectedPaths(new Set()); // Reset selection
    } catch (err) {
      console.error('User cancelled or API not supported', err);
    }
  };

  // Helper: Recursively build the tree and path
  const buildFileTree = async (handle: FileSystemHandle, path = ''): Promise<FileNode> => {
    const currentPath = path ? `${path}/${handle.name}` : handle.name;

    if (handle.kind === 'file') {
      return { name: handle.name, kind: 'file', path: currentPath, handle };
    }

    // It's a directory
    const dirHandle = handle as FileSystemDirectoryHandle;
    const children: FileNode[] = [];

    for await (const entry of dirHandle.values()) {
      // Skip node_modules and .git for sanity
      if (['node_modules', '.git', 'dist'].includes(entry.name)) continue;
      children.push(await buildFileTree(entry, currentPath));
    }

    // Sort: Folders top, then files
    children.sort((a, b) => {
      if (a.kind === b.kind) return a.name.localeCompare(b.name);
      return a.kind === 'directory' ? -1 : 1;
    });

    return { name: handle.name, kind: 'directory', path: currentPath, handle, children };
  };

  // 2. Handle Selection (Recursive for Folders)
  const toggleSelection = useCallback((path: string, isDir: boolean, node: FileNode) => {
    setSelectedPaths((prev) => {
      const next = new Set(prev);
      const isCurrentlySelected = next.has(path);

      // Helper to select/deselect all children recursively
      const toggleNode = (n: FileNode, forceState: boolean) => {
        if (forceState) next.add(n.path);
        else next.delete(n.path);
        if (n.children) n.children.forEach((child) => toggleNode(child, forceState));
      };

      if (isDir) {
        toggleNode(node, !isCurrentlySelected);
      } else {
        if (isCurrentlySelected) next.delete(path);
        else next.add(path);
      }
      return next;
    });
  }, []);

  // 3. Generate Output Text
  const generateOutput = async () => {
    if (!rootNode) return;
    setLoading(true);

    let result = '';

    // Helper to find nodes by path and read them
    const processNode = async (node: FileNode) => {
      if (node.kind === 'file' && selectedPaths.has(node.path)) {
        const fileHandle = node.handle as FileSystemFileHandle;
        const file = await fileHandle.getFile();

        // Skip binary files (images, etc) based on basic checks
        if (file.type.startsWith('image') || file.name.endsWith('.ico')) return;

        const text = await file.text();
        result += `// ${node.path}\n\n${text}\n\n`;
      }

      if (node.children) {
        for (const child of node.children) {
          await processNode(child);
        }
      }
    };

    await processNode(rootNode);
    setOutputText(result.trim());
    setLoading(false);
  };

  // copy to clipboard functions

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    alert('Copied to clipboard!');
  };

  const copyMinified = () => {
    const minified = outputText
      .split('\n')
      .map((line) => line.trim()) // Remove leading/trailing spaces
      .filter((line) => line.length > 0) // Remove empty lines
      .join(' '); // Put it all on one line (or use '\n' to keep it somewhat readable)

    navigator.clipboard.writeText(minified);
    alert('Copied minified version to clipboard!');
  };

  // token calculation functions

  const estimateTokens = (text: string) => {
    if (!text) return 0;
    // A good rule of thumb for code:
    // Tokens are roughly (characters / 4)
    return Math.ceil(text.length / 4);
  };

  const totalTokens = estimateTokens(outputText);

  // We'll also calculate what the minified version WOULD be
  const getMinifiedText = (text: string) => {
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join(' ');
  };

  const minifiedTokens = estimateTokens(getMinifiedText(outputText));
  const savings = totalTokens - minifiedTokens;

  // Resizing State
  const [leftWidth, setLeftWidth] = useState(350); // Initial width in px
  const isResizing = useRef(false);

  // 1. Resize Logic
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const startResizing = useCallback((e: React.MouseEvent) => {
    isResizing.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResizing);
    document.body.style.cursor = 'col-resize';
    // Prevent text selection while dragging
    document.body.style.userSelect = 'none';
  }, []);

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResizing);
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;

    const newWidth = e.clientX;
    const minWidth = 100;
    const maxWidth = window.innerWidth - 100;

    if (newWidth > minWidth && newWidth < maxWidth) {
      setLeftWidth(newWidth);
    }
  }, []);

  // Text area line number logic

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Sync the scroll of the line numbers gutter with the textarea
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Calculate total lines for the gutter
  const lineCount = outputText.split('\n').length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1).join('\n');

  // Cleanup listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', stopResizing);
    };
  }, [handleMouseMove, stopResizing]);

  return (
    <div className="app-wrapper">
      <div className="container">
        {/* LEFT PANEL */}
        <div className="panel left-panel" style={{ width: `${leftWidth}px`, flex: 'none' }}>
          <div className="header">
            <button onClick={handleOpenFolder}>📂 Open Folder</button>
            <span className="folder-name">{rootNode ? rootNode.name : 'No folder'}</span>
          </div>

          <div className="tree-content">
            {rootNode && (
              <FileTreeItem
                node={rootNode}
                selectedPaths={selectedPaths}
                toggleSelection={toggleSelection}
              />
            )}
          </div>

          {rootNode && (
            <div className="footer">
              <button className="primary-btn" onClick={generateOutput} disabled={loading}>
                {loading ? 'Processing...' : 'Generate Text'}
              </button>
            </div>
          )}
        </div>

        {/* DRAG HANDLE */}
        <div className="resizer" onMouseDown={startResizing} />

        {/* RIGHT PANEL */}
        <div className="panel right-panel">
          <div className="header">
            <h3>LLM Context Output</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              {outputText && (
                <>
                  <button onClick={copyMinified}>Copy Minified</button>
                  <button onClick={copyToClipboard} className="primary-btn">
                    Copy Full Text
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="editor-container">
            <div className="line-numbers" ref={lineNumbersRef}>
              <pre>{lineNumbers}</pre>
            </div>
            <textarea
              ref={textareaRef}
              onScroll={handleScroll}
              readOnly
              value={outputText}
              spellCheck="false"
            />
          </div>

          {/* NEW STATUS BAR */}
          <div className="status-bar">
            <div className="status-item">
              Lines: <strong>{lineCount}</strong>
            </div>
            <div className="status-item">
              Est. Tokens: <strong>{totalTokens.toLocaleString()}</strong>
            </div>
            {outputText && (
              <div className="status-item savings">
                Minified: <strong>{minifiedTokens.toLocaleString()}</strong>
                <span className="savings-badge">
                  -{Math.round((savings / totalTokens) * 100)}% tokens
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
