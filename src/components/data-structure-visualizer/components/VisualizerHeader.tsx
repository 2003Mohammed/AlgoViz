
import React from 'react';
import { Database, RotateCcw } from 'lucide-react';
import { Button } from '../../ui/button';
import { motion } from 'framer-motion';

interface VisualizerHeaderProps {
  dataStructureName: string;
  onReset: () => void;
}

export const VisualizerHeader: React.FC<VisualizerHeaderProps> = ({ 
  dataStructureName, 
  onReset 
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <motion.h3 
        className="text-xl font-semibold relative pixel-header"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Database className="inline-block mr-2 h-5 w-5 text-primary" />
        <span className="relative z-10">{dataStructureName} Visualization</span>
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
          onClick={onReset}
          variant="secondary"
          size="sm"
          className="flex items-center gap-1 pixel-border"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </motion.div>
    </div>
  );
};
