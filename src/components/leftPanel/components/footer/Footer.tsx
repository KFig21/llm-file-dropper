import './styles.scss';

interface Props {
  loading: boolean;
  generateOutput: () => void;
}

export const Footer = ({ loading, generateOutput }: Props) => {
  return (
    <div className="footer">
      <button className="generate-button" onClick={generateOutput} disabled={loading}>
        {loading ? 'Processing...' : 'Generate Text'}
      </button>
    </div>
  );
};
