
import { VisualizationStep, ArrayItem } from '../../types/visualizer';

// Linear Search Visualization
export function visualizeLinearSearch(array: number[], target: number): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const arr: ArrayItem[] = array.map(val => ({ value: val, status: 'default' }));
  
  // Initial state
  steps.push({
    array: [...arr],
    lineIndex: 0,
    description: `Searching for ${target} using Linear Search`
  });
  
  for (let i = 0; i < array.length; i++) {
    // Mark current element as comparing
    const currentArr = arr.map((item, index) => ({
      ...item,
      status: index === i ? 'comparing' : index < i ? 'visited' : 'default'
    }));
    
    steps.push({
      array: currentArr,
      lineIndex: 1,
      description: `Checking element at index ${i}: ${array[i]}`
    });
    
    if (array[i] === target) {
      // Found the target
      const foundArr = arr.map((item, index) => ({
        ...item,
        status: index === i ? 'found' : index < i ? 'visited' : 'default'
      }));
      
      steps.push({
        array: foundArr,
        lineIndex: 2,
        description: `Found ${target} at index ${i}!`
      });
      break;
    }
  }
  
  return steps;
}

// Binary Search Visualization
export function visualizeBinarySearch(array: number[], target: number): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const sortedArray = [...array].sort((a, b) => a - b);
  const arr: ArrayItem[] = sortedArray.map(val => ({ value: val, status: 'default' }));
  
  // Initial state
  steps.push({
    array: [...arr],
    lineIndex: 0,
    description: `Searching for ${target} using Binary Search`
  });
  
  let left = 0;
  let right = sortedArray.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    // Show current search range
    const currentArr = arr.map((item, index) => ({
      ...item,
      status: index === mid ? 'comparing' : 
              (index >= left && index <= right) ? 'active' : 'visited'
    }));
    
    steps.push({
      array: currentArr,
      lineIndex: 1,
      description: `Checking middle element at index ${mid}: ${sortedArray[mid]}`
    });
    
    if (sortedArray[mid] === target) {
      // Found the target
      const foundArr = arr.map((item, index) => ({
        ...item,
        status: index === mid ? 'found' : 'default'
      }));
      
      steps.push({
        array: foundArr,
        lineIndex: 2,
        description: `Found ${target} at index ${mid}!`
      });
      break;
    } else if (sortedArray[mid] < target) {
      left = mid + 1;
      steps.push({
        array: currentArr,
        lineIndex: 3,
        description: `${sortedArray[mid]} < ${target}, searching right half`
      });
    } else {
      right = mid - 1;
      steps.push({
        array: currentArr,
        lineIndex: 4,
        description: `${sortedArray[mid]} > ${target}, searching left half`
      });
    }
  }
  
  return steps;
}

// Jump Search Visualization
export function visualizeJumpSearch(array: number[], target: number): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const sortedArray = [...array].sort((a, b) => a - b);
  const arr: ArrayItem[] = sortedArray.map(val => ({ value: val, status: 'default' }));
  const n = sortedArray.length;
  const jumpSize = Math.floor(Math.sqrt(n));
  
  // Initial state
  steps.push({
    array: [...arr],
    lineIndex: 0,
    description: `Jump Search for ${target} with jump size ${jumpSize}`
  });
  
  let prev = 0;
  
  // Jump phase
  while (sortedArray[Math.min(jumpSize, n) - 1] < target) {
    const currentArr = arr.map((item, index) => ({
      ...item,
      status: index === Math.min(jumpSize, n) - 1 ? 'comparing' : 
              index < Math.min(jumpSize, n) ? 'active' : 'default'
    }));
    
    steps.push({
      array: currentArr,
      lineIndex: 1,
      description: `Jumping to index ${jumpSize - 1}, value: ${sortedArray[Math.min(jumpSize, n) - 1]}`
    });
    
    prev = jumpSize;
    if (jumpSize >= n) break;
  }
  
  // Linear search phase
  for (let i = prev; i < Math.min(jumpSize, n); i++) {
    const currentArr = arr.map((item, index) => ({
      ...item,
      status: index === i ? 'comparing' : 
              (index >= prev && index < i) ? 'visited' : 'default'
    }));
    
    steps.push({
      array: currentArr,
      lineIndex: 2,
      description: `Linear search at index ${i}: ${sortedArray[i]}`
    });
    
    if (sortedArray[i] === target) {
      const foundArr = arr.map((item, index) => ({
        ...item,
        status: index === i ? 'found' : 'default'
      }));
      
      steps.push({
        array: foundArr,
        lineIndex: 3,
        description: `Found ${target} at index ${i}!`
      });
      break;
    }
  }
  
  return steps;
}
