
import React from 'react';
import { ArrowDownToLine, ArrowUpFromLine, Eye } from 'lucide-react';
import { OperationButton } from './OperationButton';

interface QueueOperationsProps {
  handleOperation: (operation: string) => void;
}

export const QueueOperations: React.FC<QueueOperationsProps> = ({ handleOperation }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <OperationButton 
        operation="enqueue"
        handleOperation={handleOperation}
        icon={<ArrowDownToLine className="h-4 w-4" />}
        label="Enqueue"
      />
      <OperationButton 
        operation="dequeue"
        handleOperation={handleOperation}
        icon={<ArrowUpFromLine className="h-4 w-4" />}
        label="Dequeue"
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
