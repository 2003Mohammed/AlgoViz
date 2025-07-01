
import React from 'react';
import { Plus, Search } from 'lucide-react';
import { OperationButton } from './OperationButton';

interface BinaryTreeOperationsProps {
  handleOperation: (operation: string) => void;
}

export const BinaryTreeOperations: React.FC<BinaryTreeOperationsProps> = ({ handleOperation }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <OperationButton 
        operation="insert"
        handleOperation={handleOperation}
        icon={<Plus className="h-4 w-4" />}
        label="Insert"
      />
      <OperationButton 
        operation="search"
        handleOperation={handleOperation}
        icon={<Search className="h-4 w-4" />}
        label="Search"
      />
    </div>
  );
};
