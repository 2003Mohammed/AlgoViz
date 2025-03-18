
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
      className="flex justify-center items-end gap-2 min-h-[220px] py-6 px-4 overflow-x-auto circuit-pattern rounded-lg"
      animate={{ scale: [1, 1.02, 1], transition: { duration: 0.4 } }}
    >
      {array.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-muted-foreground text-center"
        >
          No data to visualize
        </motion.div>
      ) : (
        <div className="flex items-end gap-2">
          {array.map((item, idx) => (
            <ArrayBarComponent
              key={`item-${idx}`}
              item={item}
              idx={idx}
              maxValue={maxValue}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};
