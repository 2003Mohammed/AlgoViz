
import React from 'react';
import { motion } from 'framer-motion';

interface VisualizationLegendProps {
  algorithmId: string;
}

export const VisualizationLegend: React.FC<VisualizationLegendProps> = ({ algorithmId }) => {
  return (
    <motion.div 
      className="absolute top-2 right-2 z-10"
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
    >
      <div className="flex flex-wrap gap-2 text-xs bg-background/90 backdrop-blur-sm p-2 rounded-md shadow-lg border border-primary/30 pixel-border">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span>Comparing</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Sorted/Found</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>Current</span>
        </div>
        {algorithmId.includes('quick') && (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>Pivot</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
