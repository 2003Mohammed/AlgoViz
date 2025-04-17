
import React from 'react';
import { motion } from 'framer-motion';

interface VisualizationLegendProps {
  algorithmId: string;
}

export const VisualizationLegend: React.FC<VisualizationLegendProps> = ({ algorithmId }) => {
  return (
    <motion.div 
      className="absolute top-3 right-3 z-20"
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
    >
      <div className="flex flex-wrap gap-3 text-xs bg-black/80 backdrop-blur-md p-3 cyber-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(255,214,0,0.7)]"></div>
          <span className="text-yellow-300">Comparing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.7)]"></div>
          <span className="text-green-300">Sorted/Found</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyber-primary shadow-[0_0_8px_rgba(0,243,255,0.7)]"></div>
          <span className="text-cyber-primary">Current</span>
        </div>
        {algorithmId.includes('quick') && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyber-secondary shadow-[0_0_8px_rgba(255,0,160,0.7)]"></div>
            <span className="text-cyber-secondary">Pivot</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
