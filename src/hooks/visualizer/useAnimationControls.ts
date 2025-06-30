
import { useState, useCallback } from 'react';
import { toast } from '../use-toast';

export function useAnimationControls(
  totalSteps: number,
  stepsRef: React.MutableRefObject<any[]>,
  setArray: React.Dispatch<React.SetStateAction<any>>,
  setActiveLineIndex: React.Dispatch<React.SetStateAction<number>>,
  animationRef: React.MutableRefObject<number | null>
) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const reset = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    setIsPlaying(false);
    setCurrentStep(0);
    setActiveLineIndex(-1);
    
    // Reset array to initial state if steps are available
    if (stepsRef.current.length > 0) {
      setArray(stepsRef.current[0].array);
    }
  }, [setArray, setActiveLineIndex, animationRef, stepsRef]);
  
  const togglePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);
  
  const stepForward = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      const step = stepsRef.current[nextStep];
      if (step) {
        setArray(step.array);
        setActiveLineIndex(step.lineIndex);
      }
      
      return true;
    } else {
      setIsPlaying(false);
      toast({
        title: "End of visualization",
        description: "Reached the final step of the algorithm",
      });
      return false;
    }
  }, [currentStep, totalSteps, stepsRef, setArray, setActiveLineIndex, setIsPlaying]);
  
  const stepBackward = useCallback(() => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      
      const step = stepsRef.current[prevStep];
      if (step) {
        setArray(step.array);
        setActiveLineIndex(step.lineIndex);
      }
      
      return true;
    }
    return false;
  }, [currentStep, stepsRef, setArray, setActiveLineIndex]);

  return {
    isPlaying,
    currentStep,
    reset,
    togglePlayPause,
    stepForward,
    stepBackward,
    setCurrentStep,
    setIsPlaying
  };
}
