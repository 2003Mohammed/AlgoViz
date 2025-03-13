
import React from 'react';
import { motion } from 'framer-motion';

interface ArrayRendererProps {
  array: any[];
}

export const ArrayRenderer: React.FC<ArrayRendererProps> = ({ array }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {array.map((item, index) => (
        <motion.div 
          key={index} 
          className="w-12 h-12 flex items-center justify-center border border-primary/50 rounded-md bg-primary/10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ scale: 1.1, backgroundColor: "rgba(var(--primary), 0.2)" }}
        >
          {item}
        </motion.div>
      ))}
      {array.length === 0 && (
        <div className="text-muted-foreground">Array is empty</div>
      )}
    </div>
  );
};
