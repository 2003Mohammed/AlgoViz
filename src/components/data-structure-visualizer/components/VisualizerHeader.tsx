
import React from 'react';
import { Button } from '../../ui/button';
import { RotateCcw, Download } from 'lucide-react';
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
    <motion.div 
      className="flex items-center justify-between mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {dataStructureName} Visualizer
        </h1>
        <p className="text-muted-foreground mt-1">
          Interactive visualization and operations
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </motion.div>
  );
};
