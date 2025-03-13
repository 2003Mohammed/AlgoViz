
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
import { motion } from 'framer-motion';

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
      <motion.div 
        className="glass-card p-6 overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <motion.h3 
            className="text-xl font-semibold relative"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="relative z-10">{dataStructure.name} Visualization</span>
            <motion.div 
              className="absolute -bottom-2 left-0 h-2 bg-primary/30 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </motion.h3>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
          >
            <Button 
              onClick={resetToDefault}
              variant="secondary"
              size="sm"
              className="flex items-center gap-1"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </motion.div>
        </div>
        
        <motion.div 
          className="relative min-h-64 flex flex-col items-center justify-center gap-6 mb-6 perspective-1000"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <StructureRenderer 
            structure={structure} 
            dataStructureId={dataStructure.id} 
          />
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
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
        </motion.div>
        
        {operationLog.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <OperationLog logs={operationLog} />
          </motion.div>
        )}
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <OperationsInfo operations={dataStructure.operations} />
      </motion.div>
      
      {dataStructure.implementation && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <ImplementationCode code={dataStructure.implementation} />
        </motion.div>
      )}
    </div>
  );
};
