
import React from 'react';
import { StepBack, StepForward, Play, Pause } from 'lucide-react';
import { Button } from '../../ui/button';
import { Slider } from '../../ui/slider';
import { motion } from 'framer-motion';

interface AnimationControlsProps {
  currentStep: number;
  animationSteps: any[];
  speed: number;
  isAnimating: boolean;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setIsAnimating: React.Dispatch<React.SetStateAction<boolean>>;
  onSpeedChange: (value: number[]) => void;
}

export const AnimationControls: React.FC<AnimationControlsProps> = ({
  currentStep,
  animationSteps,
  speed,
  isAnimating,
  setCurrentStep,
  setIsAnimating,
  onSpeedChange
}) => {
  if (animationSteps.length === 0) return null;
  
  const handleStepBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleStepForward = () => {
    if (currentStep < animationSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };
  
  return (
    <motion.div 
      className="mb-6 space-y-4 py-4 px-6 bg-muted/30 rounded-lg border border-primary/20"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {animationSteps.length}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline"
            className="h-8 w-8 p-0"
            disabled={currentStep <= 0}
            onClick={handleStepBack}
          >
            <StepBack className="h-4 w-4" />
          </Button>
          
          <Button 
            size="sm" 
            variant="outline"
            className="h-8 px-3"
            onClick={toggleAnimation}
          >
            {isAnimating ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
            {isAnimating ? 'Pause' : 'Play'}
          </Button>
          
          <Button 
            size="sm" 
            variant="outline"
            className="h-8 w-8 p-0"
            disabled={currentStep >= animationSteps.length - 1}
            onClick={handleStepForward}
          >
            <StepForward className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Animation Speed</span>
          <span className="text-sm text-muted-foreground">{speed}x</span>
        </div>
        <Slider
          value={[speed]}
          min={0.25}
          max={4}
          step={0.25}
          onValueChange={onSpeedChange}
          className="w-full"
        />
      </div>
      
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300" 
          style={{ width: `${(currentStep / Math.max(1, animationSteps.length - 1)) * 100}%` }}
        />
      </div>
    </motion.div>
  );
};
