
import React from 'react';
import { ArrayItem } from '../../../types/visualizer';
import { motion } from 'framer-motion';

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
    switch (status) {
      case 'comparing':
      case 'swapping':
      case 'sorted':
      case 'found':
      case 'removing':
      case 'added':
      case 'current':
      case 'active':
      case 'pivot':
        return 'text-white';
      default:
        return 'text-primary-foreground';
    }
  };

  return (
    <div className="w-full overflow-auto">
      <div className="flex justify-center items-end gap-2 min-h-[200px] py-4">
        {array.length === 0 ? (
          <div className="text-muted-foreground text-center">Empty array</div>
        ) : (
          array.map((item, index) => {
            const height = `${Math.max(50, (item.value / Math.max(...array.map(i => i.value))) * 150)}px`;
            
            return (
              <motion.div
                key={index}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <motion.div
                  className={`${getStatusColor(item.status)} ${getTextColor(item.status)} flex items-center justify-center w-12 rounded-t-md transition-all duration-300`}
                  style={{ height }}
                  initial={{ height: 0 }}
                  animate={{ height }}
                  transition={{ duration: 0.5 }}
                >
                  {item.value}
                </motion.div>
                <div className="text-xs mt-1">{index}</div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
