export type FileNode = {
  name: string;
  kind: 'file' | 'directory';
  path: string;
  handle: FileSystemHandle;
  children?: FileNode[];
};

// Just return the metadata here, not the React Component
export const getFileIconData = (fileName: string) => {
  const lower = fileName.toLowerCase();
  const ext = lower.split('.').pop();

  if (lower === 'vite.config.ts' || lower === 'vite.config.js')
    return { type: 'vite', color: '#646cff' };
  if (lower === 'package.json') return { type: 'json', color: '#cb3837' };

  switch (ext) {
    case 'ts':
      return { type: 'ts', color: '#3178c6' };
    case 'tsx':
      return { type: 'react', color: '#61dafb' };
    case 'js':
    case 'jsx':
      return { type: 'js', color: '#f7df1e' };
    case 'html':
      return { type: 'html', color: '#e34f26' };
    case 'css':
      return { type: 'css', color: '#1572b6' };
    case 'scss':
    case 'sass':
      return { type: 'sass', color: '#c69' };
    case 'md':
      return { type: 'md', color: '#8b949e' };
    case 'json':
      return { type: 'json', color: '#cbcb41' };
    case 'png':
    case 'jpg':
    case 'svg':
      return { type: 'image', color: '#a074c4' };
    default:
      return { type: 'default', color: '#8b949e' };
  }
};
