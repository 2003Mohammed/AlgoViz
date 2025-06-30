
import React from 'react';
import { ArrayItem } from '../../../types/visualizer';
import { motion, AnimatePresence } from 'framer-motion';

interface ArrayRendererProps {
  array: ArrayItem[];
}

export const ArrayRenderer: React.FC<ArrayRendererProps> = ({ array }) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'comparing':
        return 'bg-yellow-500 dark:bg-yellow-400 border-yellow-600';
      case 'swapping':
        return 'bg-blue-500 dark:bg-blue-400 border-blue-600';
      case 'sorted':
        return 'bg-green-500 dark:bg-green-400 border-green-600';
      case 'visited':
        return 'bg-gray-400 dark:bg-gray-500 border-gray-500';
      case 'found':
        return 'bg-green-500 dark:bg-green-400 border-green-600';
      case 'removing':
        return 'bg-red-500 dark:bg-red-400 border-red-600';
      case 'added':
        return 'bg-emerald-500 dark:bg-emerald-400 border-emerald-600';
      case 'current':
      case 'active':
        return 'bg-purple-500 dark:bg-purple-400 border-purple-600';
      case 'pivot':
        return 'bg-orange-500 dark:bg-orange-400 border-orange-600';
      default:
        return 'bg-primary dark:bg-primary border-primary';
    }
  };

  const getTextColor = (status?: string) => {
    return 'text-white font-semibold';
  };

  if (array.length === 0) {
    return (
      <div className="w-full p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-muted-foreground text-lg mb-2">Empty Array</div>
          <div className="text-sm text-muted-foreground">Add elements to see the visualization</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto p-6">
      <div className="flex justify-center items-end gap-3 min-h-[250px] py-8">
        <AnimatePresence mode="sync">
          {array.map((item, index) => {
            const height = `${Math.max(60, (Math.abs(item.value) / Math.max(...array.map(i => Math.abs(i.value)))) * 180)}px`;
            
            return (
              <motion.div
                key={`${index}-${item.value}`}
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.8 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
              >
                <motion.div
                  className={`${getStatusColor(item.status)} ${getTextColor(item.status)} 
                    flex items-center justify-center w-16 rounded-lg border-2 
                    transition-all duration-500 shadow-lg backdrop-blur-sm
                    hover:scale-105 hover:shadow-xl`}
                  style={{ height }}
                  initial={{ height: 0 }}
                  animate={{ height }}
                  transition={{ 
                    duration: 0.6, 
                    type: "spring", 
                    stiffness: 250, 
                    damping: 25 
                  }}
                  whileHover={{ 
                    scale: 1.1, 
                    boxShadow: "0px 0px 20px rgba(59, 130, 246, 0.6)" 
                  }}
                >
                  <span className="text-sm font-bold">{item.value}</span>
                </motion.div>
                <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded font-mono">
                  [{index}]
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      <div className="flex flex-wrap gap-3 justify-center mt-8 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2 bg-background/50 px-3 py-2 rounded-md">
          <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-yellow-600"></div>
          <span className="text-xs font-medium">Comparing</span>
        </div>
        <div className="flex items-center gap-2 bg-background/50 px-3 py-2 rounded-md">
          <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-blue-600"></div>
          <span className="text-xs font-medium">Swapping</span>
        </div>
        <div className="flex items-center gap-2 bg-background/50 px-3 py-2 rounded-md">
          <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-green-600"></div>
          <span className="text-xs font-medium">Found/Sorted</span>
        </div>
        <div className="flex items-center gap-2 bg-background/50 px-3 py-2 rounded-md">
          <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-red-600"></div>
          <span className="text-xs font-medium">Removing</span>
        </div>
        <div className="flex items-center gap-2 bg-background/50 px-3 py-2 rounded-md">
          <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-emerald-600"></div>
          <span className="text-xs font-medium">Added</span>
        </div>
      </div>
    </div>
  );
};
