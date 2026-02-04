import { useState } from 'react';
import { RightPanel } from './components/rightPanel/RightPanel';
import { LeftPanel } from './components/leftPanel/LeftPanel';
import { useFileSystem } from './hooks/useFileSystem';
import { useResizable } from './hooks/useResizable';
import './index.scss';

export default function App() {
  const [outputText, setOutputText] = useState('');

  const {
    rootNode,
    selectedPaths,
    expandedPaths,
    loading,
    fileStats,
    handleOpenFolder,
    toggleSelection,
    toggleExpand,
    toggleExpandAll,
    generateOutput,
  } = useFileSystem();

  const { width: leftWidth, startResizing } = useResizable(350);

  const handleGenerate = async () => {
    const text = await generateOutput();
    if (text) setOutputText(text);
  };

  return (
    <div className="app-wrapper">
      <div className="container">
        <LeftPanel
          leftWidth={leftWidth}
          handleOpenFolder={handleOpenFolder}
          node={rootNode}
          selectedPaths={selectedPaths}
          expandedPaths={expandedPaths}
          fileStats={fileStats}
          toggleSelection={toggleSelection}
          toggleExpand={toggleExpand}
          toggleExpandAll={toggleExpandAll}
          generateOutput={handleGenerate}
          loading={loading}
        />
        <div className="resizer" onMouseDown={startResizing} />
        <RightPanel outputText={outputText} rootNode={rootNode} />
      </div>
    </div>
  );
}
