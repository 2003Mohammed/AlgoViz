import { useMemo } from 'react';
import { toast } from '../use-toast';
import { useUnifiedAnimationController } from '../useUnifiedAnimationController';

export function useAnimationControls(
  totalSteps: number,
  stepsRef: React.MutableRefObject<any[]>,
  setArray: React.Dispatch<React.SetStateAction<any>>,
  setActiveLineIndex: React.Dispatch<React.SetStateAction<number>>,
  _animationRef: React.MutableRefObject<number | null>
) {
  const steps = useMemo(() => stepsRef.current.slice(0, totalSteps), [stepsRef, totalSteps]);

  const controller = useUnifiedAnimationController({
    steps,
    onApplyStep: (step) => {
      setArray(step.array);
      setActiveLineIndex(step.lineIndex);
    },
    initialSpeed: 1,
  });

  const wrappedStepForward = () => {
    const moved = controller.stepForward();
    if (!moved && controller.currentStep >= totalSteps - 1 && totalSteps > 0) {
      toast({
        title: 'End of visualization',
        description: 'Reached the final step of the algorithm',
      });
    }
    return moved;
  };

  return {
    ...controller,
    stepForward: wrappedStepForward,
  };
}
