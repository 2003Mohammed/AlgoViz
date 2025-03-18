
import React from 'react';
import { PlusCircle, MinusCircle, Search } from 'lucide-react';
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
        icon={<PlusCircle className="h-4 w-4" />}
        label="Set"
      />
      <OperationButton 
        operation="delete"
        handleOperation={handleOperation}
        icon={<MinusCircle className="h-4 w-4" />}
        label="Delete"
      />
      <OperationButton 
        operation="get"
        handleOperation={handleOperation}
        icon={<Search className="h-4 w-4" />}
        label="Get"
      />
    </div>
  );
};
