
import React from 'react';
import { motion } from 'framer-motion';
import { ArrayItem } from '../../../types/visualizer';

interface ArrayBarComponentProps {
  item: ArrayItem;
  idx: number;
  maxValue: number;
}

export const ArrayBarComponent: React.FC<ArrayBarComponentProps> = ({ 
  item, 
  idx,
  maxValue
}) => {
  // Calculate height based on value
  const heightPercent = (typeof item.value === 'number' ? item.value / maxValue : 0.3) * 100;
  const height = Math.max(30, heightPercent * 1.8);
  
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
      case 'target':
        return 'bg-orange-500 dark:bg-orange-600';
      default:
        return 'bg-primary/80 dark:bg-primary-600/80';
    }
  };

  const getStatusBorderStyle = (status?: string) => {
    if (status === 'comparing' || status === 'swapping' || status === 'current' || status === 'active') {
      return 'border-2 border-white dark:border-white/70';
    }
    return '';
  };

  const getStatusAnimation = (status?: string) => {
    switch (status) {
      case 'comparing':
        return {
          scale: [1, 1.1, 1],
          borderColor: ['rgba(255,255,255,0.7)', 'rgba(255,255,255,1)', 'rgba(255,255,255,0.7)'],
          transition: { 
            repeat: Infinity, 
            duration: 1.5,
            ease: "easeInOut" 
          }
        };
      case 'swapping':
        return {
          rotate: [0, 5, 0, -5, 0],
          transition: { 
            repeat: Infinity, 
            duration: 1.2 
          }
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.3, 
        delay: idx * 0.02,
        type: "spring", 
        stiffness: 300, 
        damping: 25
      }}
      layout
    >
      <motion.div
        className={`${getStatusColor(item.status)} ${getStatusBorderStyle(item.status)} text-white flex items-center justify-center text-center text-sm w-14 min-w-12 rounded-md shadow-[0_0_8px_rgba(0,100,255,0.3)] backdrop-blur-sm transition-all`}
        style={{ height: `${height}px` }}
        initial={{ height: 0 }}
        animate={{
          height: `${height}px`,
          ...getStatusAnimation(item.status)
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20 
        }}
        whileHover={{ 
          scale: 1.1, 
          boxShadow: "0px 0px 15px rgba(80, 160, 255, 0.8)",
          zIndex: 10 
        }}
        layoutId={`item-${idx}`}
      >
        <div className="relative z-10 font-mono font-semibold">
          {item.value}
        </div>
        {item.status === 'comparing' && (
          <motion.div 
            className="absolute inset-0 bg-white/20 rounded-md" 
            animate={{ 
              opacity: [0.1, 0.3, 0.1] 
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        )}
      </motion.div>
      <motion.div 
        className="text-xs font-mono text-blue-300 bg-blue-950/50 px-2 py-0.5 rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {idx}
      </motion.div>
    </motion.div>
  );
};
