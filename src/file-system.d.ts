// src/file-system.d.ts
export {};

declare global {
  interface Window {
    showDirectoryPicker(): Promise<FileSystemDirectoryHandle>;
  }

  interface FileSystemHandle {
    kind: 'file' | 'directory';
    name: string;
  }

  interface FileSystemFileHandle extends FileSystemHandle {
    kind: 'file';
    getFile(): Promise<File>;
  }

  interface FileSystemDirectoryHandle extends FileSystemHandle {
    kind: 'directory';
    values(): AsyncIterableIterator<FileSystemHandle>;
  }
}
