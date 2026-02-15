import React from 'react';
import { Button } from '@/components/ui/button';
import { SpeedSlider } from '@/components/ui/speed-slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Play, Pause, RotateCcw, StepForward, StepBack, SkipBack, SkipForward } from 'lucide-react';
import { motion } from 'framer-motion';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

interface VisualizerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onJumpToStart: () => void;
  onJumpToEnd: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  disableBackward?: boolean;
  disableForward?: boolean;
}

export const VisualizerControls: React.FC<VisualizerControlsProps> = ({
  isPlaying,
  onPlayPause,
  onReset,
  onStepForward,
  onStepBackward,
  onJumpToStart,
  onJumpToEnd,
  speed,
  onSpeedChange,
  disableBackward = false,
  disableForward = false,
}) => {
  useKeyboardShortcuts({
    onPlayPause,
    onReset,
    onStepForward,
    onStepBackward,
    onJumpToStart,
    onJumpToEnd,
  });

  const buttonVariants = {
    hover: { scale: 1.04, transition: { duration: 0.15 } },
    tap: { scale: 0.96, transition: { duration: 0.1 } },
  };

  const ControlButton = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{title}</TooltipContent>
    </Tooltip>
  );

  const iconClass = 'h-4 w-4 text-foreground';

  return (
    <TooltipProvider delayDuration={100}>
      <div className="relative z-30 space-y-3" role="group" aria-label="Visualization controls">
        <div className="rounded-xl border bg-background/95 shadow-md backdrop-blur supports-[backdrop-filter]:bg-background/85 p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <ControlButton title="Rewind to Start (Home)">
                <Button onClick={onJumpToStart} disabled={disableBackward || isPlaying} variant="outline" size="icon" aria-label="Rewind to first step">
                  <SkipBack className={iconClass} />
                </Button>
              </ControlButton>
            </motion.div>

            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <ControlButton title="Step Backward (←)">
                <Button onClick={onStepBackward} disabled={disableBackward || isPlaying} variant="outline" size="icon" aria-label="Step backward">
                  <StepBack className={iconClass} />
                </Button>
              </ControlButton>
            </motion.div>

            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap" className="mx-1">
              <ControlButton title="Play/Pause (Space)">
                <Button
                  onClick={onPlayPause}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-28"
                  aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  <span className="ml-2">{isPlaying ? 'Pause' : 'Play'}</span>
                </Button>
              </ControlButton>
            </motion.div>

            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <ControlButton title="Step Forward (→)">
                <Button onClick={onStepForward} disabled={disableForward || isPlaying} variant="outline" size="icon" aria-label="Step forward">
                  <StepForward className={iconClass} />
                </Button>
              </ControlButton>
            </motion.div>

            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <ControlButton title="Skip to End (End)">
                <Button onClick={onJumpToEnd} disabled={disableForward || isPlaying} variant="outline" size="icon" aria-label="Skip to last step">
                  <SkipForward className={iconClass} />
                </Button>
              </ControlButton>
            </motion.div>

            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <ControlButton title="Reset to Initial Configuration (R)">
                <Button onClick={onReset} variant="outline" aria-label="Reset visualization">
                  <RotateCcw className={iconClass} />
                  <span className="ml-2">Reset</span>
                </Button>
              </ControlButton>
            </motion.div>
          </div>
        </div>

        <SpeedSlider speed={speed} onSpeedChange={onSpeedChange} />

      </div>
    </TooltipProvider>
  );
};
