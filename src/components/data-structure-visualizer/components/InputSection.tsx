
import React from 'react';
import { Input } from '../../ui/input';
import { OperationControls } from '../operation-controls';
import { motion } from 'framer-motion';

interface InputSectionProps {
  dataStructureId: string;
  customInput: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOperation: (operation: string) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  dataStructureId,
  customInput,
  handleInputChange,
  handleOperation
}) => {
  return (
    <motion.div 
      className="cyber-panel p-4 space-y-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-lg font-semibold text-primary">Operations</h3>
      
      <div className="space-y-3">
        <Input
          type="text"
          placeholder="Enter value..."
          value={customInput}
          onChange={handleInputChange}
          className="w-full"
        />
        
        <OperationControls
          dataStructureId={dataStructureId}
          handleOperation={handleOperation}
        />
      </div>
    </motion.div>
  );
};
