
import { ArrayItem, VisualizationStep } from '../../../../types/visualizer';
import { createArraySnapshot, createVisualizationStep } from '../helpers/visualizationHelpers';
import { mergeSortWithVisualization } from './mergeSortRecursive';

/**
 * Generates all visualization steps for merge sort algorithm
 */
export function generateMergeSortSteps(initialArray: ArrayItem[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const arr = JSON.parse(JSON.stringify(initialArray));
  
  // Initial state
  steps.push(createVisualizationStep(arr, 0));
  
  // Start the merge sort visualization
  mergeSortWithVisualization(arr, 0, arr.length - 1, steps);
  
  // Final state - all elements sorted
  const finalArray = createArraySnapshot(arr);
  finalArray.forEach(item => {
    item.status = 'sorted';
  });
  
  steps.push(createVisualizationStep(finalArray, 0));
  
  return steps;
}
