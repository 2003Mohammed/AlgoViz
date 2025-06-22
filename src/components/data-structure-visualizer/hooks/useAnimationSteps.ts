
import { useEffect } from 'react';
import { VisualizationStep } from '../../../types/visualizer';

export const useAnimationSteps = (
  isAnimating: boolean,
  currentStep: number,
  animationSteps: VisualizationStep[],
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>,
  setIsAnimating: React.Dispatch<React.SetStateAction<boolean>>,
  speed: number = 1
) => {
  useEffect(() => {
    if (isAnimating && animationSteps.length > 0) {
      if (currentStep < animationSteps.length - 1) {
        // Calculate duration based on speed (faster speed = shorter duration)
        const baseDelay = 1000; // Base delay in milliseconds
        const duration = baseDelay / speed; // Linear decrease for speed control
        
        const timer = setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, duration);
        
        return () => clearTimeout(timer);
      } else {
        // When reaching the end of animation
        setIsAnimating(false);
      }
    }
  }, [isAnimating, currentStep, animationSteps, setCurrentStep, setIsAnimating, speed]);
};
