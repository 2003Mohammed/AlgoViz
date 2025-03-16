
import { ArrayItem, VisualizationStep } from '../../types/visualizer';
import { ITEM_STATUSES } from './constants';

/**
 * Visualizes bubble sort algorithm
 */
export function visualizeBubbleSort(values: any[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const n = values.length;
  const arr = values.map(value => ({ value, status: ITEM_STATUSES.DEFAULT as ArrayItem['status'] }));
  
  // Initial state
  steps.push({
    array: [...arr],
    lineIndex: 0
  });
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Comparing elements
      const comparingArray = [...arr];
      comparingArray[j].status = ITEM_STATUSES.COMPARING as ArrayItem['status'];
      comparingArray[j + 1].status = ITEM_STATUSES.COMPARING as ArrayItem['status'];
      
      steps.push({
        array: [...comparingArray],
        lineIndex: 1,
        comparingIndices: [j, j + 1]
      });
      
      // Swap if needed
      if (arr[j].value > arr[j + 1].value) {
        const swappingArray = [...arr];
        swappingArray[j].status = ITEM_STATUSES.SWAPPING as ArrayItem['status'];
        swappingArray[j + 1].status = ITEM_STATUSES.SWAPPING as ArrayItem['status'];
        
        steps.push({
          array: [...swappingArray],
          lineIndex: 2,
          swappedIndices: [j, j + 1]
        });
        
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
    
    // Mark sorted element
    arr[n - i - 1].status = ITEM_STATUSES.SORTED as ArrayItem['status'];
    
    steps.push({
      array: [...arr],
      lineIndex: 3,
      sortedIndices: Array.from({ length: i + 1 }, (_, idx) => n - idx - 1)
    });
  }
  
  // Final state - all sorted
  const finalArray = [...arr];
  finalArray.forEach(item => {
    item.status = ITEM_STATUSES.SORTED as ArrayItem['status'];
  });
  
  steps.push({
    array: finalArray,
    lineIndex: 4
  });
  
  return steps;
}

/**
 * Visualizes quick sort algorithm
 */
export function visualizeQuickSort(values: any[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const arr = values.map(value => ({ value, status: ITEM_STATUSES.DEFAULT as ArrayItem['status'] }));
  
  // Initial state
  steps.push({
    array: [...arr],
    lineIndex: 0
  });
  
  // This is just a placeholder - a real implementation would be more complex
  // Just marking all elements as sorted for now
  const finalArray = [...arr];
  finalArray.forEach(item => {
    item.status = ITEM_STATUSES.SORTED as ArrayItem['status'];
  });
  
  steps.push({
    array: finalArray,
    lineIndex: 1
  });
  
  return steps;
}

/**
 * Visualizes merge sort algorithm
 */
export function visualizeMergeSort(values: any[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const arr = values.map(value => ({ value, status: ITEM_STATUSES.DEFAULT as ArrayItem['status'] }));
  
  // Initial state
  steps.push({
    array: [...arr],
    lineIndex: 0
  });
  
  // This is just a placeholder - a real implementation would be more complex
  // Just marking all elements as sorted for now
  const finalArray = [...arr];
  finalArray.forEach(item => {
    item.status = ITEM_STATUSES.SORTED as ArrayItem['status'];
  });
  
  steps.push({
    array: finalArray,
    lineIndex: 1
  });
  
  return steps;
}
