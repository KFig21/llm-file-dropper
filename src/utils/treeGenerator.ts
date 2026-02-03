import type { FileNode } from '../types';

export const generateAsciiTree = (node: FileNode, prefix = '', isLast = true): string => {
  const marker = isLast ? '└── ' : '├── ';
  // Don't show the root marker for the very first node, just its name
  const currentLine = prefix ? `${prefix}${marker}${node.name}` : node.name;

  let result = currentLine + '\n';

  const childPrefix = prefix + (isLast ? '    ' : '│   ');

  if (node.children) {
    node.children.forEach((child, index) => {
      const isLastChild = index === node.children!.length - 1;
      result += generateAsciiTree(child, childPrefix, isLastChild);
    });
  }

  return result;
};
