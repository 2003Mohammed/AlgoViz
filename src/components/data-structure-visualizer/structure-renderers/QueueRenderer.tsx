
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrayItem } from '../../../types/visualizer';

interface QueueRendererProps {
  queue: ArrayItem[];
}

export const QueueRenderer: React.FC<QueueRendererProps> = ({ queue }) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'comparing':
      case 'active':
        return 'bg-yellow-400 border-yellow-500 text-yellow-900';
      case 'removing':
        return 'bg-red-400 border-red-500 text-red-900';
      case 'added':
        return 'bg-emerald-400 border-emerald-500 text-emerald-900';
      case 'found':
        return 'bg-green-400 border-green-500 text-green-900';
      default:
        return 'bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-100';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      {queue.length > 0 ? (
        <div className="relative">
          {/* Queue Container */}
          <div className="flex items-center gap-2 p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg min-w-[400px]">
            <AnimatePresence mode="popLayout">
              {queue.map((item, index) => (
                <motion.div
                  key={`${index}-${item.value}`}
                  className={`
                    w-16 h-16 flex items-center justify-center border-2 rounded-lg font-mono font-bold text-sm
                    shadow-md transition-all duration-300 ${getStatusColor(item.status)}
                  `}
                  initial={{ 
                    opacity: 0, 
                    x: index === queue.length - 1 ? 50 : 0,
                    scale: 0.8
                  }}
                  animate={{ 
                    opacity: 1, 
                    x: 0, 
                    scale: 1
                  }}
                  exit={{ 
                    opacity: 0, 
                    x: -50, 
                    scale: 0.8
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    delay: index * 0.05
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)"
                  }}
                >
                  {item.value}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Front and Rear Pointers */}
          <div className="flex justify-between mt-4 px-6">
            <motion.div 
              className="flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-0.5 h-4 bg-primary"></div>
              <div className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                FRONT
              </div>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="w-0.5 h-4 bg-secondary"></div>
              <div className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-medium">
                REAR
              </div>
            </motion.div>
          </div>
        </div>
      ) : (
        <motion.div 
          className="text-center p-8 border-2 border-dashed border-muted-foreground/30 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-muted-foreground text-lg mb-2">Empty Queue</div>
          <div className="text-sm text-muted-foreground">FIFO - First In, First Out</div>
        </motion.div>
      )}
      
      {/* Queue Info */}
      <motion.div 
        className="mt-6 flex items-center gap-4 text-sm bg-muted/50 rounded-full px-4 py-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span>Size: <strong>{queue.length}</strong></span>
        <span className="text-muted-foreground">•</span>
        <span>Front: <strong>{queue.length > 0 ? queue[0].value : 'None'}</strong></span>
        <span className="text-muted-foreground">•</span>
        <span>Rear: <strong>{queue.length > 0 ? queue[queue.length - 1].value : 'None'}</strong></span>
      </motion.div>
    </div>
  );
};
