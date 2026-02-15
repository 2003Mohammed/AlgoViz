import { useMemo } from 'react';
import { toast } from '../use-toast';
import { useUnifiedAnimationController } from '../useUnifiedAnimationController';

export function useAnimationControls<TStep>(
  totalSteps: number,
  stepsRef: React.MutableRefObject<TStep[]>,
  onApplyStep: (step: TStep, index: number) => void
) {
  const steps = useMemo(() => stepsRef.current.slice(0, totalSteps), [stepsRef, totalSteps]);

  const controller = useUnifiedAnimationController<TStep>({
    steps,
    onApplyStep,
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
