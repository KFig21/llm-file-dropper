import type { FileNode } from '../../types';
import { FileTreeItem } from './components/fileTreeItem/FileTreeItem';
import { Footer } from './components/footer/Footer';
import { Header } from './components/header/Header';
import { Signature } from './components/signature/Signature';
import './styles.scss';

interface Props {
  leftWidth: number;
  handleOpenFolder: () => void;
  node: FileNode | null;
  selectedPaths: Set<string>;
  expandedPaths: Set<string>;
  toggleSelection: (path: string, isDir: boolean, node: FileNode) => void;
  toggleExpand: (path: string) => void;
  toggleExpandAll: (expand: boolean) => void;
  generateOutput: () => void;
  loading: boolean;
}

export const LeftPanel = ({
  leftWidth,
  handleOpenFolder,
  node,
  selectedPaths,
  expandedPaths,
  toggleSelection,
  toggleExpand,
  toggleExpandAll,
  generateOutput,
  loading,
}: Props) => {
  return (
    <div className="left-panel" style={{ width: `${leftWidth}px` }}>
      <Header handleOpenFolder={handleOpenFolder} node={node} toggleExpandAll={toggleExpandAll} />
      {node && (
        <Footer loading={loading} generateOutput={generateOutput} selectedPaths={selectedPaths} />
      )}
      <div className="tree-content">
        {/* File Tree */}
        {node && (
          <FileTreeItem
            node={node}
            selectedPaths={selectedPaths}
            expandedPaths={expandedPaths}
            toggleSelection={toggleSelection}
            toggleExpand={toggleExpand}
          />
        )}
      </div>
      <Signature />
    </div>
  );
};
