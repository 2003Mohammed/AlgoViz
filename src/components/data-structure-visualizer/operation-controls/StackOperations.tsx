
import React from 'react';
import { ArrowDownToLine, ArrowUpFromLine, Eye } from 'lucide-react';
import { OperationButton } from './OperationButton';

interface StackOperationsProps {
  handleOperation: (operation: string) => void;
}

export const StackOperations: React.FC<StackOperationsProps> = ({ handleOperation }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <OperationButton 
        operation="push"
        handleOperation={handleOperation}
        icon={<ArrowDownToLine className="h-4 w-4" />}
        label="Push"
      />
      <OperationButton 
        operation="pop"
        handleOperation={handleOperation}
        icon={<ArrowUpFromLine className="h-4 w-4" />}
        label="Pop"
      />
      <OperationButton 
        operation="peek"
        handleOperation={handleOperation}
        icon={<Eye className="h-4 w-4" />}
        label="Peek"
      />
    </div>
  );
};
