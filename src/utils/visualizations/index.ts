import { visualizeArrayOperation } from './array-visualizations';
import { visualizeStackOperation } from './stack-visualizations';
import { visualizeQueueOperation } from './queue-visualizations';
import { visualizeBinaryTreeOperation } from './tree-visualizations';
import { visualizeGraphOperation } from './graph-visualizations';
import { visualizeHashTableOperation } from './hash-table-visualizations';
import { 
  visualizeBubbleSort, 
  visualizeQuickSort, 
  visualizeMergeSort 
} from './sort-visualizations';
import { 
  visualizeLinearSearch,
  visualizeBinarySearch
} from './search-visualizations';
import { ArrayItem, VisualizationStep } from '../../types/visualizer';
import { ITEM_STATUSES } from './constants';

export {
  visualizeArrayOperation,
  visualizeStackOperation,
  visualizeQueueOperation,
  visualizeBinaryTreeOperation,
  visualizeGraphOperation,
  visualizeHashTableOperation,
  ITEM_STATUSES
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
