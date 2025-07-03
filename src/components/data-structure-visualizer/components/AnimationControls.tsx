
import React from 'react';
import { Button } from '../../ui/button';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnimationControlsProps {
  isAnimating: boolean;
  currentStep: number;
  animationSteps: any[];
  speed: number;
  setCurrentStep: (step: number) => void;
  setIsAnimating: (animating: boolean) => void;
  onSpeedChange: (speed: number) => void;
}

export const AnimationControls: React.FC<AnimationControlsProps> = ({
  isAnimating,
  currentStep,
  animationSteps,
  speed,
  setCurrentStep,
  setIsAnimating,
  onSpeedChange
}) => {
  const handlePlayPause = () => {
    setIsAnimating(!isAnimating);
  };

  const handleStepForward = () => {
    if (currentStep < animationSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setIsAnimating(false);
    setCurrentStep(0);
  };

  if (animationSteps.length === 0) return null;

  return (
    <motion.div 
      className="flex items-center justify-center gap-4 p-4 bg-muted rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={handleReset}
        disabled={currentStep === 0 && !isAnimating}
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleStepBackward}
        disabled={currentStep === 0 || isAnimating}
      >
        <SkipBack className="h-4 w-4" />
      </Button>
      
      <Button
        onClick={handlePlayPause}
        disabled={animationSteps.length === 0}
        className="px-6"
      >
        {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        <span className="ml-2">{isAnimating ? 'Pause' : 'Play'}</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleStepForward}
        disabled={currentStep === animationSteps.length - 1 || isAnimating}
      >
        <SkipForward className="h-4 w-4" />
      </Button>
      
      <div className="text-sm text-muted-foreground">
        Step {currentStep + 1} of {animationSteps.length}
      </div>
      
      {/* Speed Control */}
      <div className="flex items-center gap-2">
        <span className="text-sm">Speed:</span>
        <select 
          value={speed} 
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="text-sm border rounded px-2 py-1"
        >
          <option value={0.5}>0.5x</option>
          <option value={1}>1x</option>
          <option value={1.5}>1.5x</option>
          <option value={2}>2x</option>
        </select>
      </div>
    </motion.div>
  );
};
