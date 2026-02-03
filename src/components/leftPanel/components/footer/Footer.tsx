import './styles.scss';

interface Props {
  loading: boolean;
  generateOutput: () => void;
  selectedPaths: Set<string>;
}

export const Footer = ({ loading, generateOutput, selectedPaths }: Props) => {
  return (
    <div className="footer">
      <button
        className={`generate-button ${selectedPaths.size > 0 ? 'active' : 'inactive'}`}
        onClick={generateOutput}
        disabled={loading}
      >
        {loading ? 'Processing...' : selectedPaths.size > 0 ? 'Generate Text' : 'Select files'}
      </button>
    </div>
  );
};
