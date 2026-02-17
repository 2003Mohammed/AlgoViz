
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
}`,
    realWorldExamples: [
      {
        title: "Search Engines",
        description: "Binary search is used in search engines for efficiently locating terms in indexed data structures, enabling fast query responses.",
        industry: "Web Technology"
      },
      {
        title: "Digital Dictionaries",
        description: "When looking up words in digital dictionaries or spell checkers, binary search helps find entries quickly within sorted word lists.",
        industry: "Information Technology"
      },
      {
        title: "Database Indexing",
        description: "B-trees (a generalization of binary search) are used extensively in database systems to efficiently locate and retrieve records.",
        industry: "Database Management"
      },
      {
        title: "Machine Learning",
        description: "In decision trees and k-d trees used for nearest neighbor searches, binary search principles help divide the search space efficiently.",
        industry: "Artificial Intelligence"
      }
    ]
  },
  {
    id: 'linear-search',
    name: 'Linear Search',
    category: 'searching',
    description: 'Sequentially checks each element until the target is found.',
    icon: Search,
    timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(1)',
    pseudocode: [
      'for i from 0 to n-1',
      '  if A[i] == target return i',
      'return -1'
    ],
    implementation: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
    realWorldExamples: [
      { title: 'Small Data Scan', description: 'Useful for small unsorted lists.', industry: 'General Computing' },
      { title: 'One-pass validation', description: 'Sequential checks in streams.', industry: 'Data Processing' }
    ]
  }

];
