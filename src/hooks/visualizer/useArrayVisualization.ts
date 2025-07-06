
import { useState, useCallback } from 'react';
import { ArrayItem, VisualizationStep } from '../../types/visualizer';
import { toast } from '../use-toast';

export function useArrayVisualization() {
  const [array, setArray] = useState<ArrayItem[]>([
    { value: 5, status: 'default' },
    { value: 3, status: 'default' },
    { value: 8, status: 'default' },
    { value: 1, status: 'default' },
    { value: 9, status: 'default' }
  ]);
  const [steps, setSteps] = useState<VisualizationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const generateRandomArray = useCallback(() => {
    const newArray = Array.from({ length: 8 }, () => ({
      value: Math.floor(Math.random() * 100) + 1,
      status: 'default' as const
    }));
    setArray(newArray);
    setSteps([]);
    setCurrentStep(0);
    setIsAnimating(false);
    toast({
      title: "New array generated",
      description: `Generated array with ${newArray.length} elements`
    });
  }, []);

  const insertElement = useCallback((value: number, index?: number) => {
    const insertIndex = index !== undefined ? index : array.length;
    
    if (insertIndex < 0 || insertIndex > array.length) {
      toast({
        title: "Invalid index",
        description: `Index must be between 0 and ${array.length}`,
        variant: "destructive"
      });
      return;
    }

    const animationSteps: VisualizationStep[] = [];
    
    // Step 1: Highlight insertion point
    animationSteps.push({
      array: array.map((item, i) => ({
        ...item,
        status: i === insertIndex ? 'current' : 'default'
      })),
      lineIndex: 0,
      description: `Inserting ${value} at index ${insertIndex}`
    });

    // Step 2: Shift elements and insert
    const newArray = [...array];
    newArray.splice(insertIndex, 0, { value, status: 'added' });
    
    animationSteps.push({
      array: newArray,
      lineIndex: 1,
      description: `Element ${value} inserted successfully`
    });

    // Step 3: Reset statuses
    animationSteps.push({
      array: newArray.map(item => ({ ...item, status: 'default' })),
      lineIndex: 2,
      description: 'Insertion complete'
    });

    setSteps(animationSteps);
    setCurrentStep(0);
    setIsAnimating(true);
    
    toast({
      title: "Element inserted",
      description: `Added ${value} at index ${insertIndex}`
    });
  }, [array]);

  const deleteElement = useCallback((index: number) => {
    if (index < 0 || index >= array.length) {
      toast({
        title: "Invalid index",
        description: `Index must be between 0 and ${array.length - 1}`,
        variant: "destructive"
      });
      return;
    }

    const animationSteps: VisualizationStep[] = [];
    const elementToDelete = array[index].value;
    
    // Step 1: Highlight element to delete
    animationSteps.push({
      array: array.map((item, i) => ({
        ...item,
        status: i === index ? 'removing' : 'default'
      })),
      lineIndex: 0,
      description: `Removing element ${elementToDelete} at index ${index}`
    });

    // Step 2: Remove element
    const newArray = array.filter((_, i) => i !== index);
    
    animationSteps.push({
      array: newArray,
      lineIndex: 1,
      description: `Element ${elementToDelete} removed successfully`
    });

    setSteps(animationSteps);
    setCurrentStep(0);
    setIsAnimating(true);
    
    toast({
      title: "Element deleted",
      description: `Removed ${elementToDelete} from index ${index}`
    });
  }, [array]);

  const searchElement = useCallback((value: number) => {
    const animationSteps: VisualizationStep[] = [];
    
    for (let i = 0; i < array.length; i++) {
      // Step: Check current element
      animationSteps.push({
        array: array.map((item, idx) => ({
          ...item,
          status: idx === i ? 'comparing' : idx < i ? 'visited' : 'default'
        })),
        lineIndex: i,
        description: `Checking index ${i}: ${array[i].value} ${array[i].value === value ? '(FOUND!)' : ''}`
      });
      
      if (array[i].value === value) {
        // Found the element
        animationSteps.push({
          array: array.map((item, idx) => ({
            ...item,
            status: idx === i ? 'found' : 'default'
          })),
          lineIndex: i + 1,
          description: `Found ${value} at index ${i}!`
        });
        break;
      }
    }
    
    // If not found
    if (!array.some(item => item.value === value)) {
      animationSteps.push({
        array: array.map(item => ({ ...item, status: 'visited' })),
        lineIndex: array.length,
        description: `${value} not found in array`
      });
    }

    setSteps(animationSteps);
    setCurrentStep(0);
    setIsAnimating(true);
    
    toast({
      title: "Search started",
      description: `Searching for ${value} in array`
    });
  }, [array]);

  const bubbleSort = useCallback(() => {
    const animationSteps: VisualizationStep[] = [];
    const sortArray = [...array];
    
    for (let i = 0; i < sortArray.length - 1; i++) {
      for (let j = 0; j < sortArray.length - i - 1; j++) {
        // Compare elements
        animationSteps.push({
          array: sortArray.map((item, idx) => ({
            ...item,
            status: idx === j || idx === j + 1 ? 'comparing' : 
                   idx >= sortArray.length - i ? 'sorted' : 'default'
          })),
          lineIndex: animationSteps.length,
          description: `Comparing ${sortArray[j].value} and ${sortArray[j + 1].value}`
        });
        
        if (sortArray[j].value > sortArray[j + 1].value) {
          // Swap elements
          [sortArray[j], sortArray[j + 1]] = [sortArray[j + 1], sortArray[j]];
          
          animationSteps.push({
            array: sortArray.map((item, idx) => ({
              ...item,
              status: idx === j || idx === j + 1 ? 'swapping' : 
                     idx >= sortArray.length - i ? 'sorted' : 'default'
            })),
            lineIndex: animationSteps.length,
            description: `Swapped ${sortArray[j + 1].value} and ${sortArray[j].value}`
          });
        }
      }
      
      // Mark element as sorted
      animationSteps.push({
        array: sortArray.map((item, idx) => ({
          ...item,
          status: idx >= sortArray.length - i - 1 ? 'sorted' : 'default'
        })),
        lineIndex: animationSteps.length,
        description: `Position ${sortArray.length - i - 1} is now sorted`
      });
    }
    
    // Final step - all sorted
    animationSteps.push({
      array: sortArray.map(item => ({ ...item, status: 'sorted' })),
      lineIndex: animationSteps.length,
      description: 'Array is completely sorted!'
    });

    setSteps(animationSteps);
    setCurrentStep(0);
    setIsAnimating(true);
    
    toast({
      title: "Bubble sort started",
      description: "Watch the sorting animation"
    });
  }, [array]);

  const selectionSort = useCallback(() => {
    const animationSteps: VisualizationStep[] = [];
    const sortArray = [...array];
    
    for (let i = 0; i < sortArray.length - 1; i++) {
      let minIndex = i;
      
      // Find minimum element
      for (let j = i + 1; j < sortArray.length; j++) {
        animationSteps.push({
          array: sortArray.map((item, idx) => ({
            ...item,
            status: idx < i ? 'sorted' :
                   idx === minIndex ? 'current' :
                   idx === j ? 'comparing' : 'default'
          })),
          lineIndex: animationSteps.length,
          description: `Comparing minimum ${sortArray[minIndex].value} with ${sortArray[j].value}`
        });
        
        if (sortArray[j].value < sortArray[minIndex].value) {
          minIndex = j;
        }
      }
      
      // Swap if needed
      if (minIndex !== i) {
        [sortArray[i], sortArray[minIndex]] = [sortArray[minIndex], sortArray[i]];
        
        animationSteps.push({
          array: sortArray.map((item, idx) => ({
            ...item,
            status: idx === i || idx === minIndex ? 'swapping' : 
                   idx < i ? 'sorted' : 'default'
          })),
          lineIndex: animationSteps.length,
          description: `Swapped ${sortArray[i].value} with ${sortArray[minIndex].value}`
        });
      }
      
      // Mark as sorted
      animationSteps.push({
        array: sortArray.map((item, idx) => ({
          ...item,
          status: idx <= i ? 'sorted' : 'default'
        })),
        lineIndex: animationSteps.length,
        description: `Position ${i} is now sorted`
      });
    }
    
    // Final step
    animationSteps.push({
      array: sortArray.map(item => ({ ...item, status: 'sorted' })),
      lineIndex: animationSteps.length,
      description: 'Selection sort complete!'
    });

    setSteps(animationSteps);
    setCurrentStep(0);
    setIsAnimating(true);
    
    toast({
      title: "Selection sort started",
      description: "Watch the sorting animation"
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
    generateRandomArray,
    insertElement,
    deleteElement,
    searchElement,
    bubbleSort,
    selectionSort
  };
}
