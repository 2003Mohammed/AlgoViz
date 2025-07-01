
import React from 'react';
import { Plus, Minus, Search } from 'lucide-react';
import { OperationButton } from './OperationButton';

interface ArrayOperationsProps {
  handleOperation: (operation: string) => void;
}

export const ArrayOperations: React.FC<ArrayOperationsProps> = ({ handleOperation }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <OperationButton 
        operation="add"
        handleOperation={handleOperation}
        icon={<Plus className="h-4 w-4" />}
        label="Add"
      />
      <OperationButton 
        operation="remove"
        handleOperation={handleOperation}
        icon={<Minus className="h-4 w-4" />}
        label="Remove"
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
