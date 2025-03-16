
import React from 'react';
import { motion } from 'framer-motion';
import { ArrayItem } from '../../../types/visualizer';

interface StackRendererProps {
  stack: ArrayItem[];
}

export const StackRenderer: React.FC<StackRendererProps> = ({ stack }) => {
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
    <div className="flex flex-col items-center space-y-2 w-full max-w-sm mx-auto">
      {stack.length > 0 ? (
        <>
          <motion.div 
            className="px-3 py-1.5 text-xs font-medium bg-primary/20 rounded-md mb-1"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            Top
          </motion.div>
          
          <div className="w-full flex flex-col items-center border-2 border-dashed border-primary/30 rounded-lg p-6">
            {stack.map((item, index) => (
              <motion.div 
                key={index} 
                className={`w-full h-12 mb-1 flex items-center justify-center border-2 rounded-md ${getStatusColor(item.status)} shadow-md`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  type: "spring",
                  damping: 15,
                  stiffness: 200,
                  delay: index * 0.08
                }}
                whileHover={{ 
                  scale: 1.03, 
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  zIndex: 10
                }}
                style={{ 
                  transform: `perspective(1000px) rotateX(${index * 2}deg)`,
                  zIndex: stack.length - index
                }}
              >
                <span className="font-mono font-medium">{item.value}</span>
              </motion.div>
            ))}
          </div>
          
          <div className="text-sm text-muted-foreground bg-secondary/30 px-3 py-1.5 rounded-full">
            Stack Size: {stack.length}
          </div>
        </>
      ) : (
        <div className="text-muted-foreground bg-muted p-8 rounded-lg border border-dashed w-full text-center">
          Stack is empty
        </div>
      )}
    </div>
  );
};
