
import { ArrayItem, VisualizationStep } from '../../types/visualizer';
import { ITEM_STATUSES } from './constants';

/**
 * Visualizes linear search algorithm
 */
export function visualizeLinearSearch(values: any[], target: any): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const arr = values.map(value => ({ value, status: ITEM_STATUSES.DEFAULT as ArrayItem['status'] }));
  
  // Initial state
  steps.push({
    array: [...arr],
    lineIndex: 0
  });
  
  for (let i = 0; i < arr.length; i++) {
    // Current element being checked
    const currentArray = [...arr];
    for (let j = 0; j < i; j++) {
      currentArray[j].status = ITEM_STATUSES.VISITED as ArrayItem['status'];
    }
    currentArray[i].status = ITEM_STATUSES.COMPARING as ArrayItem['status'];
    
    steps.push({
      array: currentArray,
      lineIndex: 1,
      currentIndex: i
    });
    
    // Check if found
    if (arr[i].value === target) {
      const foundArray = [...currentArray];
      foundArray[i].status = ITEM_STATUSES.FOUND as ArrayItem['status'];
      
      steps.push({
        array: foundArray,
        lineIndex: 2,
        currentIndex: i
      });
      break;
    }
    
    // Not found, continue to next element
    if (i === arr.length - 1) {
      const finalArray = [...arr];
      finalArray.forEach(item => {
        item.status = ITEM_STATUSES.VISITED as ArrayItem['status'];
      });
      
      steps.push({
        array: finalArray,
        lineIndex: 3
      });
    }
  }
  
  return steps;
}

/**
 * Visualizes binary search algorithm
 */
export function visualizeBinarySearch(values: any[], target: any): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const arr = values.map(value => ({ value, status: ITEM_STATUSES.DEFAULT as ArrayItem['status'] }));
  
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
        return { ...item, status: ITEM_STATUSES.VISITED as ArrayItem['status'] };
      } else if (idx === mid) {
        return { ...item, status: ITEM_STATUSES.COMPARING as ArrayItem['status'] };
      } else {
        return { ...item, status: ITEM_STATUSES.DEFAULT as ArrayItem['status'] };
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
      foundArray[mid].status = ITEM_STATUSES.FOUND as ArrayItem['status'];
      
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
      const finalArray = [...arr];
      finalArray.forEach(item => {
        item.status = ITEM_STATUSES.VISITED as ArrayItem['status'];
      });
      
      steps.push({
        array: finalArray,
        lineIndex: 3
      });
    }
  }
  
  return steps;
}
