
import { useState } from 'react';
import { ArrayItem } from '../../types/visualizer';
import { generateRandomArray } from '../../utils/visualizerUtils';
import { generateVisualizationSteps } from './utils';
import { toast } from '../use-toast';

export function useArrayOperations(
  algorithmId: string,
  setArray: React.Dispatch<React.SetStateAction<ArrayItem[]>>,
  setTotalSteps: React.Dispatch<React.SetStateAction<number>>,
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>,
  setActiveLineIndex: React.Dispatch<React.SetStateAction<number>>,
  stepsRef: React.MutableRefObject<any[]>,
  resetAnimation: () => void
) {
  const handleGenerateRandomArray = (sorted = false) => {
    try {
      const newArray = generateRandomArray(sorted);
      setArray(newArray);
      resetAnimation();
      
      // Generate visualization steps
      const visualizationSteps = generateVisualizationSteps(algorithmId, newArray);
      stepsRef.current = visualizationSteps;
      setTotalSteps(visualizationSteps.length);
      
      // Set the initial state from the first step
      if (visualizationSteps.length > 0) {
        setArray(visualizationSteps[0].array);
        setActiveLineIndex(visualizationSteps[0].lineIndex);
      }
      
      toast({
        title: "Example array generated",
        description: `Ready to visualize ${algorithmId}`,
      });
    } catch (error) {
      console.error("Error generating array:", error);
      toast({
        title: "Error",
        description: "Failed to generate example array",
        variant: "destructive",
      });
    }
  };

  const handleCustomArraySubmit = (inputArray: number[]) => {
    try {
      const newArray = inputArray.map(value => ({
        value,
        status: 'default' as const
      }));
      
      setArray(newArray);
      resetAnimation();
      
      // Generate visualization steps for the custom array
      const visualizationSteps = generateVisualizationSteps(algorithmId, newArray);
      stepsRef.current = visualizationSteps;
      setTotalSteps(visualizationSteps.length);
      
      // Set the initial state from the first step
      if (visualizationSteps.length > 0) {
        setArray(visualizationSteps[0].array);
        setActiveLineIndex(visualizationSteps[0].lineIndex);
      }
      
      toast({
        title: "Custom array loaded",
        description: `Ready to visualize ${algorithmId}`,
      });
    } catch (error) {
      console.error("Error processing custom array:", error);
      toast({
        title: "Error",
        description: "Failed to process custom array",
        variant: "destructive",
      });
    }
  };

  return {
    handleGenerateRandomArray,
    handleCustomArraySubmit
  };
}
