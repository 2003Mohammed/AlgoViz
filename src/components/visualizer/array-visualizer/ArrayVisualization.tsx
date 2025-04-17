
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrayItem } from '../../../types/visualizer';
import { ArrayBarComponent } from './ArrayBarComponent';

interface ArrayVisualizationProps {
  array: ArrayItem[];
}

export const ArrayVisualization: React.FC<ArrayVisualizationProps> = ({ array }) => {
  const maxValue = Math.max(...array.map(item => typeof item.value === 'number' ? item.value : 0));
  
  return (
    <motion.div 
      className="flex justify-center items-end gap-2 min-h-[260px] py-8 px-6 overflow-x-auto cyber-grid rounded-lg cyber-border relative"
      animate={{ 
        scale: [1, 1.01, 1], 
        transition: { duration: 0.8, ease: 'easeInOut' } 
      }}
    >
      {/* Animated scan line effect */}
      <div className="absolute top-0 left-0 w-full h-1 bg-cyber-primary/30 z-10 animate-scan-line"></div>
      
      {/* Digital rain effect */}
      <div className="absolute inset-0 digital-rain opacity-50"></div>
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-cyber-grid opacity-20"></div>
      
      {/* Empty state */}
      {array.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-cyber-primary text-center neon-text"
        >
          No data to visualize
        </motion.div>
      ) : (
        <div className="flex items-end gap-2 z-10">
          <AnimatePresence mode="sync">
            {array.map((item, idx) => (
              <ArrayBarComponent
                key={`item-${idx}`}
                item={item}
                idx={idx}
                maxValue={maxValue}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
      
      {/* Decorative corner elements */}
      <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-cyber-primary"></div>
      <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-cyber-secondary"></div>
      <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-cyber-secondary"></div>
      <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-cyber-primary"></div>
    </motion.div>
  );
};
