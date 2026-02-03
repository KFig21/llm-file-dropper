import { useRef } from 'react';
import './styles.scss';

interface Props {
  text: string;
  lineCount: number;
}

export const Editor = ({ text, lineCount }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1).join('\n');

  return (
    <div className="editor-container">
      <div className="line-numbers" ref={lineNumbersRef}>
        <pre>{lineNumbers}</pre>
      </div>
      <textarea
        ref={textareaRef}
        onScroll={handleScroll}
        readOnly
        value={text}
        spellCheck="false"
      />
    </div>
  );
};
