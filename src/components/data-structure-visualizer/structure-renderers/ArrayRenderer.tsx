
import React from 'react';
import { motion } from 'framer-motion';

interface ArrayItem {
  value: any;
  status?: 'default' | 'comparing' | 'swapping' | 'sorted' | 'visited' | 'found' | 'removing' | 'added';
}

interface ArrayRendererProps {
  array: any[];
}

export const ArrayRenderer: React.FC<ArrayRendererProps> = ({ array }) => {
  const getStatusColor = (item: any) => {
    if (!item || typeof item !== 'object' || !item.status) {
      return 'bg-primary/10 border-primary/50';
    }
    
    switch (item.status) {
      case 'comparing':
        return 'bg-blue-100 border-blue-400';
      case 'swapping':
        return 'bg-amber-100 border-amber-400';
      case 'sorted':
        return 'bg-green-100 border-green-400';
      case 'visited':
        return 'bg-violet-100 border-violet-400';
      case 'found':
        return 'bg-green-100 border-green-400';
      case 'removing':
        return 'bg-red-100 border-red-400';
      case 'added':
        return 'bg-green-100 border-green-400';
      default:
        return 'bg-primary/10 border-primary/50';
    }
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {array.map((item, index) => {
        const isObject = typeof item === 'object' && item !== null;
        const value = isObject && 'value' in item ? item.value : item;
        const status = isObject && 'status' in item ? item.status : 'default';
        
        return (
          <motion.div 
            key={index} 
            className={`w-14 h-14 flex items-center justify-center border rounded-md relative group ${getStatusColor(item)}`}
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
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
            }}
          >
            <div className="font-medium text-foreground">{value}</div>
            <motion.div 
              className="opacity-0 group-hover:opacity-100 absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs rounded px-1.5 py-0.5 z-10"
              initial={{ y: 5 }}
              whileHover={{ y: 0 }}
            >
              index: {index}
            </motion.div>
          </motion.div>
        );
      })}
      {array.length === 0 && (
        <div className="text-muted-foreground">Array is empty</div>
      )}
    </div>
  );
};
