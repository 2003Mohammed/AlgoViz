
import React from 'react';
import { TreeNode } from '../../../types/visualizer';

interface TreeVisualizationProps {
  treeData: TreeNode | null;
}

export const TreeVisualization: React.FC<TreeVisualizationProps> = ({ treeData }) => {
  return (
    <div className="h-96 bg-muted rounded-lg p-4 flex items-center justify-center">
      {treeData ? (
        <div>Tree visualization coming soon</div>
      ) : (
        <div className="text-muted-foreground">Tree data not available</div>
      )}
    </div>
  );
};
