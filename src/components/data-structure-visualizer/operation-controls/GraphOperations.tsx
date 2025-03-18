
import React from 'react';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { OperationButton } from './OperationButton';

interface GraphOperationsProps {
  handleOperation: (operation: string) => void;
}

export const GraphOperations: React.FC<GraphOperationsProps> = ({ handleOperation }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <OperationButton 
        operation="addVertex"
        handleOperation={handleOperation}
        icon={<PlusCircle className="h-4 w-4" />}
        label="Add Vertex"
      />
      <OperationButton 
        operation="addEdge"
        handleOperation={handleOperation}
        icon={<PlusCircle className="h-4 w-4" />}
        label="Add Edge"
      />
      <OperationButton 
        operation="removeVertex"
        handleOperation={handleOperation}
        icon={<MinusCircle className="h-4 w-4" />}
        label="Remove Vertex"
      />
    </div>
  );
};
