
import React from 'react';
import { VisualizerProps } from '../types/visualizer';
import { VisualizerContainer } from './visualizer/VisualizerContainer';
import { motion } from 'framer-motion';

export const Visualizer: React.FC<VisualizerProps> = ({ algorithm }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
    >
      <VisualizerContainer algorithm={algorithm} />
    </motion.div>
  );
};
