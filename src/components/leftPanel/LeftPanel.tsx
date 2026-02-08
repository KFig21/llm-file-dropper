import type { FileNode } from '../../types';
import { FileTreeItem } from './components/fileTreeItem/FileTreeItem';
import { Header } from './components/header/Header';
import { Signature } from './components/signature/Signature';
import './styles.scss';

interface Props {
  leftWidth: number;
  handleOpenFolder: () => void;
  refresh: () => void;
  node: FileNode | null;
  selectedPaths: Set<string>;
  expandedPaths: Set<string>;
  fileStats: Record<string, number>;
  toggleSelection: (path: string, isDir: boolean, node: FileNode) => void;
  toggleExpand: (path: string) => void;
  toggleExpandAll: (expand: boolean) => void;
  loading: boolean;
}

export const LeftPanel = ({
  leftWidth,
  handleOpenFolder,
  refresh,
  node,
  selectedPaths,
  expandedPaths,
  fileStats = {},
  toggleSelection,
  toggleExpand,
  toggleExpandAll,
  loading,
}: Props) => {
  return (
    <div className="left-panel" style={{ width: `${leftWidth}px` }}>
      <Header
        handleOpenFolder={handleOpenFolder}
        node={node}
        toggleExpandAll={toggleExpandAll}
        refresh={refresh}
        loading={loading}
      />
      <div className="tree-content">
        {/* File Tree */}
        {node && (
          <FileTreeItem
            node={node}
            selectedPaths={selectedPaths}
            expandedPaths={expandedPaths}
            fileStats={fileStats}
            toggleSelection={toggleSelection}
            toggleExpand={toggleExpand}
          />
        )}
      </div>
      <Signature />
    </div>
  );
};
