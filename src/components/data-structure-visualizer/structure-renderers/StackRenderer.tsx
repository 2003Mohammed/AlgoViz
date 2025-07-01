
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrayItem } from '../../../types/visualizer';

interface StackRendererProps {
  stack: ArrayItem[];
}

export const StackRenderer: React.FC<StackRendererProps> = ({ stack }) => {
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
        return 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-100';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      {stack.length > 0 ? (
        <div className="relative">
          {/* Stack Container */}
          <div className="relative flex flex-col-reverse items-center gap-1 min-h-[300px] justify-end">
            <AnimatePresence mode="popLayout">
              {stack.map((item, index) => (
                <motion.div
                  key={`${index}-${item.value}`}
                  className={`
                    w-24 h-12 flex items-center justify-center border-2 rounded-lg font-mono font-bold text-sm
                    shadow-md transition-all duration-300 ${getStatusColor(item.status)}
                  `}
                  initial={{ 
                    opacity: 0, 
                    y: -30, 
                    scale: 0.8,
                    rotateX: -90 
                  }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    rotateX: 0
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: -30, 
                    scale: 0.8,
                    rotateX: 90
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    delay: index * 0.05
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)"
                  }}
                  style={{
                    zIndex: stack.length - index,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {item.value}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Top Pointer */}
          {stack.length > 0 && (
            <motion.div 
              className="absolute -right-16 top-0 flex items-center gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-8 h-0.5 bg-primary"></div>
              <div className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                TOP
              </div>
            </motion.div>
          )}

          {/* Base */}
          <div className="w-32 h-2 bg-muted rounded-full mx-auto mt-2"></div>
        </div>
      ) : (
        <motion.div 
          className="text-center p-8 border-2 border-dashed border-muted-foreground/30 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-muted-foreground text-lg mb-2">Empty Stack</div>
          <div className="text-sm text-muted-foreground">LIFO - Last In, First Out</div>
        </motion.div>
      )}
      
      {/* Stack Info */}
      <motion.div 
        className="mt-6 flex items-center gap-4 text-sm bg-muted/50 rounded-full px-4 py-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span>Size: <strong>{stack.length}</strong></span>
        <span className="text-muted-foreground">•</span>
        <span>Top: <strong>{stack.length > 0 ? stack[0].value : 'None'}</strong></span>
      </motion.div>
    </div>
  );
};
