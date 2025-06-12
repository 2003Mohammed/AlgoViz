
import { ArrayItem, VisualizationStep } from '../../types/visualizer';
import { ITEM_STATUSES } from './constants';

/**
 * Visualizes array operations like add, remove, search
 */
export function visualizeArrayOperation(array: any[], operation: string, value?: any): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const initialArray = array.map(item => ({ value: item, status: ITEM_STATUSES.DEFAULT as ArrayItem['status'] }));
  
  steps.push({
    array: [...initialArray],
    lineIndex: 0,
  });
  
  if (operation === 'add') {
    const newItem = { value, status: ITEM_STATUSES.ADDED as ArrayItem['status'] };
    const updatedArray = [...initialArray, newItem];
    
    steps.push({
      array: [...updatedArray],
      lineIndex: 1,
    });
  } 
  else if (operation === 'remove') {
    const highlightArray = initialArray.map((item, index) => 
      index === initialArray.length - 1 
        ? { ...item, status: ITEM_STATUSES.REMOVING as ArrayItem['status'] } 
        : { ...item, status: ITEM_STATUSES.DEFAULT as ArrayItem['status'] }
    );
    
    steps.push({
      array: [...highlightArray],
      lineIndex: 1,
    });
    
    const updatedArray = [...initialArray];
    updatedArray.pop();
    
    steps.push({
      array: [...updatedArray],
      lineIndex: 2,
    });
  }
  else if (operation === 'search') {
    const targetIndex = array.findIndex(item => item === value);
    
    for (let i = 0; i < array.length; i++) {
      const searchArray = initialArray.map((item, index) => ({
        ...item,
        status: index === i ? ITEM_STATUSES.COMPARING as ArrayItem['status'] : 
                index === targetIndex && i >= targetIndex ? ITEM_STATUSES.FOUND as ArrayItem['status'] :
                ITEM_STATUSES.DEFAULT as ArrayItem['status']
      }));
      
      steps.push({
        array: [...searchArray],
        lineIndex: i + 1,
      });
      
      if (i === targetIndex) break;
    }
  }
  
  return steps;
}

/**
 * Visualizes array sorting with different algorithms
 */
export function visualizeArraySort(array: any[], algorithm: string): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const arr = array.map(item => ({ value: item, status: ITEM_STATUSES.DEFAULT as ArrayItem['status'] }));
  
  switch (algorithm) {
    case 'bubble':
      return visualizeBubbleSort([...arr]);
    case 'merge':
      return visualizeMergeSort([...arr]);
    case 'quick':
      return visualizeQuickSort([...arr]);
    default:
      return [{ array: [...arr], lineIndex: 0 }];
  }
}

function visualizeBubbleSort(arr: ArrayItem[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const n = arr.length;
  
  steps.push({ array: JSON.parse(JSON.stringify(arr)), lineIndex: 0 });
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Mark elements being compared
      const compareArray = JSON.parse(JSON.stringify(arr));
      compareArray[j].status = ITEM_STATUSES.COMPARING;
      compareArray[j + 1].status = ITEM_STATUSES.COMPARING;
      steps.push({ array: compareArray, lineIndex: j + 1 });
      
      if (arr[j].value > arr[j + 1].value) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        const swapArray = JSON.parse(JSON.stringify(arr));
        swapArray[j].status = ITEM_STATUSES.SWAPPING;
        swapArray[j + 1].status = ITEM_STATUSES.SWAPPING;
        steps.push({ array: swapArray, lineIndex: j + 1 });
      }
      
      // Reset status
      arr[j].status = ITEM_STATUSES.DEFAULT;
      arr[j + 1].status = ITEM_STATUSES.DEFAULT;
    }
    arr[n - i - 1].status = ITEM_STATUSES.SORTED;
    steps.push({ array: JSON.parse(JSON.stringify(arr)), lineIndex: n - i });
  }
  
  return steps;
}

function visualizeMergeSort(arr: ArrayItem[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  
  function mergeSort(array: ArrayItem[], left: number, right: number) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      mergeSort(array, left, mid);
      mergeSort(array, mid + 1, right);
      merge(array, left, mid, right);
    }
  }
  
  function merge(array: ArrayItem[], left: number, mid: number, right: number) {
    const leftArray = array.slice(left, mid + 1);
    const rightArray = array.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;
    
    while (i < leftArray.length && j < rightArray.length) {
      const stepArray = JSON.parse(JSON.stringify(array));
      stepArray[k].status = ITEM_STATUSES.COMPARING;
      steps.push({ array: stepArray, lineIndex: k });
      
      if (leftArray[i].value <= rightArray[j].value) {
        array[k] = leftArray[i];
        i++;
      } else {
        array[k] = rightArray[j];
        j++;
      }
      k++;
    }
    
    while (i < leftArray.length) {
      array[k] = leftArray[i];
      i++;
      k++;
    }
    
    while (j < rightArray.length) {
      array[k] = rightArray[j];
      j++;
      k++;
    }
    
    const finalArray = JSON.parse(JSON.stringify(array));
    for (let idx = left; idx <= right; idx++) {
      finalArray[idx].status = ITEM_STATUSES.SORTED;
    }
    steps.push({ array: finalArray, lineIndex: right });
  }
  
  steps.push({ array: JSON.parse(JSON.stringify(arr)), lineIndex: 0 });
  mergeSort(arr, 0, arr.length - 1);
  
  return steps;
}

function visualizeQuickSort(arr: ArrayItem[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  
  function quickSort(array: ArrayItem[], low: number, high: number) {
    if (low < high) {
      const pi = partition(array, low, high);
      quickSort(array, low, pi - 1);
      quickSort(array, pi + 1, high);
    }
  }
  
  function partition(array: ArrayItem[], low: number, high: number): number {
    const pivot = array[high];
    let i = low - 1;
    
    const pivotArray = JSON.parse(JSON.stringify(array));
    pivotArray[high].status = ITEM_STATUSES.PIVOT;
    steps.push({ array: pivotArray, lineIndex: high, pivotIndex: high });
    
    for (let j = low; j < high; j++) {
      const compareArray = JSON.parse(JSON.stringify(array));
      compareArray[j].status = ITEM_STATUSES.COMPARING;
      compareArray[high].status = ITEM_STATUSES.PIVOT;
      steps.push({ array: compareArray, lineIndex: j });
      
      if (array[j].value < pivot.value) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];
        const swapArray = JSON.parse(JSON.stringify(array));
        swapArray[i].status = ITEM_STATUSES.SWAPPING;
        swapArray[j].status = ITEM_STATUSES.SWAPPING;
        steps.push({ array: swapArray, lineIndex: j });
      }
    }
    
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    const finalArray = JSON.parse(JSON.stringify(array));
    finalArray[i + 1].status = ITEM_STATUSES.SORTED;
    steps.push({ array: finalArray, lineIndex: i + 1 });
    
    return i + 1;
  }
  
  steps.push({ array: JSON.parse(JSON.stringify(arr)), lineIndex: 0 });
  quickSort(arr, 0, arr.length - 1);
  
  return steps;
}

/**
 * Visualizes array comparison
 */
export function visualizeArrayComparison(array1: any[], array2: any[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const maxLength = Math.max(array1.length, array2.length);
  
  for (let i = 0; i < maxLength; i++) {
    const compareArray = [];
    
    for (let j = 0; j < maxLength; j++) {
      const val1 = j < array1.length ? array1[j] : null;
      const val2 = j < array2.length ? array2[j] : null;
      
      let status = ITEM_STATUSES.DEFAULT;
      if (j === i) {
        status = ITEM_STATUSES.COMPARING;
      } else if (j < i) {
        status = val1 === val2 ? ITEM_STATUSES.SORTED : ITEM_STATUSES.FOUND;
      }
      
      compareArray.push({
        value: `${val1 || 'null'} vs ${val2 || 'null'}`,
        status: status as ArrayItem['status']
      });
    }
    
    steps.push({
      array: compareArray,
      lineIndex: i
    });
  }
  
  return steps;
}

/**
 * Visualizes array operations like reverse, rotate, slice
 */
export function visualizeArrayTransformation(array: any[], operation: string, params?: any): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const arr = array.map(item => ({ value: item, status: ITEM_STATUSES.DEFAULT as ArrayItem['status'] }));
  
  steps.push({ array: JSON.parse(JSON.stringify(arr)), lineIndex: 0 });
  
  switch (operation) {
    case 'reverse':
      for (let i = 0; i < Math.floor(arr.length / 2); i++) {
        const j = arr.length - 1 - i;
        
        // Highlight elements being swapped
        const highlightArray = JSON.parse(JSON.stringify(arr));
        highlightArray[i].status = ITEM_STATUSES.SWAPPING;
        highlightArray[j].status = ITEM_STATUSES.SWAPPING;
        steps.push({ array: highlightArray, lineIndex: i + 1 });
        
        // Perform swap
        [arr[i], arr[j]] = [arr[j], arr[i]];
        const swappedArray = JSON.parse(JSON.stringify(arr));
        swappedArray[i].status = ITEM_STATUSES.SORTED;
        swappedArray[j].status = ITEM_STATUSES.SORTED;
        steps.push({ array: swappedArray, lineIndex: i + 1 });
      }
      break;
      
    case 'rotate-left':
      const rotateSteps = params?.steps || 1;
      for (let step = 0; step < rotateSteps; step++) {
        const first = arr.shift();
        if (first) {
          arr.push(first);
          const rotatedArray = JSON.parse(JSON.stringify(arr));
          rotatedArray[arr.length - 1].status = ITEM_STATUSES.ADDED;
          steps.push({ array: rotatedArray, lineIndex: step + 1 });
        }
      }
      break;
      
    case 'rotate-right':
      const rotateRightSteps = params?.steps || 1;
      for (let step = 0; step < rotateRightSteps; step++) {
        const last = arr.pop();
        if (last) {
          arr.unshift(last);
          const rotatedArray = JSON.parse(JSON.stringify(arr));
          rotatedArray[0].status = ITEM_STATUSES.ADDED;
          steps.push({ array: rotatedArray, lineIndex: step + 1 });
        }
      }
      break;
      
    case 'slice':
      const start = params?.start || 0;
      const end = params?.end || arr.length;
      
      for (let i = 0; i < arr.length; i++) {
        const sliceArray = JSON.parse(JSON.stringify(arr));
        if (i >= start && i < end) {
          sliceArray[i].status = ITEM_STATUSES.FOUND;
        } else {
          sliceArray[i].status = ITEM_STATUSES.REMOVING;
        }
        steps.push({ array: sliceArray, lineIndex: i + 1 });
      }
      
      const slicedArray = arr.slice(start, end).map(item => ({
        ...item,
        status: ITEM_STATUSES.SORTED as ArrayItem['status']
      }));
      steps.push({ array: slicedArray, lineIndex: arr.length });
      break;
  }
  
  return steps;
}
