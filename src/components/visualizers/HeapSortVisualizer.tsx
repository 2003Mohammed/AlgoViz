
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Play, Pause, SkipForward, RotateCcw, Shuffle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ArrayItem {
  value: number;
  status: 'default' | 'heapifying' | 'swapping' | 'sorted' | 'comparing' | 'root';
  index: number;
}

interface AnimationStep {
  array: ArrayItem[];
  heapSize?: number;
  comparingIndices?: number[];
  swappingIndices?: number[];
  description: string;
}

const HeapSortVisualizer: React.FC = () => {
  const [array, setArray] = useState<ArrayItem[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [currentDescription, setCurrentDescription] = useState('');
  const [heapSize, setHeapSize] = useState(0);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 8 }, (_, index) => ({
      value: Math.floor(Math.random() * 90) + 10,
      status: 'default' as const,
      index
    }));
    setArray(newArray);
    setHeapSize(newArray.length);
    reset();
  };

  const handleCustomInput = () => {
    try {
      const values = customInput.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
      if (values.length === 0) {
        alert('Please enter valid numbers separated by commas');
        return;
      }
      if (values.length > 12) {
        alert('Maximum 12 numbers allowed');
        return;
      }
      
      const newArray = values.map((value, index) => ({
        value,
        status: 'default' as const,
        index
      }));
      setArray(newArray);
      setHeapSize(newArray.length);
      setCustomInput('');
      reset();
    } catch (error) {
      alert('Invalid input format. Use comma-separated numbers.');
    }
  };

  const reset = () => {
    setArray(prev => prev.map(item => ({ ...item, status: 'default' })));
    setAnimationSteps([]);
    setCurrentStep(0);
    setCurrentDescription('');
    setIsAnimating(false);
    setIsPaused(false);
    setHeapSize(array.length);
  };

  const generateHeapSortSteps = () => {
    if (array.length === 0) {
      alert('Please generate or input an array first');
      return;
    }

    const steps: AnimationStep[] = [];
    const arr = [...array];
    const n = arr.length;
    let currentHeapSize = n;
    
    steps.push({
      array: [...arr],
      heapSize: currentHeapSize,
      description: 'Starting Heap Sort. First, we will build a max heap from the array.'
    });

    const heapify = (heapSize: number, i: number) => {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      
      // Mark current node being processed
      arr[i].status = 'heapifying';
      if (left < heapSize) arr[left].status = 'comparing';
      if (right < heapSize) arr[right].status = 'comparing';
      
      steps.push({
        array: [...arr],
        heapSize: currentHeapSize,
        comparingIndices: [i, left, right].filter(idx => idx < heapSize),
        description: `Heapifying at index ${i} (value ${arr[i].value}). Comparing with children.`
      });
      
      if (left < heapSize && arr[left].value > arr[largest].value) {
        largest = left;
      }
      
      if (right < heapSize && arr[right].value > arr[largest].value) {
        largest = right;
      }
      
      if (largest !== i) {
        // Show swap
        arr[i].status = 'swapping';
        arr[largest].status = 'swapping';
        
        steps.push({
          array: [...arr],
          heapSize: currentHeapSize,
          swappingIndices: [i, largest],
          description: `Swapping ${arr[i].value} with ${arr[largest].value} to maintain max heap property.`
        });
        
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        
        steps.push({
          array: [...arr],
          heapSize: currentHeapSize,
          description: `Swapped values. Continue heapifying at index ${largest}.`
        });
        
        // Reset statuses
        for (let k = 0; k < arr.length; k++) {
          if (arr[k].status !== 'sorted') {
            arr[k].status = 'default';
          }
        }
        
        heapify(heapSize, largest);
      } else {
        // Reset statuses
        for (let k = 0; k < arr.length; k++) {
          if (arr[k].status !== 'sorted') {
            arr[k].status = 'default';
          }
        }
      }
    };
    
    // Build heap (rearrange array)
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(n, i);
    }
    
    steps.push({
      array: [...arr],
      heapSize: currentHeapSize,
      description: 'Max heap constructed! Now extracting maximum elements one by one.'
    });
    
    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
      // Move current root to end (it's the maximum)
      arr[0].status = 'root';
      arr[i].status = 'swapping';
      
      steps.push({
        array: [...arr],
        heapSize: currentHeapSize,
        swappingIndices: [0, i],
        description: `Moving maximum element ${arr[0].value} to its correct position at index ${i}.`
      });
      
      [arr[0], arr[i]] = [arr[i], arr[0]];
      
      // Mark as sorted
      arr[i].status = 'sorted';
      currentHeapSize = i;
      
      steps.push({
        array: [...arr],
        heapSize: currentHeapSize,
        description: `Element ${arr[i].value} is now in its correct position. Heap size reduced to ${currentHeapSize}.`
      });
      
      // Reset root status
      arr[0].status = 'default';
      
      // Heapify the reduced heap
      heapify(i, 0);
    }
    
    // Mark first element as sorted
    arr[0].status = 'sorted';
    
    steps.push({
      array: [...arr],
      heapSize: 0,
      description: 'Heap Sort completed! All elements are now in sorted order.'
    });

    setAnimationSteps(steps);
    setCurrentStep(0);
    setIsAnimating(true);
    setIsPaused(false);
  };

  const togglePlayPause = () => {
    if (animationSteps.length === 0) {
      generateHeapSortSteps();
    } else {
      setIsAnimating(!isAnimating);
      setIsPaused(!isPaused);
    }
  };

  const stepForward = () => {
    if (currentStep < animationSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  useEffect(() => {
    if (isAnimating && !isPaused && animationSteps.length > 0) {
      if (currentStep < animationSteps.length - 1) {
        animationRef.current = setTimeout(() => {
          setCurrentStep(currentStep + 1);
        }, 1800);
      } else {
        setIsAnimating(false);
      }
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isAnimating, isPaused, currentStep, animationSteps]);

  useEffect(() => {
    if (animationSteps.length > 0 && currentStep < animationSteps.length) {
      const step = animationSteps[currentStep];
      setCurrentDescription(step.description);
      setArray(step.array);
      setHeapSize(step.heapSize || 0);
    }
  }, [currentStep, animationSteps]);

  useEffect(() => {
    generateRandomArray();
  }, []);

  const getBarColor = (status: ArrayItem['status'], index: number) => {
    if (index >= heapSize && status !== 'sorted') return 'bg-gray-300';
    
    switch (status) {
      case 'root': return 'bg-purple-500';
      case 'heapifying': return 'bg-blue-500';
      case 'comparing': return 'bg-yellow-500';
      case 'swapping': return 'bg-orange-500';
      case 'sorted': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Heap Sort Visualization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="flex gap-4 items-center justify-center flex-wrap">
            <Button onClick={generateRandomArray} variant="outline" size="sm">
              <Shuffle className="h-4 w-4 mr-2" />
              Random Array
            </Button>
            <Button onClick={togglePlayPause} size="sm">
              {isAnimating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isAnimating ? 'Pause' : 'Start Sort'}
            </Button>
            <Button onClick={stepForward} disabled={currentStep >= animationSteps.length - 1} size="sm">
              <SkipForward className="h-4 w-4 mr-2" />
              Step
            </Button>
            <Button onClick={reset} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Custom Input */}
          <div className="flex gap-2 items-center justify-center">
            <Input
              placeholder="Enter numbers (e.g., 64,34,25,12,22,11)"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="max-w-md"
            />
            <Button onClick={handleCustomInput} variant="outline" size="sm">
              Set Array
            </Button>
          </div>

          {/* Color Legend */}
          <div className="bg-muted/20 p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Color Legend:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400"></div>
                <span>In Heap</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500"></div>
                <span>Root</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500"></div>
                <span>Heapifying</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500"></div>
                <span>Comparing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500"></div>
                <span>Swapping</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500"></div>
                <span>Sorted</span>
              </div>
            </div>
          </div>

          {/* Heap Size Display */}
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-center">
            <strong className="text-purple-700">Current Heap Size:</strong>
            <span className="ml-2 text-purple-600 font-mono text-lg">{heapSize}</span>
          </div>

          {/* Step Description */}
          {currentDescription && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
              <strong>Step:</strong> {currentDescription}
            </div>
          )}

          {/* Array Visualization */}
          <div className="bg-muted/20 p-6 rounded-lg">
            <div className="flex items-end justify-center gap-1 min-h-[200px]">
              {array.map((item, index) => (
                <motion.div
                  key={`${item.value}-${index}`}
                  className={`flex flex-col items-center gap-2 ${getBarColor(item.status, index)} text-white p-2 rounded-t transition-colors duration-300`}
                  style={{ height: `${Math.max(item.value * 2, 40)}px`, minWidth: '40px' }}
                  animate={{ 
                    scale: item.status === 'comparing' || item.status === 'swapping' || item.status === 'heapifying' ? 1.1 : 1,
                    y: item.status === 'swapping' ? -8 : item.status === 'root' ? -5 : 0
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="text-xs font-bold">{item.value}</span>
                  <span className="text-xs opacity-70">{index}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div className="text-center text-sm text-muted-foreground">
            Step {currentStep + 1} of {animationSteps.length || 1}
          </div>
        </CardContent>
      </Card>

      {/* Educational Content */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Algorithm Complexity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Time Complexity:</span>
                <span className="font-mono">O(n log n)</span>
              </div>
              <div className="flex justify-between">
                <span>Space Complexity:</span>
                <span className="font-mono">O(1)</span>
              </div>
              <div className="flex justify-between">
                <span>Stability:</span>
                <span>Not Stable</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              <li>• Uses binary heap data structure</li>
              <li>• In-place sorting algorithm</li>
              <li>• Consistent O(n log n) performance</li>
              <li>• Not stable (relative order may change)</li>
              <li>• Used in priority queues and scheduling</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HeapSortVisualizer;
