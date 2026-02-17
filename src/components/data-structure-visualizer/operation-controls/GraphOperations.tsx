import React from 'react';
import { Network, Shuffle } from 'lucide-react';
import { OperationButton } from './OperationButton';

interface GraphOperationsProps {
  handleOperation: (operation: string) => void;
}

export const GraphOperations: React.FC<GraphOperationsProps> = ({ handleOperation }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-center">
        <OperationButton
          operation="generate"
          handleOperation={handleOperation}
          icon={<Shuffle className="h-4 w-4" />}
          label="Generate Graph"
        />
        <OperationButton
          operation="bfs"
          handleOperation={handleOperation}
          icon={<Network className="h-4 w-4" />}
          label="BFS Traversal"
        />
        <OperationButton
          operation="dfs"
          handleOperation={handleOperation}
          icon={<Network className="h-4 w-4" />}
          label="DFS Traversal"
        />
      </div>
    </div>
  );
};
