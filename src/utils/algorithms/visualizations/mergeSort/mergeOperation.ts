
import { ArrayItem, VisualizationStep } from '../../../../types/visualizer';
import { createArraySnapshot, createVisualizationStep } from '../helpers/visualizationHelpers';

/**
 * Performs the merge operation with visualization steps
 */
export function mergeWithVisualization(
  array: ArrayItem[], 
  left: number, 
  mid: number, 
  right: number,
  steps: VisualizationStep[]
): void {
  const n1 = mid - left + 1;
  const n2 = right - mid;
  
  // Create temporary arrays
  const leftArray: ArrayItem[] = [];
  const rightArray: ArrayItem[] = [];
  
  // Copy data to temp arrays and visualize
  for (let i = 0; i < n1; i++) {
    leftArray[i] = JSON.parse(JSON.stringify(array[left + i]));
    leftArray[i].status = 'current';
    
    const copyArray = createArraySnapshot(array);
    copyArray[left + i].status = 'current';
    
    steps.push(createVisualizationStep(copyArray, 10)); // Line copying to left array
  }
  
  for (let j = 0; j < n2; j++) {
    rightArray[j] = JSON.parse(JSON.stringify(array[mid + 1 + j]));
    rightArray[j].status = 'current';
    
    const copyArray = createArraySnapshot(array);
    copyArray[mid + 1 + j].status = 'current';
    
    steps.push(createVisualizationStep(copyArray, 12)); // Line copying to right array
  }
  
  // Merge the temp arrays back into array[left..right]
  let i = 0; // Initial index of left subarray
  let j = 0; // Initial index of right subarray
  let k = left; // Initial index of merged subarray
  
  // Visualize the comparison and merging
  steps.push(createVisualizationStep(array, 14)); // Line initializing indices
  
  while (i < n1 && j < n2) {
    const compareArray = createArraySnapshot(array);
    
    // Highlight elements being compared
    if (left + i <= right) compareArray[left + i].status = 'comparing';
    if (mid + 1 + j <= right) compareArray[mid + 1 + j].status = 'comparing';
    
    steps.push(createVisualizationStep(compareArray, 16)); // Line comparison in merge
    
    if (leftArray[i].value <= rightArray[j].value) {
      array[k] = JSON.parse(JSON.stringify(leftArray[i]));
      array[k].status = 'sorted';
      i++;
      
      const mergeArray = createArraySnapshot(array);
      mergeArray[k].status = 'sorted';
      
      steps.push(createVisualizationStep(mergeArray, 18)); // Line taking from left array
    } else {
      array[k] = JSON.parse(JSON.stringify(rightArray[j]));
      array[k].status = 'sorted';
      j++;
      
      const mergeArray = createArraySnapshot(array);
      mergeArray[k].status = 'sorted';
      
      steps.push(createVisualizationStep(mergeArray, 21)); // Line taking from right array
    }
    k++;
  }
  
  // Copy the remaining elements of leftArray
  while (i < n1) {
    array[k] = JSON.parse(JSON.stringify(leftArray[i]));
    array[k].status = 'sorted';
    i++;
    k++;
    
    const remainingArray = createArraySnapshot(array);
    
    steps.push(createVisualizationStep(remainingArray, 25)); // Line copying remaining elements of left array
  }
  
  // Copy the remaining elements of rightArray
  while (j < n2) {
    array[k] = JSON.parse(JSON.stringify(rightArray[j]));
    array[k].status = 'sorted';
    j++;
    k++;
    
    const remainingArray = createArraySnapshot(array);
    
    steps.push(createVisualizationStep(remainingArray, 26)); // Line copying remaining elements of right array
  }
  
  // Final state of this subarray after merging
  const finalMergeArray = createArraySnapshot(array);
  for (let i = left; i <= right; i++) {
    finalMergeArray[i].status = 'sorted';
  }
  
  steps.push(createVisualizationStep(finalMergeArray, 5)); // Merge completion
}
