
import React from 'react';
import { Plus, Search } from 'lucide-react';
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
        icon={<Plus className="h-4 w-4" />}
        label="Set Key"
      />
      <OperationButton 
        operation="get"
        handleOperation={handleOperation}
        icon={<Search className="h-4 w-4" />}
        label="Get Key"
      />
    </div>
  );
};
