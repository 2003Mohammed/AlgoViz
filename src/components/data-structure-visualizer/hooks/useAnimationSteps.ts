
import { useEffect } from 'react';
import { VisualizationStep } from '../../../types/visualizer';

export const useAnimationSteps = (
  isAnimating: boolean,
  currentStep: number,
  animationSteps: VisualizationStep[],
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>,
  setIsAnimating: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    if (isAnimating && animationSteps.length > 0) {
      if (currentStep < animationSteps.length - 1) {
        // Fixed animation timing (removed speed dependency)
        const duration = 800; // Consistent 800ms per step
        
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
  }, [isAnimating, currentStep, animationSteps, setCurrentStep, setIsAnimating]);
};
