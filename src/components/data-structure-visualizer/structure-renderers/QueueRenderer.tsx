
import React from 'react';
import { motion } from 'framer-motion';
import { ArrayItem } from '../../../types/visualizer';

interface QueueRendererProps {
  queue: ArrayItem[];
}

export const QueueRenderer: React.FC<QueueRendererProps> = ({ queue }) => {
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
      default:
        return 'bg-primary';
    }
  };

  if (queue.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-muted-foreground">
          <div className="w-64 h-16 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center mb-4">
            <div className="text-xs">Empty Queue</div>
          </div>
          <p className="text-sm">Enqueue elements to see visualization</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-64 p-8">
      <div className="relative">
        <div className="flex items-center gap-1">
          {queue.map((item, index) => (
            <motion.div
              key={`${index}-${item.value}`}
              className={`w-16 h-16 ${getStatusColor(item.status)} text-white border border-gray-300 flex items-center justify-center font-bold text-sm rounded-md`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              {item.value}
            </motion.div>
          ))}
        </div>
        
        {/* Front and Rear indicators */}
        <div className="absolute -top-8 left-0 text-xs text-muted-foreground">
          FRONT →
        </div>
        <div className="absolute -bottom-8 right-0 text-xs text-muted-foreground">
          ← REAR
        </div>
      </div>
    </div>
  );
};
