
import React from 'react';
import { motion } from 'framer-motion';
import { ArrayItem } from '../../../types/visualizer';

interface ArrayRendererProps {
  array: ArrayItem[];
}

export const ArrayRenderer: React.FC<ArrayRendererProps> = ({ array }) => {
  const getStatusColor = (status: ArrayItem['status']) => {
    switch (status) {
      case 'comparing':
        return 'bg-yellow-500';
      case 'swapping':
        return 'bg-red-500';
      case 'sorted':
        return 'bg-green-500';
      case 'found':
        return 'bg-blue-500';
      case 'added':
        return 'bg-purple-500';
      case 'removing':
        return 'bg-red-400';
      case 'current':
        return 'bg-orange-500';
      case 'visited':
        return 'bg-gray-500';
      case 'active':
        return 'bg-cyan-500';
      case 'processing':
        return 'bg-indigo-500';
      default:
        return 'bg-primary';
    }
  };

  if (array.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">Empty Array</p>
          <p className="text-sm">Add elements to see visualization</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-64 p-8">
      <div className="flex items-end gap-2">
        {array.map((item, index) => (
          <motion.div
            key={`${index}-${item.value}`}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="text-xs text-muted-foreground mb-1">
              {index}
            </div>
            <motion.div
              className={`w-12 h-16 ${getStatusColor(item.status)} text-white rounded-md flex items-center justify-center font-bold text-sm shadow-lg`}
              animate={{ 
                scale: item.status === 'comparing' || item.status === 'current' ? 1.1 : 1,
                boxShadow: item.status === 'found' ? '0 0 20px rgba(59, 130, 246, 0.5)' : '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              transition={{ duration: 0.2 }}
            >
              {item.value}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
