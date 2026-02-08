import { useEffect, useState } from 'react';
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
    refresh,
    toggleSelection,
    toggleExpand,
    toggleExpandAll,
    generateOutput,
  } = useFileSystem();

  const { width: leftWidth, startResizing } = useResizable(350);

  // 1) AUTO-GENERATE EFFECT
  useEffect(() => {
    const updateText = async () => {
      const text = await generateOutput();
      setOutputText(text);
    };

    // Debounce to avoid flashing if user clicks 10 checkboxes quickly
    const timeoutId = setTimeout(updateText, 150);
    return () => clearTimeout(timeoutId);
  }, [selectedPaths, generateOutput]);

  return (
    <div className="app-wrapper">
      <div className="container">
        <LeftPanel
          leftWidth={leftWidth}
          handleOpenFolder={handleOpenFolder}
          refresh={refresh}
          node={rootNode}
          selectedPaths={selectedPaths}
          expandedPaths={expandedPaths}
          fileStats={fileStats}
          toggleSelection={toggleSelection}
          toggleExpand={toggleExpand}
          toggleExpandAll={toggleExpandAll}
          loading={loading}
        />
        <div className="resizer" onMouseDown={startResizing} />
        <RightPanel outputText={outputText} rootNode={rootNode} />
      </div>
    </div>
  );
}
