// src/types.ts
export type FileNode = {
  name: string;
  kind: 'file' | 'directory';
  path: string;
  handle: FileSystemHandle;
  children?: FileNode[];
};

// file type icons
export const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();

  switch (ext) {
    case 'ts':
    case 'tsx':
      return { icon: '', color: '#3178c6', label: 'TS' }; // Blue
    case 'md': // readme
      return { icon: '', color: '#3c88daff', label: 'MD' }; // Light Blue
    case 'js':
    case 'jsx':
      return { icon: '', color: '#f7df1e', label: 'JS' }; // Yellow
    case 'html':
      return { icon: '', color: '#e34f26', label: 'HTML' }; // Orange
    case 'css':
      return { icon: '', color: '#1572b6', label: 'CSS' }; // Blue
    case 'scss':
    case 'sass':
      return { icon: '', color: '#c6308fff', label: 'SCSS' }; // Pink
    case 'json':
      return { icon: '', color: '#cbcb41', label: 'JSON' }; // Yellowish
    case 'svg':
    case 'png':
    case 'jpg':
      return { icon: '', color: '#a074c4', label: 'IMG' };
    default:
      return { icon: '', color: '#8b949e', label: 'FILE' };
  }
};
