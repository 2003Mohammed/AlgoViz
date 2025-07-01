
import React from 'react';
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
    <motion.button
      onClick={() => !disabled && handleOperation(operation)}
      disabled={disabled}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        disabled 
          ? 'bg-muted text-muted-foreground cursor-not-allowed' 
          : 'bg-primary text-primary-foreground hover:bg-primary/90'
      }`}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </motion.button>
  );
};
