
import { useState, useCallback } from 'react';

export interface VisualizationStep {
  data: any;
  description: string;
  highlightIndices?: number[];
  compareIndices?: number[];
  swapIndices?: number[];
  activeIndex?: number;
}

export function useVisualizationSteps<T>(initialData: T) {
  const [steps, setSteps] = useState<VisualizationStep[]>([]);
  const [operationCount, setOperationCount] = useState(0);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);

  const addStep = useCallback((step: VisualizationStep) => {
    setSteps(prev => [...prev, step]);
  }, []);

  const clearSteps = useCallback(() => {
    setSteps([]);
    setOperationCount(0);
    setComparisons(0);
    setSwaps(0);
  }, []);

  const incrementComparisons = useCallback(() => {
    setComparisons(prev => prev + 1);
    setOperationCount(prev => prev + 1);
  }, []);

  const incrementSwaps = useCallback(() => {
    setSwaps(prev => prev + 1);
    setOperationCount(prev => prev + 1);
  }, []);

  const getCurrentStep = useCallback((index: number): VisualizationStep | null => {
    return steps[index] || null;
  }, [steps]);

  return {
    steps,
    operationCount,
    comparisons,
    swaps,
    addStep,
    clearSteps,
    incrementComparisons,
    incrementSwaps,
    getCurrentStep,
    totalSteps: steps.length
  };
}
