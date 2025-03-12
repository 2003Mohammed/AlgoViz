
import { ArrowUpDown, Split } from 'lucide-react';
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
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'sorting',
    description: 'A divide and conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves.',
    icon: Split,
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)'
    },
    spaceComplexity: 'O(n)',
    pseudocode: [
      'function mergeSort(arr, left, right)',
      '    if left < right then',
      '        mid = floor((left + right) / 2)',
      '        mergeSort(arr, left, mid)',
      '        mergeSort(arr, mid + 1, right)',
      '        merge(arr, left, mid, right)',
      '',
      'function merge(arr, left, mid, right)',
      '    n1 = mid - left + 1',
      '    n2 = right - mid',
      '    create leftArray[n1] and rightArray[n2]',
      '    for i = 0 to n1-1',
      '        leftArray[i] = arr[left + i]',
      '    for j = 0 to n2-1',
      '        rightArray[j] = arr[mid + 1 + j]',
      '    i = 0, j = 0, k = left',
      '    while i < n1 and j < n2',
      '        if leftArray[i] <= rightArray[j]',
      '            arr[k] = leftArray[i]',
      '            i = i + 1',
      '        else',
      '            arr[k] = rightArray[j]',
      '            j = j + 1',
      '        k = k + 1',
      '    copy remaining elements of leftArray',
      '    copy remaining elements of rightArray'
    ],
    implementation: `function mergeSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const mid = Math.floor((left + right) / 2);
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
  }
  return arr;
}

function merge(arr, left, mid, right) {
  const n1 = mid - left + 1;
  const n2 = right - mid;
  
  // Create temp arrays
  const leftArray = new Array(n1);
  const rightArray = new Array(n2);
  
  // Copy data to temp arrays
  for (let i = 0; i < n1; i++) {
    leftArray[i] = arr[left + i];
  }
  for (let j = 0; j < n2; j++) {
    rightArray[j] = arr[mid + 1 + j];
  }
  
  // Merge the temp arrays back into arr
  let i = 0;
  let j = 0;
  let k = left;
  
  while (i < n1 && j < n2) {
    if (leftArray[i] <= rightArray[j]) {
      arr[k] = leftArray[i];
      i++;
    } else {
      arr[k] = rightArray[j];
      j++;
    }
    k++;
  }
  
  // Copy the remaining elements of leftArray
  while (i < n1) {
    arr[k] = leftArray[i];
    i++;
    k++;
  }
  
  // Copy the remaining elements of rightArray
  while (j < n2) {
    arr[k] = rightArray[j];
    j++;
    k++;
  }
}`,
    realWorldExamples: [
      {
        title: "External Sorting",
        description: "Merge sort is commonly used for external sorting, where data doesn't fit in memory and needs to be sorted across multiple files or devices.",
        industry: "Database Systems"
      },
      {
        title: "Inversion Count Problems",
        description: "Merge sort can be adapted to count inversions in an array, which is useful in computational biology and data analysis.",
        industry: "Data Science"
      },
      {
        title: "Linked List Sorting",
        description: "Merge sort is often preferred for sorting linked lists due to its sequential access pattern that doesn't require random access.",
        industry: "Software Engineering"
      },
      {
        title: "Stable Sorting Applications",
        description: "When stability (maintaining original order of equal elements) is required, merge sort is preferred in financial applications and record sorting.",
        industry: "Finance & Banking"
      }
    ]
  }
];
