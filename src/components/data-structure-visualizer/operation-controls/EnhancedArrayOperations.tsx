
import React from 'react';
import { PlusCircle, MinusCircle, Search, ArrowLeftRight, RotateCcw, 
         Scissors, Filter, MapPin, GitCompare } from 'lucide-react';
import { OperationButton } from './OperationButton';

interface EnhancedArrayOperationsProps {
  handleOperation: (operation: string) => void;
}

export const EnhancedArrayOperations: React.FC<EnhancedArrayOperationsProps> = ({ handleOperation }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {/* Basic Operations */}
        <OperationButton 
          operation="add"
          handleOperation={handleOperation}
          icon={<PlusCircle className="h-4 w-4" />}
          label="Add"
        />
        <OperationButton 
          operation="remove"
          handleOperation={handleOperation}
          icon={<MinusCircle className="h-4 w-4" />}
          label="Remove"
        />
        <OperationButton 
          operation="search"
          handleOperation={handleOperation}
          icon={<Search className="h-4 w-4" />}
          label="Search"
        />
        <OperationButton 
          operation="compare"
          handleOperation={handleOperation}
          icon={<GitCompare className="h-4 w-4" />}
          label="Compare"
        />
        
        {/* Transformation Operations */}
        <OperationButton 
          operation="reverse"
          handleOperation={handleOperation}
          icon={<ArrowLeftRight className="h-4 w-4" />}
          label="Reverse"
        />
        <OperationButton 
          operation="rotate-left"
          handleOperation={handleOperation}
          icon={<RotateCcw className="h-4 w-4" />}
          label="Rotate Left"
        />
        <OperationButton 
          operation="slice"
          handleOperation={handleOperation}
          icon={<Scissors className="h-4 w-4" />}
          label="Slice"
        />
        <OperationButton 
          operation="filter"
          handleOperation={handleOperation}
          icon={<Filter className="h-4 w-4" />}
          label="Filter"
        />
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center">
        <OperationButton 
          operation="map"
          handleOperation={handleOperation}
          icon={<MapPin className="h-4 w-4" />}
          label="Map (x2)"
        />
      </div>
    </div>
  );
};
