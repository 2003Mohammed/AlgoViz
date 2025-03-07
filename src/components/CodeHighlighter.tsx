
import React from 'react';

interface CodeHighlighterProps {
  code: string[];
  activeLineIndex?: number;
}

export const CodeHighlighter: React.FC<CodeHighlighterProps> = ({ 
  code, 
  activeLineIndex = -1 
}) => {
  return (
    <div className="font-mono text-sm bg-black/90 text-white rounded-md overflow-hidden">
      <pre className="p-4 overflow-x-auto">
        <code>
          {code.map((line, index) => (
            <div 
              key={index}
              className={`py-0.5 px-2 -mx-2 rounded ${
                index === activeLineIndex 
                  ? 'bg-primary/20 text-primary-foreground border-l-2 border-primary' 
                  : ''
              }`}
            >
              {line}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
};
