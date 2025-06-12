
import React from 'react';
import { Plus, Minus, Eye, ArrowUpDown, CheckCircle } from 'lucide-react';
import { OperationButton } from './OperationButton';

interface EnhancedStackOperationsProps {
  handleOperation: (operation: string) => void;
}

export const EnhancedStackOperations: React.FC<EnhancedStackOperationsProps> = ({ handleOperation }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {/* Basic Operations */}
        <OperationButton 
          operation="push"
          handleOperation={handleOperation}
          icon={<Plus className="h-4 w-4" />}
          label="Push"
        />
        <OperationButton 
          operation="pop"
          handleOperation={handleOperation}
          icon={<Minus className="h-4 w-4" />}
          label="Pop"
        />
        <OperationButton 
          operation="peek"
          handleOperation={handleOperation}
          icon={<Eye className="h-4 w-4" />}
          label="Peek"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {/* Advanced Operations */}
        <OperationButton 
          operation="reverse"
          handleOperation={handleOperation}
          icon={<ArrowUpDown className="h-4 w-4" />}
          label="Reverse"
        />
        <OperationButton 
          operation="check-balanced"
          handleOperation={handleOperation}
          icon={<CheckCircle className="h-4 w-4" />}
          label="Check Balanced"
        />
      </div>
    </div>
  );
};
