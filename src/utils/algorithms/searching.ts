
import { Search } from 'lucide-react';
import { Algorithm } from './types';

export const searchingAlgorithms: Algorithm[] = [
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'searching',
    description: 'A search algorithm that finds the position of a target value within a sorted array by repeatedly dividing the search space in half.',
    icon: Search,
    timeComplexity: {
      best: 'O(1)',
      average: 'O(log n)',
      worst: 'O(log n)'
    },
    spaceComplexity: 'O(1)',
    pseudocode: [
      'function binarySearch(A, target)',
      '    left := 0',
      '    right := length(A) - 1',
      '    while left <= right do',
      '        mid := (left + right) / 2',
      '        if A[mid] == target then',
      '            return mid',
      '        else if A[mid] < target then',
      '            left := mid + 1',
      '        else',
      '            right := mid - 1',
      '    return -1'
    ],
    implementation: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1; // Target not found
}`
  }
];
