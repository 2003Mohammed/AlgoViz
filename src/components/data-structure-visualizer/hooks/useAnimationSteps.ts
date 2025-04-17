
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
        // Exponential scaling for more natural speed control
        const baseDelay = 800; // Base delay in milliseconds
        const duration = baseDelay / (speed * speed); // Quadratic decrease for more responsive speed control
        
        const timer = setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, duration);
        
        return () => clearTimeout(timer);
      } else {
        // When reaching the end of animation
        setIsAnimating(false);
        
        // Optional: Add a brief pause before resetting animation
        const resetDelay = setTimeout(() => {
          // You could add additional effects here, or leave as is
        }, 500);
        
        return () => clearTimeout(resetDelay);
      }
    }
  }, [isAnimating, currentStep, animationSteps, setCurrentStep, setIsAnimating, speed]);
};
