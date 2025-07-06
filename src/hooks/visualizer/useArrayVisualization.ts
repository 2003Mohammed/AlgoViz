import { useState, useCallback } from 'react';
import { ArrayItem, VisualizationStep } from '../../types/visualizer';
import { toast } from '../use-toast';

export function useArrayVisualization() {
  const [array, setArray] = useState<ArrayItem[]>([
    { value: 64, status: 'default' },
    { value: 34, status: 'default' },
    { value: 25, status: 'default' },
    { value: 12, status: 'default' },
    { value: 22, status: 'default' },
    { value: 11, status: 'default' },
    { value: 90, status: 'default' }
  ]);
  const [steps, setSteps] = useState<VisualizationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const generateRandomArray = useCallback(() => {
    const size = 6 + Math.floor(Math.random() * 6); // 6-12 elements
    const newArray = Array.from({ length: size }, () => ({
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
    const newArray = [...array];
    const insertIndex = index !== undefined ? Math.max(0, Math.min(index, array.length)) : array.length;
    
    const newItem = { value, status: 'added' as const };
    newArray.splice(insertIndex, 0, newItem);
    
    const animationSteps: VisualizationStep[] = [
      {
        array: [...array],
        lineIndex: 0,
        description: `Inserting ${value} at index ${insertIndex}`
      },
      {
        array: newArray,
        lineIndex: 1,
        description: `Element ${value} inserted successfully`
      },
      {
        array: newArray.map(item => ({ ...item, status: 'default' as const })),
        lineIndex: 2,
        description: `Operation completed`
      }
    ];
    
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
        description: "Index out of bounds",
        variant: "destructive"
      });
      return;
    }
    
    const deletedValue = array[index].value;
    const highlightArray = array.map((item, i) => ({
      ...item,
      status: i === index ? 'removing' as const : 'default' as const
    }));
    
    const newArray = array.filter((_, i) => i !== index);
    
    const animationSteps: VisualizationStep[] = [
      {
        array: highlightArray,
        lineIndex: 0,
        description: `Removing element at index ${index}: ${deletedValue}`
      },
      {
        array: newArray,
        lineIndex: 1,
        description: `Element ${deletedValue} removed successfully`
      }
    ];
    
    setSteps(animationSteps);
    setCurrentStep(0);
    setIsAnimating(true);
    
    toast({
      title: "Element deleted",
      description: `Removed ${deletedValue} from index ${index}`
    });
  }, [array]);

  const searchElement = useCallback((value: number) => {
    const animationSteps: VisualizationStep[] = [
      {
        array: [...array],
        lineIndex: 0,
        description: `Searching for ${value} in array`
      }
    ];
    
    let found = false;
    for (let i = 0; i < array.length; i++) {
      const searchArray = array.map((item, index) => ({
        ...item,
        status: index === i ? 'comparing' as const : 
               index < i ? 'visited' as const : 'default' as const
      }));
      
      animationSteps.push({
        array: searchArray,
        lineIndex: i + 1,
        description: `Checking index ${i}: ${array[i].value}`
      });
      
      if (array[i].value === value) {
        const foundArray = array.map((item, index) => ({
          ...item,
          status: index === i ? 'found' as const : 'default' as const
        }));
        
        animationSteps.push({
          array: foundArray,
          lineIndex: i + 2,
          description: `Found ${value} at index ${i}!`
        });
        found = true;
        break;
      }
    }
    
    if (!found) {
      animationSteps.push({
        array: array.map(item => ({ ...item, status: 'visited' as const })),
        lineIndex: animationSteps.length,
        description: `${value} not found in array`
      });
    }
    
    setSteps(animationSteps);
    setCurrentStep(0);
    setIsAnimating(true);
    
    toast({
      title: "Search completed",
      description: found ? `Found ${value}` : `${value} not found`
    });
  }, [array]);

  const bubbleSort = useCallback(() => {
    const sortArray = [...array];
    const animationSteps: VisualizationStep[] = [
      {
        array: [...sortArray],
        lineIndex: 0,
        description: "Starting Bubble Sort"
      }
    ];
    
    for (let i = 0; i < sortArray.length - 1; i++) {
      for (let j = 0; j < sortArray.length - i - 1; j++) {
        // Highlight comparing elements
        const compareArray = sortArray.map((item, index) => ({
          ...item,
          status: index === j || index === j + 1 ? 'comparing' as const : 
                 index >= sortArray.length - i ? 'sorted' as const : 'default' as const
        }));
        
        animationSteps.push({
          array: [...compareArray],
          lineIndex: animationSteps.length,
          description: `Comparing ${sortArray[j].value} and ${sortArray[j + 1].value}`
        });
        
        if (sortArray[j].value > sortArray[j + 1].value) {
          // Highlight swapping
          const swapArray = sortArray.map((item, index) => ({
            ...item,
            status: index === j || index === j + 1 ? 'swapping' as const : 
                   index >= sortArray.length - i ? 'sorted' as const : 'default' as const
          }));
          
          animationSteps.push({
            array: [...swapArray],
            lineIndex: animationSteps.length,
            description: `Swapping ${sortArray[j].value} and ${sortArray[j + 1].value}`
          });
          
          // Perform swap
          [sortArray[j], sortArray[j + 1]] = [sortArray[j + 1], sortArray[j]];
          
          animationSteps.push({
            array: sortArray.map((item, index) => ({
              ...item,
              status: index >= sortArray.length - i ? 'sorted' as const : 'default' as const
            })),
            lineIndex: animationSteps.length,
            description: `Swapped successfully`
          });
        }
      }
      
      // Mark element as sorted
      const sortedArray = sortArray.map((item, index) => ({
        ...item,
        status: index >= sortArray.length - i - 1 ? 'sorted' as const : 'default' as const
      }));
      
      animationSteps.push({
        array: [...sortedArray],
        lineIndex: animationSteps.length,
        description: `Position ${sortArray.length - i - 1} is now sorted`
      });
    }
    
    // Mark all as sorted
    const finalArray = sortArray.map(item => ({ ...item, status: 'sorted' as const }));
    animationSteps.push({
      array: finalArray,
      lineIndex: animationSteps.length,
      description: "Bubble Sort completed!"
    });
    
    setSteps(animationSteps);
    setCurrentStep(0);
    setIsAnimating(true);
    
    toast({
      title: "Bubble Sort started",
      description: "Sorting algorithm visualization in progress"
    });
  }, [array]);

  const selectionSort = useCallback(() => {
    const sortArray = [...array];
    const animationSteps: VisualizationStep[] = [
      {
        array: [...sortArray],
        lineIndex: 0,
        description: "Starting Selection Sort"
      }
    ];
    
    for (let i = 0; i < sortArray.length - 1; i++) {
      let minIndex = i;
      
      // Find minimum element
      for (let j = i + 1; j < sortArray.length; j++) {
        const compareArray = sortArray.map((item, index) => ({
          ...item,
          status: index < i ? 'sorted' as const :
                 index === minIndex ? 'current' as const :
                 index === j ? 'comparing' as const : 'default' as const
        }));
        
        animationSteps.push({
          array: [...compareArray],
          lineIndex: animationSteps.length,
          description: `Comparing ${sortArray[j].value} with current minimum ${sortArray[minIndex].value}`
        });
        
        if (sortArray[j].value < sortArray[minIndex].value) {
          minIndex = j;
        }
      }
      
      // Swap if needed
      if (minIndex !== i) {
        const swapArray = sortArray.map((item, index) => ({
          ...item,
          status: index === i || index === minIndex ? 'swapping' as const :
                 index < i ? 'sorted' as const : 'default' as const
        }));
        
        animationSteps.push({
          array: [...swapArray],
          lineIndex: animationSteps.length,
          description: `Swapping ${sortArray[i].value} with ${sortArray[minIndex].value}`
        });
        
        [sortArray[i], sortArray[minIndex]] = [sortArray[minIndex], sortArray[i]];
      }
      
      // Mark as sorted
      const sortedArray = sortArray.map((item, index) => ({
        ...item,
        status: index <= i ? 'sorted' as const : 'default' as const
      }));
      
      animationSteps.push({
        array: [...sortedArray],
        lineIndex: animationSteps.length,
        description: `Position ${i} is now sorted`
      });
    }
    
    // Mark all as sorted
    const finalArray = sortArray.map(item => ({ ...item, status: 'sorted' as const }));
    animationSteps.push({
      array: finalArray,
      lineIndex: animationSteps.length,
      description: "Selection Sort completed!"
    });
    
    setSteps(animationSteps);
    setCurrentStep(0);
    setIsAnimating(true);
    
    toast({
      title: "Selection Sort started",
      description: "Sorting algorithm visualization in progress"
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
