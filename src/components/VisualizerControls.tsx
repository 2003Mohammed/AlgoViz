
import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipBack, 
  SkipForward, 
  ChevronRight,
  Settings,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

interface VisualizerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSpeedChange: (speed: number) => void;
  currentSpeed: number;
  disableBackward: boolean;
  disableForward: boolean;
}

export const VisualizerControls: React.FC<VisualizerControlsProps> = ({
  isPlaying,
  onPlayPause,
  onReset,
  onStepForward,
  onStepBackward,
  onSpeedChange,
  currentSpeed,
  disableBackward,
  disableForward
}) => {
  const speeds = [0.5, 1, 1.5, 2];
  
  return (
    <motion.div 
      className="glass-card p-4 flex flex-wrap items-center justify-between gap-4 rounded-xl shadow-lg backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: 0.3,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
    >
      <div className="flex items-center gap-2">
        <motion.button
          onClick={onReset}
          className="p-2 rounded-md hover:bg-secondary transition-colors relative overflow-hidden group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Reset"
        >
          <motion.div 
            className="absolute inset-0 bg-secondary/30 rounded-md -z-10"
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <RotateCcw className="h-5 w-5" />
        </motion.button>
        
        <motion.button
          onClick={onStepBackward}
          disabled={disableBackward}
          className={`p-2 rounded-md transition-colors relative overflow-hidden ${
            disableBackward
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-secondary'
          }`}
          whileHover={!disableBackward ? { scale: 1.05 } : {}}
          whileTap={!disableBackward ? { scale: 0.95 } : {}}
          aria-label="Step backward"
        >
          <motion.div 
            className="absolute inset-0 bg-secondary/30 rounded-md -z-10"
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <SkipBack className="h-5 w-5" />
        </motion.button>
        
        <motion.button
          onClick={onPlayPause}
          className="p-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors relative overflow-hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <motion.div 
            className="absolute inset-0 bg-white/20 rounded-md -z-10"
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          {isPlaying ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
              <Pause className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
              <Play className="h-5 w-5" />
            </motion.div>
          )}
        </motion.button>
        
        <motion.button
          onClick={onStepForward}
          disabled={disableForward}
          className={`p-2 rounded-md transition-colors relative overflow-hidden ${
            disableForward
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-secondary'
          }`}
          whileHover={!disableForward ? { scale: 1.05 } : {}}
          whileTap={!disableForward ? { scale: 0.95 } : {}}
          aria-label="Step forward"
        >
          <motion.div 
            className="absolute inset-0 bg-secondary/30 rounded-md -z-10"
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <SkipForward className="h-5 w-5" />
        </motion.button>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          <motion.span 
            className="text-sm text-muted-foreground mr-2 flex items-center gap-1" 
            whileHover={{ scale: 1.05 }}
          >
            <Zap className="h-3 w-3" />
            Speed:
          </motion.span>
          <div className="flex border rounded-md overflow-hidden">
            {speeds.map((speed) => (
              <motion.button
                key={speed}
                onClick={() => onSpeedChange(speed)}
                className={`px-3 py-1.5 text-xs font-medium relative overflow-hidden ${
                  currentSpeed === speed
                    ? 'bg-primary text-white'
                    : 'hover:bg-secondary transition-colors'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentSpeed === speed && (
                  <motion.div 
                    layoutId="activeSpeed"
                    className="absolute inset-0 bg-primary -z-10"
                    transition={{ type: "spring", duration: 0.3 }}
                  />
                )}
                {speed}x
              </motion.button>
            ))}
          </div>
        </div>
        
        <motion.button
          className="p-2 rounded-md hover:bg-secondary transition-colors relative overflow-hidden"
          whileHover={{ scale: 1.05, rotate: 15 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Settings"
        >
          <motion.div 
            className="absolute inset-0 bg-secondary/30 rounded-md -z-10"
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <Settings className="h-5 w-5" />
        </motion.button>
      </div>
      
      <motion.div 
        className="absolute -bottom-8 left-0 w-full flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {isPlaying && (
          <motion.div 
            className="text-xs text-primary-foreground bg-primary px-2 py-1 rounded-full"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
          >
            Visualization in progress...
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};
