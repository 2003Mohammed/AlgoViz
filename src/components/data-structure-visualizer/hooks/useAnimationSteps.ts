
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
        const duration = Math.max(100, baseDelay / speed); // Minimum 100ms, max based on speed
        
        const timer = setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, duration);
        
        return () => clearTimeout(timer);
      } else {
        // When reaching the end of animation
        const timer = setTimeout(() => {
          setIsAnimating(false);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [isAnimating, currentStep, animationSteps, setCurrentStep, setIsAnimating, speed]);
};
