
import React from 'react';
import { motion } from 'framer-motion';
import { ArrayItem } from '../../../types/visualizer';

interface QueueRendererProps {
  queue: ArrayItem[];
}

export const QueueRenderer: React.FC<QueueRendererProps> = ({ queue }) => {
  // Get status color for animation
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'comparing':
        return 'bg-yellow-500 border-yellow-600';
      case 'removing':
        return 'bg-red-500 border-red-600';
      case 'added':
        return 'bg-green-500 border-green-600';
      case 'default':
      default:
        return 'bg-primary/10 border-primary/30';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 w-full">
      {queue.length > 0 ? (
        <>
          <div className="relative w-full flex justify-center">
            <div className="relative flex flex-row items-center justify-center gap-2 p-6 border-2 border-dashed border-primary/30 rounded-lg">
              <motion.div 
                className="absolute left-0 px-2 py-1 text-xs font-medium bg-primary/20 rounded-md ml-1"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                Front
              </motion.div>
              
              <motion.div 
                className="absolute right-0 px-2 py-1 text-xs font-medium bg-primary/20 rounded-md mr-1"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                Rear
              </motion.div>
              
              <div className="flex items-center space-x-2 pt-6 pb-2">
                {queue.map((item, index) => (
                  <motion.div 
                    key={index} 
                    className={`w-16 h-12 flex items-center justify-center border-2 rounded-md shadow-md pixel-border ${getStatusColor(item.status)}`}
                    initial={{ opacity: 0, x: index === queue.length - 1 ? 50 : 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      type: "spring",
                      damping: 12,
                      stiffness: 100,
                      delay: index * 0.05
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      zIndex: 10,
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
                    }}
                  >
                    <span className="font-mono font-medium">{item.value}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground bg-secondary/30 px-3 py-1.5 rounded-full">
            Queue Size: {queue.length}
          </div>
        </>
      ) : (
        <div className="text-muted-foreground bg-muted p-8 rounded-lg border border-dashed">
          Queue is empty
        </div>
      )}
    </div>
  );
};
