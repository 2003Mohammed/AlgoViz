import { visualizeArrayOperation } from './array-visualizations';
import { visualizeStackOperation } from './stack-visualizations';
import { visualizeQueueOperation } from './queue-visualizations';
import { visualizeBinaryTreeOperation } from './tree-visualizations';
import { visualizeGraphOperation } from './graph-visualizations';
import { visualizeHashTableOperation } from './hash-table-visualizations';
import { ArrayItem, VisualizationStep } from '../../types/visualizer';

export {
  visualizeArrayOperation,
  visualizeStackOperation,
  visualizeQueueOperation,
  visualizeBinaryTreeOperation,
  visualizeGraphOperation,
  visualizeHashTableOperation
};

// Make sure types from ArrayItem.status are consistently used
export const ITEM_STATUSES = {
  DEFAULT: 'default' as const,
  COMPARING: 'comparing' as const,
  SWAPPING: 'swapping' as const,
  SORTED: 'sorted' as const,
  VISITED: 'visited' as const,
  FOUND: 'found' as const,
  REMOVING: 'removing' as const,
  ADDED: 'added' as const,
  CURRENT: 'current' as const,
  PIVOT: 'pivot' as const,
  ACTIVE: 'active' as const,
  TARGET: 'target' as const,
  PATH: 'path' as const,
  PROCESSING: 'processing' as const
};

// Generate visualization steps for different algorithms
export function generateVisualizationSteps(
  algorithmId: string,
  array: ArrayItem[]
): VisualizationStep[] {
  // Extract values from array items
  const values = array.map(item => item.value);
  
  // For sorting algorithms
  if (algorithmId.includes('bubble')) {
    return visualizeBubbleSort(values);
  } 
  else if (algorithmId.includes('quick')) {
    return visualizeQuickSort(values);
  }
  else if (algorithmId.includes('merge')) {
    return visualizeMergeSort(values);
  }
  // For search algorithms
  else if (algorithmId.includes('linear')) {
    return visualizeLinearSearch(values, values[Math.floor(values.length / 2)]);
  }
  else if (algorithmId.includes('binary')) {
    return visualizeBinarySearch(values, values[Math.floor(values.length / 2)]);
  }
  // Other algorithms
  else {
    // Default basic visualization
    return [
      {
        array: array,
        lineIndex: 0
      }
    ];
  }
}

// Example implementations of visualization algorithms
function visualizeBubbleSort(array: any[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const n = array.length;
  const arr = array.map(value => ({ value, status: 'default' as const }));
  
  // Initial state
  steps.push({
    array: [...arr],
    lineIndex: 0
  });
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Comparing elements
      const comparingArray = arr.map((item, idx) => ({
        ...item,
        status: idx === j || idx === j + 1 ? 'comparing' as const : item.status
      }));
      
      steps.push({
        array: [...comparingArray],
        lineIndex: 1,
        comparingIndices: [j, j + 1]
      });
      
      // Swap if needed
      if (arr[j].value > arr[j + 1].value) {
        const swappingArray = arr.map((item, idx) => ({
          ...item,
          status: idx === j || idx === j + 1 ? 'swapping' as const : item.status
        }));
        
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
    arr[n - i - 1] = { ...arr[n - i - 1], status: 'sorted' as const };
    
    steps.push({
      array: [...arr],
      lineIndex: 3,
      sortedIndices: Array.from({ length: i + 1 }, (_, idx) => n - idx - 1)
    });
  }
  
  // Final state - all sorted
  steps.push({
    array: arr.map(item => ({ ...item, status: 'sorted' as const })),
    lineIndex: 4
  });
  
  return steps;
}

function visualizeQuickSort(array: any[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const arr = array.map(value => ({ value, status: 'default' as const }));
  
  // Initial state
  steps.push({
    array: [...arr],
    lineIndex: 0
  });
  
  // This is just a placeholder - a real implementation would be more complex
  // Just marking all elements as sorted for now
  steps.push({
    array: arr.map(item => ({ ...item, status: 'sorted' as const })),
    lineIndex: 1
  });
  
  return steps;
}

function visualizeMergeSort(array: any[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const arr = array.map(value => ({ value, status: 'default' as const }));
  
  // Initial state
  steps.push({
    array: [...arr],
    lineIndex: 0
  });
  
  // This is just a placeholder - a real implementation would be more complex
  // Just marking all elements as sorted for now
  steps.push({
    array: arr.map(item => ({ ...item, status: 'sorted' as const })),
    lineIndex: 1
  });
  
  return steps;
}

function visualizeLinearSearch(array: any[], target: any): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const arr = array.map(value => ({ value, status: 'default' as const }));
  
  // Initial state
  steps.push({
    array: [...arr],
    lineIndex: 0
  });
  
  for (let i = 0; i < arr.length; i++) {
    // Current element being checked
    const currentArray = [...arr];
    for (let j = 0; j < i; j++) {
      currentArray[j] = { ...currentArray[j], status: 'visited' as const };
    }
    currentArray[i] = { ...currentArray[i], status: 'comparing' as const };
    
    steps.push({
      array: currentArray,
      lineIndex: 1,
      currentIndex: i
    });
    
    // Check if found
    if (arr[i].value === target) {
      const foundArray = [...currentArray];
      foundArray[i] = { ...foundArray[i], status: 'found' as const };
      
      steps.push({
        array: foundArray,
        lineIndex: 2,
        currentIndex: i
      });
      break;
    }
    
    // Not found, continue to next element
    if (i === arr.length - 1) {
      steps.push({
        array: arr.map(item => ({ ...item, status: 'visited' as const })),
        lineIndex: 3
      });
    }
  }
  
  return steps;
}

function visualizeBinarySearch(array: any[], target: any): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const arr = array.map(value => ({ value, status: 'default' as const }));
  
  // Initial state
  steps.push({
    array: [...arr],
    lineIndex: 0
  });
  
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    // Update display to show current range and mid point
    const currentArray = arr.map((item, idx) => {
      if (idx < left || idx > right) {
        return { ...item, status: 'visited' as const };
      } else if (idx === mid) {
        return { ...item, status: 'comparing' as const };
      } else {
        return { ...item, status: 'default' as const };
      }
    });
    
    steps.push({
      array: [...currentArray],
      lineIndex: 1,
      currentIndex: mid
    });
    
    // Check if found
    if (arr[mid].value === target) {
      const foundArray = [...currentArray];
      foundArray[mid] = { ...foundArray[mid], status: 'found' as const };
      
      steps.push({
        array: foundArray,
        lineIndex: 2,
        currentIndex: mid
      });
      break;
    }
    
    // Update search bounds
    if (arr[mid].value < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
    
    // If not found
    if (left > right) {
      steps.push({
        array: arr.map(item => ({ ...item, status: 'visited' as const })),
        lineIndex: 3
      });
    }
  }
  
  return steps;
}
