
import React from 'react';
import { RefreshCw } from 'lucide-react';
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
    <motion.div 
      className="flex items-center justify-between p-4 bg-muted/20 rounded-lg"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-primary">
        {dataStructureName} Visualizer
      </h2>
      <Button
        onClick={onReset}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Reset
      </Button>
    </motion.div>
  );
};
