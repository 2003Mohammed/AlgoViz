
import React from 'react';
import { StepBack, StepForward } from 'lucide-react';
import { Button } from '../../ui/button';
import { Slider } from '../../ui/slider';
import { motion } from 'framer-motion';

interface AnimationControlsProps {
  currentStep: number;
  animationSteps: any[];
  speed: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  onSpeedChange: (value: number[]) => void;
}

export const AnimationControls: React.FC<AnimationControlsProps> = ({
  currentStep,
  animationSteps,
  speed,
  setCurrentStep,
  onSpeedChange
}) => {
  if (animationSteps.length === 0) return null;
  
  return (
    <motion.div 
      className="mb-6 space-y-3 py-3 px-4 bg-muted/30 rounded-lg border border-primary/20"
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
            variant="ghost"
            className="h-8 w-8 p-0"
            disabled={currentStep <= 0}
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          >
            <StepBack className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            className="h-8 w-8 p-0"
            disabled={currentStep >= animationSteps.length - 1}
            onClick={() => setCurrentStep(Math.min(animationSteps.length - 1, currentStep + 1))}
          >
            <StepForward className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-xs">Speed:</span>
        <Slider
          value={[speed]}
          min={0.5}
          max={2}
          step={0.5}
          onValueChange={onSpeedChange}
          className="w-32"
        />
        <span className="text-xs">{speed}x</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${(currentStep / Math.max(1, animationSteps.length - 1)) * 100}%` }}
        ></div>
      </div>
    </motion.div>
  );
};
