
import { useState } from 'react';
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
  const [speed, setSpeed] = useState(1);

  const reset = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsPlaying(false);
    setCurrentStep(0);
    setActiveLineIndex(-1);
    
    // Reset array to initial state if steps are available
    if (stepsRef.current.length > 0) {
      setArray(stepsRef.current[0].array);
    }
  };
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const stepForward = () => {
    if (currentStep < totalSteps - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      const step = stepsRef.current[nextStep];
      if (step) {
        setArray(step.array);
        setActiveLineIndex(step.lineIndex);
      }
      
      return true; // Successfully stepped forward
    } else {
      setIsPlaying(false);
      toast({
        title: "End of visualization",
        description: "Reached the final step of the algorithm",
      });
      return false; // Could not step forward (end reached)
    }
  };
  
  const stepBackward = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      
      const step = stepsRef.current[prevStep];
      if (step) {
        setArray(step.array);
        setActiveLineIndex(step.lineIndex);
      }
      
      return true; // Successfully stepped backward
    }
    return false; // Could not step backward (beginning reached)
  };
  
  const changeSpeed = (newSpeed: number) => {
    setSpeed(newSpeed);
    toast({
      title: `Speed: ${newSpeed}x`,
      description: newSpeed > 1 ? "Faster animation" : "Slower animation",
    });
  };

  return {
    isPlaying,
    currentStep,
    speed,
    reset,
    togglePlayPause,
    stepForward,
    stepBackward,
    changeSpeed,
    setCurrentStep,
    setIsPlaying
  };
}
