
import { ArrowUpDown } from 'lucide-react';
import { Algorithm } from './types';

export const sortingAlgorithms: Algorithm[] = [
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'sorting',
    description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    icon: ArrowUpDown,
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    pseudocode: [
      'procedure bubbleSort(A: list of sortable items)',
      '    n := length(A)',
      '    repeat',
      '        swapped := false',
      '        for i := 1 to n-1 inclusive do',
      '            if A[i-1] > A[i] then',
      '                swap(A[i-1], A[i])',
      '                swapped := true',
      '            end if',
      '        end for',
      '        n := n - 1',
      '    until not swapped',
      'end procedure'
    ],
    implementation: `function bubbleSort(arr) {
  const n = arr.length;
  let swapped;
  
  do {
    swapped = false;
    for (let i = 0; i < n - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        // Swap elements
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
    }
  } while (swapped);
  
  return arr;
}`,
    realWorldExamples: [
      {
        title: "Educational Tools",
        description: "Bubble sort is widely used in educational settings to teach the basics of sorting algorithms due to its simplicity and ease of visualization.",
        industry: "Education"
      },
      {
        title: "Small Dataset Processing",
        description: "When working with very small datasets where efficiency isn't critical, bubble sort can be implemented with minimal code and resources.",
        industry: "Software Development"
      },
      {
        title: "Nearly Sorted Data",
        description: "In scenarios where data is already nearly sorted, bubble sort can be efficient as it has O(n) complexity in the best case.",
        industry: "Data Analysis"
      },
      {
        title: "Embedded Systems",
        description: "In memory-constrained environments, bubble sort's low space complexity (O(1)) makes it useful for sorting small arrays.",
        industry: "IoT & Embedded Systems"
      }
    ]
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'sorting',
    description: 'An efficient, divide-and-conquer sorting algorithm that selects a "pivot" element and partitions the array around the pivot.',
    icon: ArrowUpDown,
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(log n)',
    pseudocode: [
      'function quicksort(A, lo, hi)',
      '    if lo < hi then',
      '        p := partition(A, lo, hi)',
      '        quicksort(A, lo, p - 1)',
      '        quicksort(A, p + 1, hi)',
      '',
      'function partition(A, lo, hi)',
      '    pivot := A[hi]',
      '    i := lo',
      '    for j := lo to hi do',
      '        if A[j] < pivot then',
      '            swap A[i] with A[j]',
      '            i := i + 1',
      '    swap A[i] with A[hi]',
      '    return i'
    ],
    implementation: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
    realWorldExamples: [
      {
        title: "Database Systems",
        description: "Quick sort is often used in database systems for sorting records and optimizing queries due to its efficient average-case performance.",
        industry: "Database Management"
      },
      {
        title: "Programming Languages",
        description: "Many programming language standard libraries implement quick sort as their default sorting algorithm (or variants like introsort).",
        industry: "Software Development"
      },
      {
        title: "Big Data Processing",
        description: "In distributed systems like Hadoop and Spark, variants of quick sort are used for sorting large datasets efficiently.",
        industry: "Big Data"
      },
      {
        title: "Computer Graphics",
        description: "Quick sort is used in rendering pipelines to sort objects by depth for correct rendering order (z-buffering).",
        industry: "Graphics & Gaming"
      }
    ]
  }
];
