import type { FileNode } from '../../../../types';
import { getFileIcon } from '../../../../types';
import './styles.scss';

interface Props {
  node: FileNode;
  selectedPaths: Set<string>;
  expandedPaths: Set<string>;
  toggleSelection: (path: string, isDir: boolean, node: FileNode) => void;
  toggleExpand: (path: string) => void;
}

export const FileTreeItem = ({
  node,
  selectedPaths,
  expandedPaths,
  toggleSelection,
  toggleExpand,
}: Props) => {
  const isSelected = selectedPaths.has(node.path);
  const isExpanded = expandedPaths.has(node.path); // <--- Check state
  const fileInfo = node.kind === 'file' ? getFileIcon(node.name) : null;

  return (
    <div className="file-tree-wrapper">
      <div className="tree-row">
        {/* Chevron for Directories */}
        <div
          className="chevron-wrapper"
          onClick={() => node.kind === 'directory' && toggleExpand(node.path)}
        >
          {node.kind === 'directory' && (
            <span className={`chevron ${isExpanded ? 'expanded' : ''}`}>▸</span>
          )}
        </div>

        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleSelection(node.path, node.kind === 'directory', node)}
        />

        {/* Click folder name/icon to toggle expand as well */}
        <div
          className="node-label"
          onClick={() => node.kind === 'directory' && toggleExpand(node.path)}
        >
          {node.kind === 'directory' ? (
            <span className="folder-icon">{isExpanded ? '📂' : '📁'}</span>
          ) : (
            <span className="file-badge" style={{ backgroundColor: fileInfo?.color }}>
              {fileInfo?.label}
            </span>
          )}
          <span className={`node-name ${isSelected ? 'selected' : ''}`}>{node.name}</span>
        </div>
      </div>

      {/* Conditionally Render Children */}
      {node.kind === 'directory' && isExpanded && node.children && (
        <div className="tree-children">
          {node.children.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              selectedPaths={selectedPaths}
              expandedPaths={expandedPaths}
              toggleSelection={toggleSelection}
              toggleExpand={toggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};
