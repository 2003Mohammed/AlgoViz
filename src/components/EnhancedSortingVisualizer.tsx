import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { motion } from 'framer-motion';

interface SortingVisualizerProps {
  algorithm: 'bubble' | 'merge' | 'quick' | 'selection' | 'insertion';
  title: string;
}

interface ArrayItem {
  value: number;
  status: 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'current';
  id: string;
}

interface SortingStep {
  array: ArrayItem[];
  description: string;
  comparingIndices?: number[];
  swappingIndices?: number[];
  pivotIndex?: number;
}

export const EnhancedSortingVisualizer: React.FC<SortingVisualizerProps> = ({ algorithm, title }) => {
  const [array, setArray] = useState<ArrayItem[]>([]);
  const [steps, setSteps] = useState<SortingStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    generateRandomArray();
  }, []);

  const generateRandomArray = () => {
    const size = 8 + Math.floor(Math.random() * 5); // 8-12 elements
    const newArray = Array.from({ length: size }, (_, i) => ({
      value: Math.floor(Math.random() * 90) + 10,
      status: 'default' as const,
      id: `item-${i}-${Date.now()}`
    }));
    setArray(newArray);
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const generateSortingSteps = () => {
    const arrayCopy = [...array];
    const newSteps: SortingStep[] = [];

    switch (algorithm) {
      case 'bubble':
        bubbleSort(arrayCopy, newSteps);
        break;
      case 'merge':
        mergeSort(arrayCopy, 0, arrayCopy.length - 1, newSteps);
        break;
      case 'quick':
        quickSort(arrayCopy, 0, arrayCopy.length - 1, newSteps);
        break;
      case 'selection':
        selectionSort(arrayCopy, newSteps);
        break;
      case 'insertion':
        insertionSort(arrayCopy, newSteps);
        break;
    }

    // Final step with all elements sorted
    newSteps.push({
      array: arrayCopy.map(item => ({ ...item, status: 'sorted' as const })),
      description: 'Sorting complete! All elements are now in order.'
    });

    setSteps(newSteps);
    setCurrentStep(0);
  };

  // Bubble Sort Implementation
  const bubbleSort = (arr: ArrayItem[], steps: SortingStep[]) => {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Comparing
        arr[j].status = 'comparing';
        arr[j + 1].status = 'comparing';
        steps.push({
          array: [...arr],
          description: `Comparing ${arr[j].value} and ${arr[j + 1].value}`,
          comparingIndices: [j, j + 1]
        });

        if (arr[j].value > arr[j + 1].value) {
          // Swapping
          arr[j].status = 'swapping';
          arr[j + 1].status = 'swapping';
          steps.push({
            array: [...arr],
            description: `Swapping ${arr[j].value} and ${arr[j + 1].value}`,
            swappingIndices: [j, j + 1]
          });

          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }

        // Reset status
        arr[j].status = 'default';
        arr[j + 1].status = 'default';
      }
      // Mark as sorted
      arr[n - 1 - i].status = 'sorted';
      steps.push({
        array: [...arr],
        description: `Element ${arr[n - 1 - i].value} is now in its final position`
      });
    }
  };

  // Quick Sort Implementation
  const quickSort = (arr: ArrayItem[], low: number, high: number, steps: SortingStep[]) => {
    if (low < high) {
      const pivotIndex = partition(arr, low, high, steps);
      quickSort(arr, low, pivotIndex - 1, steps);
      quickSort(arr, pivotIndex + 1, high, steps);
    }
  };

  const partition = (arr: ArrayItem[], low: number, high: number, steps: SortingStep[]): number => {
    const pivot = arr[high];
    pivot.status = 'pivot';
    steps.push({
      array: [...arr],
      description: `Choosing ${pivot.value} as pivot`,
      pivotIndex: high
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      arr[j].status = 'comparing';
      steps.push({
        array: [...arr],
        description: `Comparing ${arr[j].value} with pivot ${pivot.value}`,
        comparingIndices: [j, high]
      });

      if (arr[j].value < pivot.value) {
        i++;
        if (i !== j) {
          arr[i].status = 'swapping';
          arr[j].status = 'swapping';
          steps.push({
            array: [...arr],
            description: `Moving ${arr[j].value} to left partition`,
            swappingIndices: [i, j]
          });
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
      }
      arr[j].status = 'default';
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    arr[i + 1].status = 'sorted';
    steps.push({
      array: [...arr],
      description: `Pivot ${arr[i + 1].value} placed in correct position`
    });

    return i + 1;
  };

  // Selection Sort Implementation
  const selectionSort = (arr: ArrayItem[], steps: SortingStep[]) => {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;
      arr[minIndex].status = 'current';
      
      for (let j = i + 1; j < n; j++) {
        arr[j].status = 'comparing';
        steps.push({
          array: [...arr],
          description: `Finding minimum in unsorted portion. Comparing ${arr[j].value} with current min ${arr[minIndex].value}`,
          comparingIndices: [j, minIndex]
        });
        
        if (arr[j].value < arr[minIndex].value) {
          arr[minIndex].status = 'default';
          minIndex = j;
          arr[minIndex].status = 'current';
        } else {
          arr[j].status = 'default';
        }
      }
      
      if (minIndex !== i) {
        arr[i].status = 'swapping';
        arr[minIndex].status = 'swapping';
        steps.push({
          array: [...arr],
          description: `Swapping ${arr[i].value} and ${arr[minIndex].value}`,
          swappingIndices: [i, minIndex]
        });
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      }
      
      arr[i].status = 'sorted';
      steps.push({
        array: [...arr],
        description: `Element ${arr[i].value} is now sorted`
      });
    }
  };

  // Insertion Sort Implementation
  const insertionSort = (arr: ArrayItem[], steps: SortingStep[]) => {
    for (let i = 1; i < arr.length; i++) {
      const key = arr[i];
      key.status = 'current';
      let j = i - 1;
      
      steps.push({
        array: [...arr],
        description: `Inserting ${key.value} into sorted portion`
      });
      
      while (j >= 0 && arr[j].value > key.value) {
        arr[j].status = 'comparing';
        arr[j + 1].status = 'comparing';
        steps.push({
          array: [...arr],
          description: `Moving ${arr[j].value} one position right`,
          comparingIndices: [j, j + 1]
        });
        
        arr[j + 1] = arr[j];
        arr[j].status = 'default';
        j--;
      }
      
      arr[j + 1] = key;
      arr[j + 1].status = 'sorted';
      
      // Mark all elements up to i as sorted
      for (let k = 0; k <= i; k++) {
        if (arr[k].status !== 'sorted') arr[k].status = 'sorted';
      }
      
      steps.push({
        array: [...arr],
        description: `${key.value} inserted at correct position`
      });
    }
  };

  // Merge Sort Implementation (simplified for visualization)
  const mergeSort = (arr: ArrayItem[], left: number, right: number, steps: SortingStep[]) => {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      mergeSort(arr, left, mid, steps);
      mergeSort(arr, mid + 1, right, steps);
      merge(arr, left, mid, right, steps);
    }
  };

  const merge = (arr: ArrayItem[], left: number, mid: number, right: number, steps: SortingStep[]) => {
    const leftArray = arr.slice(left, mid + 1);
    const rightArray = arr.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;
    
    while (i < leftArray.length && j < rightArray.length) {
      if (leftArray[i].value <= rightArray[j].value) {
        arr[k] = leftArray[i];
        arr[k].status = 'sorted';
        i++;
      } else {
        arr[k] = rightArray[j];
        arr[k].status = 'sorted';
        j++;
      }
      k++;
      
      steps.push({
        array: [...arr],
        description: `Merging subarrays: placing ${arr[k-1].value} in position`
      });
    }
    
    while (i < leftArray.length) {
      arr[k] = leftArray[i];
      arr[k].status = 'sorted';
      i++;
      k++;
    }
    
    while (j < rightArray.length) {
      arr[k] = rightArray[j];
      arr[k].status = 'sorted';
      j++;
      k++;
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } else {
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
  };

  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const getBarColor = (status: ArrayItem['status']) => {
    switch (status) {
      case 'comparing': return 'bg-yellow-500'; // Yellow for comparison
      case 'swapping': return 'bg-orange-500'; // Orange for swapping
      case 'sorted': return 'bg-green-500'; // Green for sorted
      case 'pivot': return 'bg-purple-500'; // Purple for pivot
      case 'current': return 'bg-blue-500'; // Blue for current/final
      default: return 'bg-primary';
    }
  };

  const getLearnMoreLinks = () => {
    const algorithmName = algorithm.charAt(0).toUpperCase() + algorithm.slice(1);
    return {
      geeksforgeeks: `https://www.geeksforgeeks.org/${algorithm}-sort/`,
      w3schools: `https://www.w3schools.com/algorithms/${
        algorithm === 'bubble' ? 'bubble_sort' :
        algorithm === 'selection' ? 'selection_sort' :
        algorithm === 'insertion' ? 'insertion_sort' :
        algorithm === 'merge' ? 'merge_sort' :
        'quick_sort'
      }.asp`
    };
  };

  const currentArray = steps.length > 0 ? steps[currentStep]?.array || array : array;
  const currentDescription = steps.length > 0 ? steps[currentStep]?.description || '' : '';
  const links = getLearnMoreLinks();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold pixel-text">{title}</CardTitle>
        <div className="flex flex-wrap gap-2 justify-center">
          <Button onClick={generateRandomArray} variant="outline">
            Generate New Array
          </Button>
          <Button onClick={generateSortingSteps} variant="default" disabled={steps.length > 0}>
            Start Sorting
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Array Visualization */}
        <div className="flex items-end justify-center gap-2 h-64 bg-muted/30 rounded-lg p-4">
          {currentArray.map((item, index) => (
            <motion.div
              key={item.id}
              className={`${getBarColor(item.status)} rounded-t flex items-end justify-center text-white font-bold text-sm transition-all duration-300`}
              style={{
                height: `${item.value * 2}px`,
                width: '40px',
                minHeight: '20px'
              }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {item.value}
            </motion.div>
          ))}
        </div>

        {/* Description */}
        {currentDescription && (
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">{currentDescription}</p>
          </div>
        )}

        {/* Controls */}
        {steps.length > 0 && (
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" size="sm" onClick={stepBackward} disabled={currentStep <= 0}>
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="sm" onClick={togglePlayPause}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button variant="outline" size="sm" onClick={stepForward} disabled={currentStep >= steps.length - 1}>
              <SkipForward className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <span className="text-sm text-muted-foreground">
              {currentStep + 1} / {steps.length}
            </span>
          </div>
        )}

        {/* Color Legend */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Comparing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span>Swapping</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span>Pivot</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Sorted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Final Result</span>
          </div>
        </div>

        {/* Learning Resources */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Button variant="ghost" size="sm" asChild>
            <a href={links.geeksforgeeks} target="_blank" rel="noopener noreferrer">
              📚 GeeksforGeeks
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href={links.w3schools} target="_blank" rel="noopener noreferrer">
              📖 W3Schools
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};