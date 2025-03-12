
import { ArrayItem, VisualizationStep } from '../../../types/visualizer';

export function generateMergeSortSteps(initialArray: ArrayItem[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const arr = JSON.parse(JSON.stringify(initialArray));
  
  // Initial state
  steps.push({
    array: JSON.parse(JSON.stringify(arr)),
    lineIndex: 0
  });
  
  // To track recursive calls and visualize them
  const callStack: { left: number; right: number; depth: number }[] = [];
  
  // Main merge sort function with visualization
  function mergeSortWithVisualization(array: ArrayItem[], left: number, right: number, depth = 0) {
    // Base case: if sub-array has 1 or 0 elements
    if (left >= right) {
      if (left === right) {
        // Single element is considered sorted
        array[left].status = 'sorted';
        steps.push({
          array: JSON.parse(JSON.stringify(array)),
          lineIndex: 1 // Line checking condition
        });
      }
      return;
    }
    
    // Visualize the current sub-array being processed (divide phase)
    const currentArray = JSON.parse(JSON.stringify(array));
    for (let i = left; i <= right; i++) {
      currentArray[i].status = 'comparing';
    }
    
    steps.push({
      array: currentArray,
      lineIndex: 2 // Line calculating mid
    });
    
    // Calculate mid point
    const mid = Math.floor((left + right) / 2);
    
    // Push to call stack to track recursion
    callStack.push({ left, right, depth });
    
    // Visualize the division (left half)
    const leftHalfArray = JSON.parse(JSON.stringify(array));
    for (let i = left; i <= mid; i++) {
      leftHalfArray[i].status = 'current';
    }
    
    steps.push({
      array: leftHalfArray,
      lineIndex: 3 // Line for left recursive call
    });
    
    // Recursive call for left half
    mergeSortWithVisualization(array, left, mid, depth + 1);
    
    // Visualize the division (right half)
    const rightHalfArray = JSON.parse(JSON.stringify(array));
    for (let i = mid + 1; i <= right; i++) {
      rightHalfArray[i].status = 'current';
    }
    
    steps.push({
      array: rightHalfArray,
      lineIndex: 4 // Line for right recursive call
    });
    
    // Recursive call for right half
    mergeSortWithVisualization(array, mid + 1, right, depth + 1);
    
    // Merge phase - visualize the merging of subarrays
    const beforeMergeArray = JSON.parse(JSON.stringify(array));
    for (let i = left; i <= right; i++) {
      beforeMergeArray[i].status = 'comparing';
    }
    
    steps.push({
      array: beforeMergeArray,
      lineIndex: 5 // Line for merge call
    });
    
    // Perform the merge and visualize each step
    mergeWithVisualization(array, left, mid, right);
    
    // Pop from call stack after this level of recursion is done
    callStack.pop();
  }
  
  // Helper function to merge two sorted sub-arrays with visualization
  function mergeWithVisualization(array: ArrayItem[], left: number, mid: number, right: number) {
    const n1 = mid - left + 1;
    const n2 = right - mid;
    
    // Create temporary arrays
    const leftArray: ArrayItem[] = [];
    const rightArray: ArrayItem[] = [];
    
    // Copy data to temp arrays and visualize
    for (let i = 0; i < n1; i++) {
      leftArray[i] = JSON.parse(JSON.stringify(array[left + i]));
      leftArray[i].status = 'current';
      
      const copyArray = JSON.parse(JSON.stringify(array));
      copyArray[left + i].status = 'current';
      
      steps.push({
        array: copyArray,
        lineIndex: 10 // Line copying to left array
      });
    }
    
    for (let j = 0; j < n2; j++) {
      rightArray[j] = JSON.parse(JSON.stringify(array[mid + 1 + j]));
      rightArray[j].status = 'current';
      
      const copyArray = JSON.parse(JSON.stringify(array));
      copyArray[mid + 1 + j].status = 'current';
      
      steps.push({
        array: copyArray,
        lineIndex: 12 // Line copying to right array
      });
    }
    
    // Merge the temp arrays back into array[left..right]
    let i = 0; // Initial index of left subarray
    let j = 0; // Initial index of right subarray
    let k = left; // Initial index of merged subarray
    
    // Visualize the comparison and merging
    steps.push({
      array: JSON.parse(JSON.stringify(array)),
      lineIndex: 14 // Line initializing indices
    });
    
    while (i < n1 && j < n2) {
      const compareArray = JSON.parse(JSON.stringify(array));
      
      // Highlight elements being compared
      if (left + i <= right) compareArray[left + i].status = 'comparing';
      if (mid + 1 + j <= right) compareArray[mid + 1 + j].status = 'comparing';
      
      steps.push({
        array: compareArray,
        lineIndex: 16 // Line comparison in merge
      });
      
      if (leftArray[i].value <= rightArray[j].value) {
        array[k] = JSON.parse(JSON.stringify(leftArray[i]));
        array[k].status = 'sorted';
        i++;
        
        const mergeArray = JSON.parse(JSON.stringify(array));
        mergeArray[k].status = 'sorted';
        
        steps.push({
          array: mergeArray,
          lineIndex: 18 // Line taking from left array
        });
      } else {
        array[k] = JSON.parse(JSON.stringify(rightArray[j]));
        array[k].status = 'sorted';
        j++;
        
        const mergeArray = JSON.parse(JSON.stringify(array));
        mergeArray[k].status = 'sorted';
        
        steps.push({
          array: mergeArray,
          lineIndex: 21 // Line taking from right array
        });
      }
      k++;
    }
    
    // Copy the remaining elements of leftArray
    while (i < n1) {
      array[k] = JSON.parse(JSON.stringify(leftArray[i]));
      array[k].status = 'sorted';
      i++;
      k++;
      
      const remainingArray = JSON.parse(JSON.stringify(array));
      
      steps.push({
        array: remainingArray,
        lineIndex: 25 // Line copying remaining elements of left array
      });
    }
    
    // Copy the remaining elements of rightArray
    while (j < n2) {
      array[k] = JSON.parse(JSON.stringify(rightArray[j]));
      array[k].status = 'sorted';
      j++;
      k++;
      
      const remainingArray = JSON.parse(JSON.stringify(array));
      
      steps.push({
        array: remainingArray,
        lineIndex: 26 // Line copying remaining elements of right array
      });
    }
    
    // Final state of this subarray after merging
    const finalMergeArray = JSON.parse(JSON.stringify(array));
    for (let i = left; i <= right; i++) {
      finalMergeArray[i].status = 'sorted';
    }
    
    steps.push({
      array: finalMergeArray,
      lineIndex: 5 // Merge completion
    });
  }
  
  // Start the merge sort visualization
  mergeSortWithVisualization(arr, 0, arr.length - 1);
  
  // Final state - all elements sorted
  const finalArray = JSON.parse(JSON.stringify(arr));
  finalArray.forEach(item => {
    item.status = 'sorted';
  });
  
  steps.push({
    array: finalArray,
    lineIndex: 0
  });
  
  return steps;
}
