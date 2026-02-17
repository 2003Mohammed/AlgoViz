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
        <OperationButton operation="toggle-directed" handleOperation={handleOperation} icon={<Network className="h-4 w-4" />} label="Toggle Directed" />
        <OperationButton operation="toggle-weighted" handleOperation={handleOperation} icon={<Network className="h-4 w-4" />} label="Toggle Weighted" />
        <OperationButton operation="add-node" handleOperation={handleOperation} icon={<Network className="h-4 w-4" />} label="Add Node" />
        <OperationButton operation="remove-node" handleOperation={handleOperation} icon={<Network className="h-4 w-4" />} label="Remove Node" />
        <OperationButton operation="add-edge" handleOperation={handleOperation} icon={<Network className="h-4 w-4" />} label="Add Edge" />
        <OperationButton operation="remove-edge" handleOperation={handleOperation} icon={<Network className="h-4 w-4" />} label="Remove Edge" />
      </div>
    </div>
  );
};
