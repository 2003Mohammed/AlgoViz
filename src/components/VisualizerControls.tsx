
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, StepForward, StepBack, Keyboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

interface VisualizerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  disableBackward?: boolean;
  disableForward?: boolean;
}

export const VisualizerControls: React.FC<VisualizerControlsProps> = ({
  isPlaying,
  onPlayPause,
  onReset,
  onStepForward,
  onStepBackward,
  disableBackward = false,
  disableForward = false,
}) => {
  // Setup keyboard shortcuts (removed speed controls)
  useKeyboardShortcuts({
    onPlayPause,
    onReset,
    onStepForward,
    onStepBackward,
    onSpeedUp: () => {}, // No-op
    onSpeedDown: () => {} // No-op
  });

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } }
  };

  return (
    <div className="space-y-4">
      {/* Main Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 p-4 bg-muted/10 rounded-lg border">
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button
            onClick={onStepBackward}
            disabled={disableBackward || isPlaying}
            variant="outline"
            title="Step Backward (←)"
          >
            <StepBack className="h-4 w-4" />
          </Button>
        </motion.div>

        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button
            onClick={onPlayPause}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6"
            title="Play/Pause (Space)"
          >
            <motion.div
              key={isPlaying ? 'pause' : 'play'}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </motion.div>
            <span className="ml-2">{isPlaying ? 'Pause' : 'Play'}</span>
          </Button>
        </motion.div>

        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button
            onClick={onStepForward}
            disabled={disableForward || isPlaying}
            variant="outline"
            title="Step Forward (→)"
          >
            <StepForward className="h-4 w-4" />
          </Button>
        </motion.div>

        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button
            onClick={onReset}
            variant="outline"
            title="Reset (R)"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="ml-2">Reset</span>
          </Button>
        </motion.div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className="bg-muted/20 backdrop-blur-sm border border-muted/30 rounded-lg p-3"
      >
        <div className="flex items-center gap-2 mb-2">
          <Keyboard className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Keyboard Shortcuts</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Play/Pause:</span>
            <kbd className="bg-muted px-2 py-1 rounded text-xs">Space</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Reset:</span>
            <kbd className="bg-muted px-2 py-1 rounded text-xs">R</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Step →:</span>
            <kbd className="bg-muted px-2 py-1 rounded text-xs">→</kbd>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
