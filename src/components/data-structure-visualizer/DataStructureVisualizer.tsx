
import React, { useState } from 'react';
import { DataStructure } from '../../utils/dataStructureData';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Info, PlusCircle, MinusCircle, RotateCcw } from 'lucide-react';
import { OperationControls } from './OperationControls';
import { OperationLog } from './OperationLog';
import { StructureRenderer } from './StructureRenderer';
import { OperationsInfo } from './OperationsInfo';
import { ImplementationCode } from './ImplementationCode';
import { useDataStructureState } from './useDataStructureState';

interface DataStructureVisualizerProps {
  dataStructure: DataStructure;
}

export const DataStructureVisualizer: React.FC<DataStructureVisualizerProps> = ({ dataStructure }) => {
  const {
    customInput,
    structure,
    operationResult,
    operationLog,
    setCustomInput,
    resetToDefault,
    handleOperation,
    handleInputChange
  } = useDataStructureState(dataStructure);
  
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">{dataStructure.name} Visualization</h3>
          <Button 
            onClick={resetToDefault}
            variant="secondary"
            size="sm"
            className="flex items-center gap-1"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
        
        <div className="relative min-h-64 flex flex-col items-center justify-center gap-6 mb-6">
          <StructureRenderer 
            structure={structure} 
            dataStructureId={dataStructure.id} 
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <div className="w-full sm:w-auto">
            <Input
              placeholder="Enter a value..."
              value={customInput}
              onChange={handleInputChange}
              className="min-w-[200px]"
            />
          </div>
          
          <OperationControls 
            dataStructureId={dataStructure.id} 
            handleOperation={handleOperation} 
          />
        </div>
        
        {operationLog.length > 0 && (
          <OperationLog logs={operationLog} />
        )}
      </div>
      
      <OperationsInfo operations={dataStructure.operations} />
      
      {dataStructure.implementation && (
        <ImplementationCode code={dataStructure.implementation} />
      )}
    </div>
  );
};
