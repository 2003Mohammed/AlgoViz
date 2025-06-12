
import { VisualizationStep, ArrayItem } from '../../types/visualizer';
import { ITEM_STATUSES } from './constants';

/**
 * Visualizes bubble sort algorithm
 */
export function visualizeBubbleSort(array: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const arr = array.map(value => ({ value, status: ITEM_STATUSES.DEFAULT as ArrayItem['status'] }));
  const n = arr.length;
  
  // Initial state
  steps.push({
    array: JSON.parse(JSON.stringify(arr)),
    lineIndex: 0
  });
  
  for (let i = 0; i < n; i++) {
    let swapped = false;
    
    for (let j = 0; j < n - i - 1; j++) {
      // Mark elements being compared
      const compareArray = JSON.parse(JSON.stringify(arr));
      compareArray[j].status = ITEM_STATUSES.COMPARING;
      compareArray[j + 1].status = ITEM_STATUSES.COMPARING;
      
      steps.push({
        array: compareArray,
        lineIndex: j + 1,
        comparingIndices: [j, j + 1]
      });
      
      // If elements need to be swapped
      if (arr[j].value > arr[j + 1].value) {
        // Show swap
        const swapArray = JSON.parse(JSON.stringify(arr));
        swapArray[j].status = ITEM_STATUSES.SWAPPING;
        swapArray[j + 1].status = ITEM_STATUSES.SWAPPING;
        
        steps.push({
          array: swapArray,
          lineIndex: j + 1,
          swappedIndices: [j, j + 1]
        });
        
        // Perform swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
      
      // Reset status
      arr[j].status = ITEM_STATUSES.DEFAULT;
      arr[j + 1].status = ITEM_STATUSES.DEFAULT;
    }
    
    // Mark last element as sorted
    arr[n - i - 1].status = ITEM_STATUSES.SORTED;
    
    steps.push({
      array: JSON.parse(JSON.stringify(arr)),
      lineIndex: n - i,
      sortedIndices: [n - i - 1]
    });
    
    if (!swapped) break;
  }
  
  // Mark all as sorted
  const finalArray = JSON.parse(JSON.stringify(arr));
  finalArray.forEach(item => item.status = ITEM_STATUSES.SORTED);
  
  steps.push({
    array: finalArray,
    lineIndex: n
  });
  
  return steps;
}

/**
 * Visualizes quick sort algorithm
 */
export function visualizeQuickSort(array: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const arr = array.map(value => ({ value, status: ITEM_STATUSES.DEFAULT as ArrayItem['status'] }));
  
  // Initial state
  steps.push({
    array: JSON.parse(JSON.stringify(arr)),
    lineIndex: 0
  });
  
  function quickSort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    }
  }
  
  function partition(low: number, high: number): number {
    const pivot = arr[high];
    let i = low - 1;
    
    // Mark pivot
    const pivotArray = JSON.parse(JSON.stringify(arr));
    pivotArray[high].status = ITEM_STATUSES.PIVOT;
    
    steps.push({
      array: pivotArray,
      lineIndex: high,
      pivotIndex: high
    });
    
    for (let j = low; j < high; j++) {
      // Mark current element being compared
      const compareArray = JSON.parse(JSON.stringify(arr));
      compareArray[j].status = ITEM_STATUSES.COMPARING;
      compareArray[high].status = ITEM_STATUSES.PIVOT;
      
      steps.push({
        array: compareArray,
        lineIndex: j,
        comparingIndices: [j],
        pivotIndex: high
      });
      
      if (arr[j].value < pivot.value) {
        i++;
        // Show swap
        if (i !== j) {
          const swapArray = JSON.parse(JSON.stringify(arr));
          swapArray[i].status = ITEM_STATUSES.SWAPPING;
          swapArray[j].status = ITEM_STATUSES.SWAPPING;
          swapArray[high].status = ITEM_STATUSES.PIVOT;
          
          steps.push({
            array: swapArray,
            lineIndex: j,
            swappedIndices: [i, j],
            pivotIndex: high
          });
          
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
      }
      
      // Reset status
      arr[j].status = ITEM_STATUSES.DEFAULT;
    }
    
    // Place pivot in correct position
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    
    const finalArray = JSON.parse(JSON.stringify(arr));
    finalArray[i + 1].status = ITEM_STATUSES.SORTED;
    
    steps.push({
      array: finalArray,
      lineIndex: i + 1,
      sortedIndices: [i + 1]
    });
    
    return i + 1;
  }
  
  quickSort(0, arr.length - 1);
  
  // Mark all as sorted
  const finalArray = JSON.parse(JSON.stringify(arr));
  finalArray.forEach(item => item.status = ITEM_STATUSES.SORTED);
  
  steps.push({
    array: finalArray,
    lineIndex: arr.length
  });
  
  return steps;
}

/**
 * Visualizes merge sort algorithm
 */
export function visualizeMergeSort(array: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const arr = array.map(value => ({ value, status: ITEM_STATUSES.DEFAULT as ArrayItem['status'] }));
  
  // Initial state
  steps.push({
    array: JSON.parse(JSON.stringify(arr)),
    lineIndex: 0
  });
  
  function mergeSort(left: number, right: number) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      
      // Show division
      const divideArray = JSON.parse(JSON.stringify(arr));
      for (let i = left; i <= right; i++) {
        divideArray[i].status = i <= mid ? ITEM_STATUSES.ACTIVE : ITEM_STATUSES.COMPARING;
      }
      
      steps.push({
        array: divideArray,
        lineIndex: mid
      });
      
      mergeSort(left, mid);
      mergeSort(mid + 1, right);
      merge(left, mid, right);
    }
  }
  
  function merge(left: number, mid: number, right: number) {
    const leftArray = arr.slice(left, mid + 1);
    const rightArray = arr.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;
    
    while (i < leftArray.length && j < rightArray.length) {
      // Show comparison
      const compareArray = JSON.parse(JSON.stringify(arr));
      compareArray[k].status = ITEM_STATUSES.COMPARING;
      
      steps.push({
        array: compareArray,
        lineIndex: k,
        comparingIndices: [k]
      });
      
      if (leftArray[i].value <= rightArray[j].value) {
        arr[k] = leftArray[i];
        i++;
      } else {
        arr[k] = rightArray[j];
        j++;
      }
      k++;
    }
    
    while (i < leftArray.length) {
      arr[k] = leftArray[i];
      i++;
      k++;
    }
    
    while (j < rightArray.length) {
      arr[k] = rightArray[j];
      j++;
      k++;
    }
    
    // Show merged section
    const mergedArray = JSON.parse(JSON.stringify(arr));
    for (let idx = left; idx <= right; idx++) {
      mergedArray[idx].status = ITEM_STATUSES.SORTED;
    }
    
    steps.push({
      array: mergedArray,
      lineIndex: right,
      sortedIndices: Array.from({ length: right - left + 1 }, (_, i) => left + i)
    });
  }
  
  mergeSort(0, arr.length - 1);
  
  return steps;
}

/**
 * Visualizes insertion sort algorithm
 */
export function visualizeInsertionSort(array: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const arr = array.map(value => ({ value, status: ITEM_STATUSES.DEFAULT as ArrayItem['status'] }));
  
  // Initial state
  steps.push({
    array: JSON.parse(JSON.stringify(arr)),
    lineIndex: 0
  });
  
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    
    // Mark current element
    const currentArray = JSON.parse(JSON.stringify(arr));
    currentArray[i].status = ITEM_STATUSES.CURRENT;
    
    steps.push({
      array: currentArray,
      lineIndex: i,
      currentIndex: i
    });
    
    while (j >= 0 && arr[j].value > key.value) {
      // Show comparison
      const compareArray = JSON.parse(JSON.stringify(arr));
      compareArray[j].status = ITEM_STATUSES.COMPARING;
      compareArray[i].status = ITEM_STATUSES.CURRENT;
      
      steps.push({
        array: compareArray,
        lineIndex: j,
        comparingIndices: [j],
        currentIndex: i
      });
      
      // Shift element
      arr[j + 1] = arr[j];
      j--;
    }
    
    arr[j + 1] = key;
    
    // Mark sorted portion
    const sortedArray = JSON.parse(JSON.stringify(arr));
    for (let k = 0; k <= i; k++) {
      sortedArray[k].status = ITEM_STATUSES.SORTED;
    }
    
    steps.push({
      array: sortedArray,
      lineIndex: i,
      sortedIndices: Array.from({ length: i + 1 }, (_, k) => k)
    });
  }
  
  return steps;
}

/**
 * Visualizes heap sort algorithm
 */
export function visualizeHeapSort(array: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const arr = array.map(value => ({ value, status: ITEM_STATUSES.DEFAULT as ArrayItem['status'] }));
  const n = arr.length;
  
  // Initial state
  steps.push({
    array: JSON.parse(JSON.stringify(arr)),
    lineIndex: 0
  });
  
  function heapify(n: number, i: number) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    // Mark current node
    const currentArray = JSON.parse(JSON.stringify(arr));
    currentArray[i].status = ITEM_STATUSES.CURRENT;
    if (left < n) currentArray[left].status = ITEM_STATUSES.COMPARING;
    if (right < n) currentArray[right].status = ITEM_STATUSES.COMPARING;
    
    steps.push({
      array: currentArray,
      lineIndex: i,
      currentIndex: i
    });
    
    if (left < n && arr[left].value > arr[largest].value) {
      largest = left;
    }
    
    if (right < n && arr[right].value > arr[largest].value) {
      largest = right;
    }
    
    if (largest !== i) {
      // Show swap
      const swapArray = JSON.parse(JSON.stringify(arr));
      swapArray[i].status = ITEM_STATUSES.SWAPPING;
      swapArray[largest].status = ITEM_STATUSES.SWAPPING;
      
      steps.push({
        array: swapArray,
        lineIndex: largest,
        swappedIndices: [i, largest]
      });
      
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      
      heapify(n, largest);
    }
  }
  
  // Build heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }
  
  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    // Show extraction
    const extractArray = JSON.parse(JSON.stringify(arr));
    extractArray[0].status = ITEM_STATUSES.SWAPPING;
    extractArray[i].status = ITEM_STATUSES.SWAPPING;
    
    steps.push({
      array: extractArray,
      lineIndex: i,
      swappedIndices: [0, i]
    });
    
    [arr[0], arr[i]] = [arr[i], arr[0]];
    
    // Mark as sorted
    arr[i].status = ITEM_STATUSES.SORTED;
    
    steps.push({
      array: JSON.parse(JSON.stringify(arr)),
      lineIndex: i,
      sortedIndices: [i]
    });
    
    heapify(i, 0);
  }
  
  // Mark all as sorted
  const finalArray = JSON.parse(JSON.stringify(arr));
  finalArray.forEach(item => item.status = ITEM_STATUSES.SORTED);
  
  steps.push({
    array: finalArray,
    lineIndex: 0
  });
  
  return steps;
}
