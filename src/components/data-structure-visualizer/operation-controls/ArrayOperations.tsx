
import React from 'react';
import { Plus, Minus, Search, ArrowUpDown, Edit, Shuffle } from 'lucide-react';
import { OperationButton } from './OperationButton';

interface ArrayOperationsProps {
  handleOperation: (operation: string) => void;
}

export const ArrayOperations: React.FC<ArrayOperationsProps> = ({ handleOperation }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-center">
        <OperationButton 
          operation="add"
          handleOperation={handleOperation}
          icon={<Plus className="h-4 w-4" />}
          label="Add Element"
        />
        <OperationButton 
          operation="remove"
          handleOperation={handleOperation}
          icon={<Minus className="h-4 w-4" />}
          label="Remove Last"
        />
        <OperationButton 
          operation="search"
          handleOperation={handleOperation}
          icon={<Search className="h-4 w-4" />}
          label="Search"
        />
        <OperationButton 
          operation="update"
          handleOperation={handleOperation}
          icon={<Edit className="h-4 w-4" />}
          label="Update Index"
        />
      </div>
      
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium mb-2 text-center">Sorting Algorithms</h4>
        <div className="flex flex-wrap gap-2 justify-center">
          <OperationButton 
            operation="bubble-sort"
            handleOperation={handleOperation}
            icon={<ArrowUpDown className="h-4 w-4" />}
            label="Bubble Sort"
          />
          <OperationButton 
            operation="selection-sort"
            handleOperation={handleOperation}
            icon={<ArrowUpDown className="h-4 w-4" />}
            label="Selection Sort"
          />
          <OperationButton 
            operation="shuffle"
            handleOperation={handleOperation}
            icon={<Shuffle className="h-4 w-4" />}
            label="Shuffle"
          />
        </div>
      </div>
    </div>
  );
};
