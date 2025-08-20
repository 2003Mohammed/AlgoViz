
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Play, Pause, SkipForward, RotateCcw, Shuffle, ExternalLink, Gauge } from 'lucide-react';
import { motion } from 'framer-motion';
import { Slider } from '../ui/slider';

interface ArrayItem {
  value: number;
  status: 'default' | 'pivot' | 'comparing' | 'swapping' | 'sorted' | 'partitioned';
  index: number;
}

interface AnimationStep {
  array: ArrayItem[];
  pivotIndex?: number;
  comparingIndices?: number[];
  swappingIndices?: number[];
  partitionBoundary?: number;
  description: string;
}

const QuickSortVisualizer: React.FC = () => {
  const [array, setArray] = useState<ArrayItem[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [currentDescription, setCurrentDescription] = useState('');
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [animationSpeed, setAnimationSpeed] = useState([1.5]);

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 8 }, (_, index) => ({
      value: Math.floor(Math.random() * 90) + 10,
      status: 'default' as const,
      index
    }));
    setArray(newArray);
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
  };

  const generateQuickSortSteps = () => {
    if (array.length === 0) {
      alert('Please generate or input an array first');
      return;
    }

    const steps: AnimationStep[] = [];
    const arr = [...array];
    
    steps.push({
      array: [...arr],
      description: 'Starting Quick Sort. We will repeatedly select a pivot and partition the array.'
    });

    const quickSort = (low: number, high: number) => {
      if (low < high) {
        const pi = partition(low, high);
        quickSort(low, pi - 1);
        quickSort(pi + 1, high);
      }
    };

    const partition = (low: number, high: number): number => {
      const pivot = arr[high];
      let i = low - 1;
      
      // Mark pivot
      arr[high].status = 'pivot';
      steps.push({
        array: [...arr],
        pivotIndex: high,
        description: `Selected ${pivot.value} at index ${high} as pivot. Will partition array around this value.`
      });
      
      for (let j = low; j < high; j++) {
        // Mark current element being compared
        arr[j].status = 'comparing';
        steps.push({
          array: [...arr],
          pivotIndex: high,
          comparingIndices: [j],
          description: `Comparing ${arr[j].value} with pivot ${pivot.value}.`
        });
        
        if (arr[j].value < pivot.value) {
          i++;
          if (i !== j) {
            // Show swap
            arr[i].status = 'swapping';
            arr[j].status = 'swapping';
            steps.push({
              array: [...arr],
              pivotIndex: high,
              swappingIndices: [i, j],
              description: `${arr[j].value} < ${pivot.value}, swapping with ${arr[i].value} at index ${i}.`
            });
            
            [arr[i], arr[j]] = [arr[j], arr[i]];
            
            steps.push({
              array: [...arr],
              pivotIndex: high,
              description: `Swapped ${arr[j].value} and ${arr[i].value}.`
            });
          }
        }
        
        // Reset status
        arr[j].status = 'default';
        if (i >= 0) arr[i].status = 'partitioned';
      }
      
      // Place pivot in correct position
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      arr[i + 1].status = 'sorted';
      
      steps.push({
        array: [...arr],
        partitionBoundary: i + 1,
        description: `Placed pivot ${arr[i + 1].value} in its correct position at index ${i + 1}.`
      });
      
      // Reset statuses for next iteration
      for (let k = 0; k < arr.length; k++) {
        if (arr[k].status !== 'sorted') {
          arr[k].status = 'default';
        }
      }
      
      return i + 1;
    };

    quickSort(0, arr.length - 1);
    
    // Mark all as sorted
    arr.forEach(item => item.status = 'sorted');
    steps.push({
      array: [...arr],
      description: 'Quick Sort completed! All elements are now in sorted order.'
    });

    setAnimationSteps(steps);
    setCurrentStep(0);
    setIsAnimating(true);
    setIsPaused(false);
  };

  const togglePlayPause = () => {
    if (animationSteps.length === 0) {
      generateQuickSortSteps();
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
        }, animationSpeed[0] * 1000);
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
    }
  }, [currentStep, animationSteps]);

  useEffect(() => {
    generateRandomArray();
  }, []);

  const getBarColor = (status: ArrayItem['status']) => {
    switch (status) {
      case 'pivot': return 'bg-red-500';
      case 'comparing': return 'bg-yellow-500';
      case 'swapping': return 'bg-orange-500';
      case 'sorted': return 'bg-green-500';
      case 'partitioned': return 'bg-blue-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quick Sort Visualization</CardTitle>
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
                <span>Unsorted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500"></div>
                <span>Pivot</span>
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
                <div className="w-3 h-3 bg-blue-400"></div>
                <span>Partitioned</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500"></div>
                <span>Sorted</span>
              </div>
            </div>
          </div>

          {/* Speed Controller */}
          <div className="space-y-3 p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Animation Speed</span>
            </div>
            <div className="flex items-center gap-4">
              <Slider value={animationSpeed} onValueChange={setAnimationSpeed} min={0.5} max={3} step={0.1} className="flex-1" />
              <span className="text-sm text-muted-foreground min-w-[60px]">{animationSpeed[0]}s</span>
            </div>
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
                  className={`flex flex-col items-center gap-2 ${getBarColor(item.status)} text-white p-2 rounded-t transition-colors duration-300`}
                  style={{ height: `${Math.max(item.value * 2, 40)}px`, minWidth: '40px' }}
                  animate={{ 
                    scale: item.status === 'comparing' || item.status === 'swapping' ? 1.1 : 1,
                    y: item.status === 'swapping' ? -5 : 0
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-xs font-bold">{item.value}</span>
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
                <span>Best Case:</span>
                <span className="font-mono">O(n log n)</span>
              </div>
              <div className="flex justify-between">
                <span>Average Case:</span>
                <span className="font-mono">O(n log n)</span>
              </div>
              <div className="flex justify-between">
                <span>Worst Case:</span>
                <span className="font-mono">O(n²)</span>
              </div>
              <div className="flex justify-between">
                <span>Space Complexity:</span>
                <span className="font-mono">O(log n)</span>
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
              <li>• Divide-and-conquer algorithm</li>
              <li>• In-place sorting (minimal extra memory)</li>
              <li>• Not stable (relative order may change)</li>
              <li>• Efficient for large datasets</li>
              <li>• Widely used in practice</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Learn More */}
      <Card>
        <CardHeader>
          <CardTitle>Learn More</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-2">
            <li>
              <ExternalLink className="h-4 w-4 inline-block mr-1" />
              <a href="https://www.w3schools.com/algorithms/quick_sort.asp" target="_blank" rel="noopener noreferrer" className="underline">
                W3Schools Quick Sort Tutorial
              </a>
            </li>
            <li>
              <ExternalLink className="h-4 w-4 inline-block mr-1" />
              <a href="https://www.geeksforgeeks.org/quick-sort/" target="_blank" rel="noopener noreferrer" className="underline">
                GeeksforGeeks Quick Sort Explanation
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickSortVisualizer;
