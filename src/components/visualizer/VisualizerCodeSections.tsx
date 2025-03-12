
import React from 'react';
import { CodeHighlighter } from '../CodeHighlighter';
import { Algorithm } from '../../utils/algorithms';

interface VisualizerCodeSectionsProps {
  algorithm: Algorithm;
  activeLineIndex: number;
}

export const VisualizerCodeSections: React.FC<VisualizerCodeSectionsProps> = ({
  algorithm,
  activeLineIndex
}) => {
  return (
    <>
      {algorithm.pseudocode && (
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-4">Pseudocode</h3>
          <CodeHighlighter 
            code={algorithm.pseudocode} 
            activeLineIndex={activeLineIndex}
          />
        </div>
      )}
      
      {algorithm.implementation && (
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-4">Implementation</h3>
          <CodeHighlighter 
            code={algorithm.implementation.split('\n')} 
          />
        </div>
      )}
    </>
  );
};
