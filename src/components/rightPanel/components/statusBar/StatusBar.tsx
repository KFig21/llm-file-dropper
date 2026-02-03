import './styles.scss';

interface Props {
  outputText: string;
  lineCount: number;
  activeTab: 'code' | 'structure';
  setActiveTab: (tab: 'code' | 'structure') => void;
}

export const StatusBar = ({ outputText, lineCount, activeTab, setActiveTab }: Props) => {
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
  const savingsPercent = Math.round((savings / totalTokens) * 100);

  return (
    <div className="status-bar">
      {/* LEFT: View Toggles */}
      <div className="status-toggles">
        <button
          className={`status-tab ${activeTab === 'code' ? 'active' : ''}`}
          onClick={() => setActiveTab('code')}
        >
          Code Context
        </button>
        <button
          className={`status-tab ${activeTab === 'structure' ? 'active' : ''}`}
          onClick={() => setActiveTab('structure')}
        >
          File Structure
        </button>
      </div>

      {/* RIGHT: Stats */}
      <div className="status-info">
        <div className="status-item">
          Lines: <strong>{lineCount}</strong>
        </div>
        {activeTab === 'code' && (
          <>
            <div className="status-item">
              Est. Tokens: <strong>{totalTokens.toLocaleString()}</strong>
            </div>
            <div className="status-item savings">
              Minified: <strong>{minifiedTokens.toLocaleString()}</strong>
              {savings > 0 && <span className="savings-badge">-{savingsPercent}% tokens</span>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
