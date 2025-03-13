
import React from 'react';
import { CodeHighlighter } from '../CodeHighlighter';

interface ImplementationCodeProps {
  code: string;
}

export const ImplementationCode: React.FC<ImplementationCodeProps> = ({ code }) => {
  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-semibold mb-4">Implementation</h3>
      <CodeHighlighter 
        code={code.split('\n')} 
      />
    </div>
  );
};
