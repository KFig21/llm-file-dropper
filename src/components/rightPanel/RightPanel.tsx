import { useState, useMemo } from 'react';
import { Editor } from './components/editor/Editor';
import { StatusBar } from './components/statusBar/StatusBar';
import type { FileNode } from '../../types';
import { generateAsciiTree } from '../../utils/treeGenerator';
import { Toast } from './components/toast/Toast';
import './styles.scss';

interface Props {
  outputText: string;
  rootNode: FileNode | null;
}

export const RightPanel = ({ outputText, rootNode }: Props) => {
  const [activeTab, setActiveTab] = useState<'code' | 'structure'>('code');
  const [toast, setToast] = useState<{ message: string; id: number } | null>(null);

  // 1. Generate the Tree String (Memoized for performance)
  const structureText = useMemo(() => {
    return rootNode ? generateAsciiTree(rootNode) : '';
  }, [rootNode]);

  // 2. Decide what to show
  const content = activeTab === 'code' ? outputText : structureText;
  const lineCount = content ? content.split('\n').length : 0;

  // 3. Floating Action Handlers
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setToast({ message: 'Copied to clipboard', id: Date.now() });
  };

  const copyMinified = () => {
    const minified = content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join(' ');
    navigator.clipboard.writeText(minified);
    setToast({ message: 'Copied minified to clipboard', id: Date.now() });
  };

  return (
    <div className="right-panel">
      {/* FLOATING ACTION BUTTONS */}
      <div className="floating-actions">
        {content && (
          <div className="copy-buttons">
            <button onClick={copyToClipboard} className="copy-button">
              Copy Full
            </button>
            <button onClick={copyMinified} className="copy-mini-button">
              Copy Minified
            </button>
          </div>
        )}
        {/* Using .id as key forces a remount on every click */}
        {toast && <Toast key={toast.id} message={toast.message} onClose={() => setToast(null)} />}
      </div>

      {/* EDITOR (Reused for both Code and Structure views!) */}
      <Editor text={content} lineCount={lineCount} />

      {/* STATUS BAR with Toggle */}
      <StatusBar
        outputText={outputText}
        lineCount={lineCount}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};
