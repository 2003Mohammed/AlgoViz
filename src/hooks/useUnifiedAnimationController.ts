import { useCallback, useEffect, useRef, useState } from 'react';

export const getAnimationIntervalMs = (speed: number) => Math.max(100, Math.round(1000 / speed));

export const canStepForward = (currentStep: number, totalSteps: number) => currentStep < totalSteps - 1;
export const canStepBackward = (currentStep: number) => currentStep > 0;

interface UseUnifiedAnimationControllerOptions<TStep> {
  steps: TStep[];
  onApplyStep: (step: TStep, index: number) => void;
  initialSpeed?: number;
}

export const useUnifiedAnimationController = <TStep,>({
  steps,
  onApplyStep,
  initialSpeed = 1,
}: UseUnifiedAnimationControllerOptions<TStep>) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(initialSpeed);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const applyStep = useCallback((index: number) => {
    const step = steps[index];
    if (!step) return false;
    setCurrentStep(index);
    onApplyStep(step, index);
    return true;
  }, [steps, onApplyStep]);

  const stepForward = useCallback(() => {
    if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      return false;
    }
    return applyStep(currentStep + 1);
  }, [applyStep, currentStep, steps.length]);

  const stepBackward = useCallback(() => {
    if (currentStep <= 0) return false;
    return applyStep(currentStep - 1);
  }, [applyStep, currentStep]);

  const jumpToStart = useCallback(() => {
    setIsPlaying(false);
    return applyStep(0);
  }, [applyStep]);

  const jumpToEnd = useCallback(() => {
    if (steps.length < 1) return false;
    setIsPlaying(false);
    return applyStep(steps.length - 1);
  }, [applyStep, steps.length]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    if (!applyStep(0)) {
      setCurrentStep(0);
    }
  }, [applyStep]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isPlaying || steps.length < 2) return;

    timerRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next >= steps.length) {
          setIsPlaying(false);
          return prev;
        }
        const step = steps[next];
        if (step) {
          onApplyStep(step, next);
        }
        return next;
      });
    }, getAnimationIntervalMs(speed));

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, onApplyStep, speed, steps]);

  useEffect(() => {
    setIsPlaying(false);
    if (steps.length === 0) {
      setCurrentStep(0);
      return;
    }

    setCurrentStep(0);
    onApplyStep(steps[0], 0);
  }, [steps, onApplyStep]);

  return {
    isPlaying,
    currentStep,
    speed,
    setSpeed,
    setCurrentStep,
    setIsPlaying,
    togglePlayPause,
    stepForward,
    stepBackward,
    jumpToStart,
    jumpToEnd,
    reset,
    totalSteps: steps.length,
  };
};
