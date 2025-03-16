
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
        const timer = setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, 800);
        return () => clearTimeout(timer);
      } else {
        setIsAnimating(false);
      }
    }
  }, [isAnimating, currentStep, animationSteps, setCurrentStep, setIsAnimating]);
};
