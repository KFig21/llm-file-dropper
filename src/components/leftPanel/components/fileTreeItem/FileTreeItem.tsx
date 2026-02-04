import type { FileNode } from '../../../../types';
import { FileIcon } from './FileIcon'; // New Import
import './styles.scss';

interface Props {
  node: FileNode;
  selectedPaths: Set<string>;
  expandedPaths: Set<string>;
  fileStats: Record<string, number>;
  toggleSelection: (path: string, isDir: boolean, node: FileNode) => void;
  toggleExpand: (path: string) => void;
}

export const FileTreeItem = ({
  node,
  selectedPaths,
  expandedPaths,
  fileStats,
  toggleSelection,
  toggleExpand,
}: Props) => {
  const isSelected = selectedPaths.has(node.path);
  const isExpanded = expandedPaths.has(node.path);

  const getStats = (n: FileNode): { rawLines: number; fileCount: number } => {
    if (n.kind === 'file') {
      if (selectedPaths.has(n.path) && fileStats[n.path] !== undefined) {
        return { rawLines: fileStats[n.path], fileCount: 1 };
      }
      return { rawLines: 0, fileCount: 0 };
    }

    return (n.children || []).reduce(
      (acc, child) => {
        const childStats = getStats(child);
        return {
          rawLines: acc.rawLines + childStats.rawLines,
          fileCount: acc.fileCount + childStats.fileCount,
        };
      },
      { rawLines: 0, fileCount: 0 },
    );
  };

  const stats = getStats(node);

  // Apply the formula: Raw Lines + (Files * 4) - 2
  // (We only subtract 2 if there's at least one file selected)
  const totalLines = stats.fileCount > 0 ? stats.rawLines + stats.fileCount * 3 - 2 : 0;

  return (
    <div className="file-tree-wrapper">
      <div className="tree-row">
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

        <div
          className="node-label"
          onClick={() => node.kind === 'directory' && toggleExpand(node.path)}
        >
          {node.kind === 'directory' ? (
            <span className="folder-icon">{isExpanded ? '📂' : '📁'}</span>
          ) : (
            <FileIcon fileName={node.name} />
          )}

          <span className={`node-name ${isSelected ? 'selected' : ''}`}>{node.name}</span>

          {isSelected && totalLines > 0 && (
            <span className="line-count">{totalLines.toLocaleString()} lines</span>
          )}
        </div>
      </div>

      {node.kind === 'directory' && isExpanded && node.children && (
        <div className="tree-children">
          {node.children.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              selectedPaths={selectedPaths}
              expandedPaths={expandedPaths}
              fileStats={fileStats}
              toggleSelection={toggleSelection}
              toggleExpand={toggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};
