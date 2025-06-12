
import React from 'react';
import { Button } from '../../ui/button';
import { motion } from 'framer-motion';

interface OperationButtonProps {
  operation: string;
  handleOperation: (operation: string) => void;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}

export const OperationButton: React.FC<OperationButtonProps> = ({ 
  operation, 
  handleOperation, 
  icon, 
  label, 
  disabled = false 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        onClick={() => handleOperation(operation)}
        disabled={disabled}
        className="cyber-button relative overflow-hidden group"
        variant="outline"
      >
        <div className="flex items-center gap-2 relative z-10">
          {icon}
          <span>{label}</span>
        </div>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyber-primary/20 to-cyber-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
        />
      </Button>
    </motion.div>
  );
};
