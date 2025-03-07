
import React from 'react';
import { Algorithm } from '../../utils/algorithmData';

interface AlgorithmAnalysisProps {
  algorithm: Algorithm;
}

export const AlgorithmAnalysis: React.FC<AlgorithmAnalysisProps> = ({ algorithm }) => {
  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-semibold mb-4">Algorithm Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-medium mb-2">Time Complexity</h4>
          <ul className="space-y-2">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Best:</span>
              <span className="font-mono">{algorithm.timeComplexity.best}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Average:</span>
              <span className="font-mono">{algorithm.timeComplexity.average}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Worst:</span>
              <span className="font-mono">{algorithm.timeComplexity.worst}</span>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-medium mb-2">Space Complexity</h4>
          <div className="font-mono">{algorithm.spaceComplexity}</div>
        </div>
      </div>
    </div>
  );
};
