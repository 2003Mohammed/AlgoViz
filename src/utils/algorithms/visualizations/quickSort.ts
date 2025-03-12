
import { ArrayItem, VisualizationStep } from '../../../types/visualizer';

export function generateQuickSortSteps(initialArray: ArrayItem[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const arr = JSON.parse(JSON.stringify(initialArray));
  
  // Initial state
  steps.push({
    array: JSON.parse(JSON.stringify(arr)),
    lineIndex: 0
  });
  
  function quickSort(array: ArrayItem[], low: number, high: number) {
    if (low < high) {
      // Select pivot (last element)
      const pivotIdx = high;
      array[pivotIdx].status = 'pivot';
      
      steps.push({
        array: JSON.parse(JSON.stringify(array)),
        lineIndex: 7 // Line showing pivot selection
      });
      
      let i = low - 1;
      
      // Partition process
      for (let j = low; j < high; j++) {
        // Mark current elements being compared
        array[j].status = 'comparing';
        if (pivotIdx !== j) {
          array[pivotIdx].status = 'pivot';
        }
        
        steps.push({
          array: JSON.parse(JSON.stringify(array)),
          lineIndex: 10 // Line showing comparison
        });
        
        if (array[j].value <= array[pivotIdx].value) {
          i++;
          // Swap elements
          [array[i], array[j]] = [array[j], array[i]];
          
          // Show the swap
          array[i].status = 'current';
          array[j].status = 'current';
          
          steps.push({
            array: JSON.parse(JSON.stringify(array)),
            lineIndex: 11 // Line showing swap
          });
        }
        
        // Reset statuses
        array[j].status = 'default';
        if (i >= 0) array[i].status = 'default';
      }
      
      // Place pivot in correct position
      [array[i + 1], array[high]] = [array[high], array[i + 1]];
      array[i + 1].status = 'sorted';
      
      steps.push({
        array: JSON.parse(JSON.stringify(array)),
        lineIndex: 13 // Line showing pivot placement
      });
      
      // Recursive calls
      quickSort(array, low, i);
      quickSort(array, i + 2, high);
    }
    
    // Mark the range as sorted when sub-array is complete
    if (high - low <= 0 && low >= 0 && high < array.length) {
      array[low].status = 'sorted';
      steps.push({
        array: JSON.parse(JSON.stringify(array)),
        lineIndex: 14 // Line showing completion of subarray
      });
    }
  }
  
  quickSort(arr, 0, arr.length - 1);
  
  // Final state - all elements sorted
  const finalArray = arr.map(item => ({ ...item, status: 'sorted' as const }));
  steps.push({
    array: finalArray,
    lineIndex: 15
  });
  
  return steps;
}
