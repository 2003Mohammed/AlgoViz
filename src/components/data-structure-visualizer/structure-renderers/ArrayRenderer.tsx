
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
        return 'bg-yellow-500 dark:bg-yellow-600';
      case 'swapping':
        return 'bg-blue-500 dark:bg-blue-600';
      case 'sorted':
        return 'bg-green-500 dark:bg-green-600';
      case 'visited':
        return 'bg-gray-400 dark:bg-gray-600';
      case 'found':
        return 'bg-green-500 dark:bg-green-600';
      case 'removing':
        return 'bg-red-500 dark:bg-red-600';
      case 'added':
        return 'bg-green-500 dark:bg-green-600';
      case 'current':
      case 'active':
        return 'bg-blue-500 dark:bg-blue-600';
      case 'pivot':
        return 'bg-purple-500 dark:bg-purple-600';
      default:
        return 'bg-primary dark:bg-primary-600';
    }
  };

  const getTextColor = (status?: string) => {
    return 'text-white';
  };

  return (
    <div className="w-full overflow-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex justify-center items-end gap-2 min-h-[200px] py-8">
        <AnimatePresence mode="sync">
          {array.length === 0 ? (
            <div className="text-muted-foreground text-center">Empty array</div>
          ) : (
            array.map((item, index) => {
              const height = `${Math.max(50, (item.value / Math.max(...array.map(i => i.value))) * 150)}px`;
              
              return (
                <motion.div
                  key={`${index}-${item.value}`}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                >
                  <motion.div
                    className={`${getStatusColor(item.status)} ${getTextColor(item.status)} flex items-center justify-center w-12 rounded-md transition-all duration-300 pixel-border shadow-[0_0_8px_rgba(0,100,255,0.5)]`}
                    style={{ height }}
                    initial={{ height: 0 }}
                    animate={{ height }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 25 }}
                    whileHover={{ scale: 1.1, boxShadow: "0px 0px 15px rgba(80, 160, 255, 0.8)" }}
                  >
                    {item.value}
                  </motion.div>
                  <div className="text-xs mt-1 text-blue-300">{index}</div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center mt-6">
        <div className="flex items-center gap-1 bg-gray-800/60 px-2 py-1 rounded-md">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-xs text-yellow-200">Comparing</span>
        </div>
        <div className="flex items-center gap-1 bg-gray-800/60 px-2 py-1 rounded-md">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-xs text-blue-200">Swapping</span>
        </div>
        <div className="flex items-center gap-1 bg-gray-800/60 px-2 py-1 rounded-md">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-xs text-green-200">Sorted</span>
        </div>
      </div>
    </div>
  );
};
