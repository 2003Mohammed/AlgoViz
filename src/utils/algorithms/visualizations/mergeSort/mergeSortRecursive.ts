
import { ArrayItem, VisualizationStep } from '../../../../types/visualizer';
import { createArraySnapshot, createVisualizationStep } from '../helpers/visualizationHelpers';
import { mergeWithVisualization } from './mergeOperation';

/**
 * Performs the recursive merge sort with visualization
 */
export function mergeSortWithVisualization(
  array: ArrayItem[], 
  left: number, 
  right: number, 
  steps: VisualizationStep[],
  depth = 0
): void {
  // Base case: if sub-array has 1 or 0 elements
  if (left >= right) {
    if (left === right) {
      // Single element is considered sorted
      array[left].status = 'sorted';
      steps.push(createVisualizationStep(array, 1)); // Line checking condition
    }
    return;
  }
  
  // Visualize the current sub-array being processed (divide phase)
  const currentArray = createArraySnapshot(array);
  for (let i = left; i <= right; i++) {
    currentArray[i].status = 'comparing';
  }
  
  steps.push(createVisualizationStep(currentArray, 2)); // Line calculating mid
  
  // Calculate mid point
  const mid = Math.floor((left + right) / 2);
  
  // Visualize the division (left half)
  const leftHalfArray = createArraySnapshot(array);
  for (let i = left; i <= mid; i++) {
    leftHalfArray[i].status = 'current';
  }
  
  steps.push(createVisualizationStep(leftHalfArray, 3)); // Line for left recursive call
  
  // Recursive call for left half
  mergeSortWithVisualization(array, left, mid, steps, depth + 1);
  
  // Visualize the division (right half)
  const rightHalfArray = createArraySnapshot(array);
  for (let i = mid + 1; i <= right; i++) {
    rightHalfArray[i].status = 'current';
  }
  
  steps.push(createVisualizationStep(rightHalfArray, 4)); // Line for right recursive call
  
  // Recursive call for right half
  mergeSortWithVisualization(array, mid + 1, right, steps, depth + 1);
  
  // Merge phase - visualize the merging of subarrays
  const beforeMergeArray = createArraySnapshot(array);
  for (let i = left; i <= right; i++) {
    beforeMergeArray[i].status = 'comparing';
  }
  
  steps.push(createVisualizationStep(beforeMergeArray, 5)); // Line for merge call
  
  // Perform the merge and visualize each step
  mergeWithVisualization(array, left, mid, right, steps);
}
