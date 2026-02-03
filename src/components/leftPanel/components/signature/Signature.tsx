import './styles.scss';
import GitHubIcon from '@mui/icons-material/GitHub';

export const Signature = () => {
  return (
    <div className="signature-container">
      <div className="signature-wrapper">
        {/* make this a link to my github */}
        <a
          className="github-link"
          href="https://github.com/KFig21"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon fontSize="small" />
          <span className="signature">Made by KFig21</span>
        </a>
      </div>
    </div>
  );
};
