import type { FileNode } from '../../../../types';
import { useTheme } from '../../../../context/ThemeContext';
import Brightness5Icon from '@mui/icons-material/Brightness5';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import './styles.scss';

interface Props {
  handleOpenFolder: () => void;
  node: FileNode | null;
  toggleExpandAll: (expand: boolean) => void;
}

export const Header = ({ handleOpenFolder, node, toggleExpandAll }: Props) => {
  // Consume Theme Context
  const { theme, setTheme, themes } = useTheme();

  const handleThemeToggle = () => {
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  return (
    <div className="header">
      <div className="header-upper">
        <button className="folder-button" onClick={handleOpenFolder} title="Open Folder">
          <span>📂</span>
          <span className="folder-name">{node ? node.name : 'Choose a folder'}</span>
        </button>
        {/* Theme switcher */}
        <div className="theme-switcher">
          <button onClick={handleThemeToggle} className="theme-toggle" title="Switch Theme">
            {theme === 'dark' ? (
              <Brightness5Icon fontSize="small" />
            ) : (
              <DarkModeIcon fontSize="small" />
            )}
          </button>
        </div>
      </div>

      {node && (
        <div className="header-actions">
          <button
            className="expand-collapse-button"
            onClick={() => toggleExpandAll(true)}
            title="Expand All"
          >
            expand all
          </button>
          <button
            className="expand-collapse-button"
            onClick={() => toggleExpandAll(false)}
            title="Collapse All"
          >
            collapse all
          </button>
        </div>
      )}
    </div>
  );
};
