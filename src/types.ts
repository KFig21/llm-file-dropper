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
      return { icon: '', color: 'white', backgroundColor: '#3178c6', label: 'TS' }; // Blue
    case 'md': // readme
      return { icon: '', color: 'white', backgroundColor: '#3c88daff', label: 'MD' }; // Light Blue
    case 'js':
    case 'jsx':
      return { icon: '', color: 'black', backgroundColor: '#f7df1e', label: 'JS' }; // Yellow
    case 'html':
      return { icon: '', color: 'white', backgroundColor: '#e34f26', label: 'HTML' }; // Orange
    case 'css':
      return { icon: '', color: 'white', backgroundColor: '#1572b6', label: 'CSS' }; // Blue
    case 'scss':
    case 'sass':
      return { icon: '', color: 'white', backgroundColor: '#c6308fff', label: 'SCSS' }; // Pink
    case 'json':
      return { icon: '', color: 'black', backgroundColor: '#cbcb41', label: 'JSON' }; // Yellowish
    case 'svg':
    case 'png':
    case 'jpg':
      return { icon: '', color: 'white', backgroundColor: '#a074c4', label: 'IMG' };
    default:
      return { icon: '', color: 'white', backgroundColor: '#798087ff', label: 'FILE' };
  }
};
