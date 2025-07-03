
import { useEffect } from 'react';

export const useAnimationSteps = (
  isAnimating: boolean,
  currentStep: number,
  animationSteps: any[],
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>,
  setIsAnimating: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    if (!isAnimating || animationSteps.length === 0) return;

    const timer = setTimeout(() => {
      if (currentStep < animationSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setIsAnimating(false);
        setCurrentStep(0);
      }
    }, 1000); // 1 second per step

    return () => clearTimeout(timer);
  }, [isAnimating, currentStep, animationSteps.length, setCurrentStep, setIsAnimating]);
};
