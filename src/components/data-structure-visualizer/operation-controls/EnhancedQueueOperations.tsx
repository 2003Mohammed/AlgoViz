
import React from 'react';
import { ArrowRight, ArrowLeft, RotateCw, Star } from 'lucide-react';
import { OperationButton } from './OperationButton';

interface EnhancedQueueOperationsProps {
  handleOperation: (operation: string) => void;
}

export const EnhancedQueueOperations: React.FC<EnhancedQueueOperationsProps> = ({ handleOperation }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {/* Basic Operations */}
        <OperationButton 
          operation="enqueue"
          handleOperation={handleOperation}
          icon={<ArrowRight className="h-4 w-4" />}
          label="Enqueue"
        />
        <OperationButton 
          operation="dequeue"
          handleOperation={handleOperation}
          icon={<ArrowLeft className="h-4 w-4" />}
          label="Dequeue"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {/* Advanced Operations */}
        <OperationButton 
          operation="circular"
          handleOperation={handleOperation}
          icon={<RotateCw className="h-4 w-4" />}
          label="Circular Queue"
        />
        <OperationButton 
          operation="priority"
          handleOperation={handleOperation}
          icon={<Star className="h-4 w-4" />}
          label="Priority Queue"
        />
      </div>
    </div>
  );
};
