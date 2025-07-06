
import React from 'react';
import { motion } from 'framer-motion';
import { ArrayItem } from '../../../types/visualizer';

interface StackRendererProps {
  stack: ArrayItem[];
}

export const StackRenderer: React.FC<StackRendererProps> = ({ stack }) => {
  const getStatusColor = (status: ArrayItem['status']) => {
    switch (status) {
      case 'added':
        return 'bg-green-500';
      case 'removing':
        return 'bg-red-500';
      case 'comparing':
        return 'bg-yellow-500';
      case 'current':
        return 'bg-blue-500';
      case 'visited':
        return 'bg-gray-500';
      case 'active':
        return 'bg-cyan-500';
      default:
        return 'bg-primary';
    }
  };

  if (stack.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-muted-foreground">
          <div className="w-24 h-32 border-2 border-dashed border-muted-foreground rounded-lg flex items-end justify-center mb-4">
            <div className="text-xs p-2">Empty Stack</div>
          </div>
          <p className="text-sm">Push elements to see visualization</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-64 p-8">
      <div className="relative">
        {/* Stack base */}
        <div className="w-24 h-4 bg-gray-600 rounded-b-lg"></div>
        
        {/* Stack elements */}
        <div className="flex flex-col-reverse">
          {stack.map((item, index) => (
            <motion.div
              key={`${index}-${item.value}`}
              className={`w-24 h-12 ${getStatusColor(item.status)} text-white border border-gray-300 flex items-center justify-center font-bold text-sm`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
              style={{ 
                borderRadius: index === stack.length - 1 ? '8px 8px 0 0' : '0',
                marginTop: index === 0 ? '4px' : '0'
              }}
            >
              {item.value}
            </motion.div>
          ))}
        </div>
        
        {/* Top indicator */}
        <div className="absolute -right-8 top-0 flex items-center">
          <div className="text-xs text-muted-foreground">← TOP</div>
        </div>
      </div>
    </div>
  );
};
