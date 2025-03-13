
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
          className="w-14 h-14 flex items-center justify-center border border-primary/50 rounded-md bg-primary/10 relative group"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.3, 
            delay: index * 0.05,
            type: "spring",
            stiffness: 260,
            damping: 20 
          }}
          whileHover={{ 
            scale: 1.1, 
            backgroundColor: "rgba(var(--primary), 0.2)",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
          }}
        >
          <div className="font-medium text-foreground">{item}</div>
          <motion.div 
            className="opacity-0 group-hover:opacity-100 absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs rounded px-1.5 py-0.5 z-10"
            initial={{ y: 5 }}
            whileHover={{ y: 0 }}
          >
            index: {index}
          </motion.div>
        </motion.div>
      ))}
      {array.length === 0 && (
        <div className="text-muted-foreground">Array is empty</div>
      )}
    </div>
  );
};
