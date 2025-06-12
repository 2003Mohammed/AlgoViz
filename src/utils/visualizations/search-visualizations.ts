
import { VisualizationStep, ArrayItem } from '../../types/visualizer';
import { ITEM_STATUSES } from './constants';

/**
 * Visualizes linear search algorithm
 */
export function visualizeLinearSearch(array: number[], target: number): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const arr = array.map(value => ({ value, status: ITEM_STATUSES.DEFAULT as ArrayItem['status'] }));
  
  // Initial state
  steps.push({
    array: JSON.parse(JSON.stringify(arr)),
    lineIndex: 0
  });
  
  // Search through array
  for (let i = 0; i < arr.length; i++) {
    // Highlight current element being checked
    const searchArray = JSON.parse(JSON.stringify(arr));
    searchArray[i].status = ITEM_STATUSES.COMPARING;
    
    steps.push({
      array: searchArray,
      lineIndex: i + 1
    });
    
    // If found, highlight as found
    if (arr[i].value === target) {
      const foundArray = JSON.parse(JSON.stringify(arr));
      foundArray[i].status = ITEM_STATUSES.FOUND;
      
      steps.push({
        array: foundArray,
        lineIndex: i + 1
      });
      break;
    } else {
      // Mark as visited
      arr[i].status = ITEM_STATUSES.VISITED;
    }
  }
  
  return steps;
}

/**
 * Visualizes binary search algorithm
 */
export function visualizeBinarySearch(array: number[], target: number): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const arr = array.map(value => ({ value, status: ITEM_STATUSES.DEFAULT as ArrayItem['status'] }));
  
  // Initial state
  steps.push({
    array: JSON.parse(JSON.stringify(arr)),
    lineIndex: 0
  });
  
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    // Highlight search bounds
    const searchArray = JSON.parse(JSON.stringify(arr));
    for (let i = left; i <= right; i++) {
      if (i === mid) {
        searchArray[i].status = ITEM_STATUSES.COMPARING;
      } else if (i >= left && i <= right) {
        searchArray[i].status = ITEM_STATUSES.ACTIVE;
      } else {
        searchArray[i].status = ITEM_STATUSES.VISITED;
      }
    }
    
    steps.push({
      array: searchArray,
      lineIndex: mid + 1
    });
    
    if (arr[mid].value === target) {
      // Found target
      const foundArray = JSON.parse(JSON.stringify(arr));
      foundArray[mid].status = ITEM_STATUSES.FOUND;
      
      steps.push({
        array: foundArray,
        lineIndex: mid + 1
      });
      break;
    } else if (arr[mid].value < target) {
      // Search right half
      for (let i = left; i <= mid; i++) {
        arr[i].status = ITEM_STATUSES.VISITED;
      }
      left = mid + 1;
    } else {
      // Search left half
      for (let i = mid; i <= right; i++) {
        arr[i].status = ITEM_STATUSES.VISITED;
      }
      right = mid - 1;
    }
  }
  
  return steps;
}

/**
 * Visualizes jump search algorithm
 */
export function visualizeJumpSearch(array: number[], target: number): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const arr = array.map(value => ({ value, status: ITEM_STATUSES.DEFAULT as ArrayItem['status'] }));
  const n = arr.length;
  const jumpSize = Math.floor(Math.sqrt(n));
  
  // Initial state
  steps.push({
    array: JSON.parse(JSON.stringify(arr)),
    lineIndex: 0
  });
  
  let step = jumpSize;
  let prev = 0;
  
  // Find the block where element is present
  while (arr[Math.min(step, n) - 1].value < target) {
    // Highlight jump
    const jumpArray = JSON.parse(JSON.stringify(arr));
    for (let i = prev; i < Math.min(step, n); i++) {
      jumpArray[i].status = ITEM_STATUSES.ACTIVE;
    }
    
    steps.push({
      array: jumpArray,
      lineIndex: step
    });
    
    // Mark previous block as visited
    for (let i = prev; i < Math.min(step, n); i++) {
      arr[i].status = ITEM_STATUSES.VISITED;
    }
    
    prev = step;
    step += jumpSize;
    
    if (prev >= n) break;
  }
  
  // Linear search in the identified block
  for (let i = prev; i < Math.min(step, n); i++) {
    const searchArray = JSON.parse(JSON.stringify(arr));
    searchArray[i].status = ITEM_STATUSES.COMPARING;
    
    steps.push({
      array: searchArray,
      lineIndex: i + 1
    });
    
    if (arr[i].value === target) {
      const foundArray = JSON.parse(JSON.stringify(arr));
      foundArray[i].status = ITEM_STATUSES.FOUND;
      
      steps.push({
        array: foundArray,
        lineIndex: i + 1
      });
      break;
    } else {
      arr[i].status = ITEM_STATUSES.VISITED;
    }
  }
  
  return steps;
}
