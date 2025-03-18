
import React from 'react';
import { Input } from '../../ui/input';
import { OperationControls } from '../operation-controls';
import { motion } from 'framer-motion';

interface InputSectionProps {
  customInput: string;
  dataStructureId: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOperation: (operation: string) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  customInput,
  dataStructureId,
  handleInputChange,
  handleOperation
}) => {
  return (
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
          className="min-w-[200px] pixel-border"
        />
      </div>
      
      <OperationControls 
        dataStructureId={dataStructureId} 
        handleOperation={handleOperation} 
      />
    </motion.div>
  );
};
