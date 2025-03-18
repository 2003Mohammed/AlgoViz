
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
        return 'bg-amber-500 dark:bg-amber-500';
      case 'swapping':
        return 'bg-indigo-500 dark:bg-indigo-400';
      case 'sorted':
        return 'bg-emerald-500 dark:bg-emerald-400';
      case 'visited':
        return 'bg-slate-400 dark:bg-slate-500';
      case 'found':
        return 'bg-emerald-500 dark:bg-emerald-400';
      case 'removing':
        return 'bg-rose-500 dark:bg-rose-400';
      case 'added':
        return 'bg-emerald-500 dark:bg-emerald-400';
      case 'current':
      case 'active':
        return 'bg-indigo-500 dark:bg-indigo-400';
      case 'pivot':
        return 'bg-violet-500 dark:bg-violet-400';
      case 'target':
        return 'bg-orange-500 dark:bg-orange-400';
      default:
        return 'bg-slate-600 dark:bg-slate-500';
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
            duration: 1,
            ease: "easeInOut" 
          }
        };
      case 'swapping':
        return {
          rotate: [0, 3, 0, -3, 0],
          transition: { 
            repeat: Infinity, 
            duration: 0.8,
            ease: "easeInOut"
          }
        };
      case 'sorted':
        return {
          y: [0, -5, 0],
          transition: {
            duration: 0.5,
            ease: "easeOut"
          }
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0.8 }}
      animate={{ opacity: 1 }}
      layout={true}
      layoutId={`array-item-${idx}`}
    >
      <motion.div
        className={`${getStatusColor(item.status)} ${getStatusBorderStyle(item.status)} text-white flex items-center justify-center text-center text-sm w-14 min-w-12 rounded-md shadow-lg backdrop-blur-sm transition-colors`}
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
          boxShadow: "0px 0px 15px rgba(80, 160, 255, 0.5)",
          zIndex: 10 
        }}
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
              duration: 1, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        )}
      </motion.div>
      <motion.div 
        className="text-xs font-mono text-slate-300 bg-slate-800/70 px-2 py-0.5 rounded-full"
      >
        {idx}
      </motion.div>
    </motion.div>
  );
};
