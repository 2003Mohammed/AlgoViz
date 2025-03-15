
import { VisualizationStep } from '../types/visualizer';

export interface VisualizationStepWithDetails<T> {
  data: T[];
  comparingIndices: number[];
  swappedIndices: number[];
  sortedIndices: number[];
  pivotIndex?: number;
  currentIndex?: number;
  activeLineIndex: number;
}

export function generateBubbleSortSteps(array: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const arr = [...array];
  const n = arr.length;
  
  // Initial state
  steps.push({
    array: arr.map(value => ({ value, status: 'default' })),
    lineIndex: 0
  });
  
  // Bubble sort algorithm with steps
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Comparing
      steps.push({
        array: arr.map((value, idx) => ({
          value,
          status: idx === j || idx === j + 1 ? 'comparing' : 
                 idx >= n - i ? 'sorted' : 'default'
        })),
        lineIndex: 1
      });
      
      if (arr[j] > arr[j + 1]) {
        // Swapping
        steps.push({
          array: arr.map((value, idx) => ({
            value,
            status: idx === j || idx === j + 1 ? 'swapping' : 
                   idx >= n - i ? 'sorted' : 'default'
          })),
          lineIndex: 2
        });
        
        // Swap the elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        
        // After swap
        steps.push({
          array: arr.map((value, idx) => ({
            value,
            status: idx === j || idx === j + 1 ? 'comparing' : 
                   idx >= n - i ? 'sorted' : 'default'
          })),
          lineIndex: 3
        });
      }
    }
    
    // Mark the largest element as sorted
    steps.push({
      array: arr.map((value, idx) => ({
        value,
        status: idx >= n - i - 1 ? 'sorted' : 'default'
      })),
      lineIndex: 4
    });
  }
  
  // Final state - all sorted
  steps.push({
    array: arr.map(value => ({ value, status: 'sorted' })),
    lineIndex: 5
  });
  
  return steps;
}

export function generateQuickSortSteps(array: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const arr = [...array];
  
  // Initial state
  steps.push({
    array: arr.map(value => ({ value, status: 'default' })),
    lineIndex: 0
  });
  
  // Helper function to generate steps for quicksort
  const quickSort = (start: number, end: number) => {
    if (start >= end) return;
    
    // Choose pivot (last element)
    const pivot = arr[end];
    
    // Highlight pivot
    steps.push({
      array: arr.map((value, idx) => ({
        value,
        status: idx === end ? 'comparing' : 'default'
      })),
      lineIndex: 1
    });
    
    let i = start - 1;
    
    // Partition process
    for (let j = start; j < end; j++) {
      // Compare with pivot
      steps.push({
        array: arr.map((value, idx) => ({
          value,
          status: idx === j ? 'comparing' : 
                 idx === end ? 'comparing' : 
                 idx <= i ? 'visited' : 'default'
        })),
        lineIndex: 2
      });
      
      if (arr[j] <= pivot) {
        i++;
        
        // Highlight elements to be swapped
        if (i !== j) {
          steps.push({
            array: arr.map((value, idx) => ({
              value,
              status: idx === i || idx === j ? 'swapping' : 
                     idx === end ? 'comparing' : 'default'
            })),
            lineIndex: 3
          });
          
          // Swap
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
      }
    }
    
    // Place pivot in its final position
    i++;
    steps.push({
      array: arr.map((value, idx) => ({
        value,
        status: idx === i || idx === end ? 'swapping' : 'default'
      })),
      lineIndex: 4
    });
    
    [arr[i], arr[end]] = [arr[end], arr[i]];
    
    // Pivot is in its final position
    steps.push({
      array: arr.map((value, idx) => ({
        value,
        status: idx === i ? 'sorted' : 'default'
      })),
      lineIndex: 5
    });
    
    // Recursively sort left and right
    quickSort(start, i - 1);
    quickSort(i + 1, end);
  };
  
  // Start the sorting
  quickSort(0, arr.length - 1);
  
  // Final state - all sorted
  steps.push({
    array: arr.map(value => ({ value, status: 'sorted' })),
    lineIndex: 6
  });
  
  return steps;
}

export function generateBinarySearchSteps(array: number[], target: number): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const arr = [...array];
  
  // Initial state
  steps.push({
    array: arr.map(value => ({ value, status: 'default' })),
    lineIndex: 0
  });
  
  let left = 0;
  let right = arr.length - 1;
  let found = false;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    // Highlight current search range
    steps.push({
      array: arr.map((value, idx) => ({
        value,
        status: idx < left || idx > right ? 'visited' :
               idx === mid ? 'comparing' : 'default'
      })),
      lineIndex: 1
    });
    
    if (arr[mid] === target) {
      // Found the target
      steps.push({
        array: arr.map((value, idx) => ({
          value,
          status: idx === mid ? 'found' : 'visited'
        })),
        lineIndex: 2
      });
      found = true;
      break;
    } else if (arr[mid] < target) {
      // Target is on the right
      steps.push({
        array: arr.map((value, idx) => ({
          value,
          status: idx <= mid ? 'visited' :
                 idx > right ? 'visited' : 'default'
        })),
        lineIndex: 3
      });
      left = mid + 1;
    } else {
      // Target is on the left
      steps.push({
        array: arr.map((value, idx) => ({
          value,
          status: idx >= mid ? 'visited' :
                 idx < left ? 'visited' : 'default'
        })),
        lineIndex: 4
      });
      right = mid - 1;
    }
  }
  
  // Final state - show results
  if (!found) {
    steps.push({
      array: arr.map(value => ({ value, status: 'visited' })),
      lineIndex: 5
    });
  }
  
  return steps;
}
