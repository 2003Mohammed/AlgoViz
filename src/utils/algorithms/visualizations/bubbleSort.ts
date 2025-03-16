
import { ArrayItem, VisualizationStep } from '../../../types/visualizer';

export function generateBubbleSortSteps(initialArray: ArrayItem[]): VisualizationStep[] {
  // Create a deep copy of the initial array to prevent modifying the original
  const arr = JSON.parse(JSON.stringify(initialArray));
  const steps: VisualizationStep[] = [];
  const n = arr.length;
  
  // Initial state
  steps.push({
    array: JSON.parse(JSON.stringify(arr)),
    lineIndex: 0
  });
  
  // Bubble sort algorithm with step tracking
  let swapped;
  
  for (let i = 0; i < n; i++) {
    swapped = false;
    
    for (let j = 0; j < n - i - 1; j++) {
      // Mark elements being compared
      const compareArray = JSON.parse(JSON.stringify(arr));
      compareArray[j].status = 'comparing';
      compareArray[j + 1].status = 'comparing';
      
      steps.push({
        array: compareArray,
        lineIndex: 5 // Line showing comparison in pseudocode
      });
      
      // If elements need to be swapped
      if (arr[j].value > arr[j + 1].value) {
        // Create a swap visualization
        const swapArray = JSON.parse(JSON.stringify(arr));
        swapArray[j].status = 'swapping';
        swapArray[j + 1].status = 'swapping';
        
        steps.push({
          array: swapArray,
          lineIndex: 6 // Line showing swap in pseudocode
        });
        
        // Perform the actual swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
      
      // Reset element status after comparison
      arr[j].status = 'default';
      if (j === n - i - 2) {
        arr[j + 1].status = 'sorted';
      } else {
        arr[j + 1].status = 'default';
      }
    }
    
    // Mark the last element as sorted since it's in its final position
    arr[n - i - 1].status = 'sorted';
    
    // Add the state after each outer loop iteration
    steps.push({
      array: JSON.parse(JSON.stringify(arr)),
      lineIndex: 9 // Line showing end of inner loop
    });
    
    // If no swaps were made in this pass, the array is sorted
    if (!swapped) {
      // Mark all remaining elements as sorted
      for (let k = 0; k < n - i - 1; k++) {
        arr[k].status = 'sorted';
      }
      
      steps.push({
        array: JSON.parse(JSON.stringify(arr)),
        lineIndex: 11 // Early termination
      });
      break;
    }
  }
  
  // Mark all elements as sorted in the final state
  const finalArray = JSON.parse(JSON.stringify(arr));
  finalArray.forEach(item => {
    item.status = 'sorted';
  });
  
  steps.push({
    array: finalArray,
    lineIndex: 12 // Line showing end of algorithm
  });
  
  return steps;
}
