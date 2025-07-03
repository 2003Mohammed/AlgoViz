
import { useState, useCallback } from 'react';
import { ArrayItem, VisualizationStep } from '../../types/visualizer';
import { toast } from '../use-toast';

export function useBinarySearch() {
  const [array, setArray] = useState<ArrayItem[]>([
    { value: 1, status: 'default' },
    { value: 3, status: 'default' },
    { value: 5, status: 'default' },
    { value: 7, status: 'default' },
    { value: 9, status: 'default' },
    { value: 11, status: 'default' },
    { value: 13, status: 'default' },
    { value: 15, status: 'default' }
  ]);
  const [steps, setSteps] = useState<VisualizationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const generateSortedArray = useCallback(() => {
    const size = 8 + Math.floor(Math.random() * 5); // 8-12 elements
    const newArray = Array.from({ length: size }, (_, i) => ({
      value: (i + 1) * 2 + Math.floor(Math.random() * 3),
      status: 'default' as const
    })).sort((a, b) => a.value - b.value);
    
    setArray(newArray);
    setSteps([]);
    setCurrentStep(0);
    setIsAnimating(false);
    
    toast({
      title: "New sorted array generated",
      description: `Generated array with ${newArray.length} elements`
    });
  }, []);

  const binarySearch = useCallback((target: number) => {
    const animationSteps: VisualizationStep[] = [];
    let left = 0;
    let right = array.length - 1;
    let found = false;

    // Initial state
    animationSteps.push({
      array: array.map((item, idx) => ({
        ...item,
        status: idx === left ? 'current' : idx === right ? 'current' : 'default'
      })),
      lineIndex: 0,
      description: `Binary search for ${target}. Initial range: [${left}, ${right}]`
    });

    while (left <= right && !found) {
      const mid = Math.floor((left + right) / 2);
      
      // Highlight the search range
      animationSteps.push({
        array: array.map((item, idx) => ({
          ...item,
          status: idx < left || idx > right ? 'visited' :
                 idx === left ? 'current' :
                 idx === right ? 'current' :
                 idx === mid ? 'comparing' : 'active'
        })),
        lineIndex: animationSteps.length,
        description: `Checking middle element at index ${mid}: ${array[mid].value}`
      });

      if (array[mid].value === target) {
        // Found the target
        animationSteps.push({
          array: array.map((item, idx) => ({
            ...item,
            status: idx === mid ? 'found' : 'default'
          })),
          lineIndex: animationSteps.length,
          description: `Found ${target} at index ${mid}!`
        });
        found = true;
      } else if (array[mid].value < target) {
        // Target is in right half
        animationSteps.push({
          array: array.map((item, idx) => ({
            ...item,
            status: idx <= mid ? 'visited' :
                   idx === right ? 'current' : 'active'
          })),
          lineIndex: animationSteps.length,
          description: `${array[mid].value} < ${target}. Search right half: [${mid + 1}, ${right}]`
        });
        left = mid + 1;
      } else {
        // Target is in left half
        animationSteps.push({
          array: array.map((item, idx) => ({
            ...item,
            status: idx >= mid ? 'visited' :
                   idx === left ? 'current' : 'active'
          })),
          lineIndex: animationSteps.length,
          description: `${array[mid].value} > ${target}. Search left half: [${left}, ${mid - 1}]`
        });
        right = mid - 1;
      }
    }

    if (!found) {
      animationSteps.push({
        array: array.map(item => ({ ...item, status: 'visited' })),
        lineIndex: animationSteps.length,
        description: `${target} not found in array`
      });
    }

    setSteps(animationSteps);
    setCurrentStep(0);
    setIsAnimating(true);
    
    toast({
      title: "Binary search started",
      description: `Searching for ${target} in sorted array`
    });
  }, [array]);

  return {
    array,
    steps,
    currentStep,
    isAnimating,
    setArray,
    setCurrentStep,
    setIsAnimating,
    generateSortedArray,
    binarySearch
  };
}
