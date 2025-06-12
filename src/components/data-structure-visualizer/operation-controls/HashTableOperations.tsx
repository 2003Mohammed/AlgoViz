
import React from 'react';
import { Hash, Eye, Trash2 } from 'lucide-react';
import { OperationButton } from './OperationButton';

interface HashTableOperationsProps {
  handleOperation: (operation: string) => void;
}

export const HashTableOperations: React.FC<HashTableOperationsProps> = ({ handleOperation }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <OperationButton 
        operation="set"
        handleOperation={handleOperation}
        icon={<Hash className="h-4 w-4" />}
        label="Set"
      />
      <OperationButton 
        operation="get"
        handleOperation={handleOperation}
        icon={<Eye className="h-4 w-4" />}
        label="Get"
      />
      <OperationButton 
        operation="delete"
        handleOperation={handleOperation}
        icon={<Trash2 className="h-4 w-4" />}
        label="Delete"
      />
    </div>
  );
};
