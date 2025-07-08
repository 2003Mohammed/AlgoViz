
import { useState, useCallback, useRef } from 'react';

export interface AnimationState {
  isPlaying: boolean;
  speed: number;
  currentStep: number;
  totalSteps: number;
}

export function useAnimationControls(totalSteps: number = 0) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);
  const animationRef = useRef<number | null>(null);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const stepForward = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const stepBackward = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const setSpeedValue = useCallback((newSpeed: number) => {
    setSpeed(Math.max(0.25, Math.min(4, newSpeed)));
  }, []);

  return {
    isPlaying,
    speed,
    currentStep,
    totalSteps,
    play,
    pause,
    reset,
    stepForward,
    stepBackward,
    setSpeed: setSpeedValue,
    setCurrentStep,
    animationRef
  };
}
