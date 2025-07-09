
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Play, Pause, SkipForward, RotateCcw, Shuffle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ArrayItem {
  value: number;
  status: 'default' | 'window' | 'optimal' | 'outside';
  index: number;
}

interface WindowStep {
  array: ArrayItem[];
  description: string;
  windowStart: number;
  windowEnd: number;
  currentSum?: number;
  maxSum?: number;
  optimalStart?: number;
  optimalEnd?: number;
}

const SlidingWindowVisualizer: React.FC = () => {
  const [array, setArray] = useState<ArrayItem[]>([]);
  const [windowSize, setWindowSize] = useState<number>(3);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [windowSteps, setWindowSteps] = useState<WindowStep[]>([]);
  const [currentDescription, setCurrentDescription] = useState('');
  const [maxSum, setMaxSum] = useState<number>(0);
  const [optimalWindow, setOptimalWindow] = useState<{start: number, end: number}>({start: -1, end: -1});
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * 5) + 8; // 8-12 elements
    const newArray = Array.from({ length: size }, (_, i) => ({
      value: Math.floor(Math.random() * 20) + 1, // Random values 1-20
      status: 'default' as const,
      index: i
    }));
    
    setArray(newArray);
    setWindowSize(Math.min(3, Math.floor(size / 2))); // Reasonable window size
    resetAnimation();
  };

  const performSlidingWindow = () => {
    if (array.length === 0 || windowSize > array.length) return;
    
    const steps: WindowStep[] = [];
    const arr = [...array];
    let maxSum = -Infinity;
    let optimalStart = 0;
    let optimalEnd = windowSize - 1;
    
    // Initial state
    steps.push({
      array: arr.map(item => ({ ...item, status: 'default' })),
      description: `Starting sliding window search for maximum sum subarray of size ${windowSize}`,
      windowStart: 0,
      windowEnd: windowSize - 1
    });
    
    // Calculate initial window sum
    let currentSum = 0;
    for (let i = 0; i < windowSize; i++) {
      currentSum += arr[i].value;
    }
    
    maxSum = currentSum;
    
    steps.push({
      array: arr.map((item, idx) => ({
        ...item,
        status: idx < windowSize ? 'window' : 'outside'
      })),
      description: `Initial window [0, ${windowSize - 1}]: sum = ${currentSum}`,
      windowStart: 0,
      windowEnd: windowSize - 1,
      currentSum: currentSum,
      maxSum: maxSum
    });
    
    // Slide the window
    for (let i = 1; i <= arr.length - windowSize; i++) {
      const windowStart = i;
      const windowEnd = i + windowSize - 1;
      
      // Remove the leftmost element and add the rightmost element
      currentSum = currentSum - arr[i - 1].value + arr[windowEnd].value;
      
      const isNewMax = currentSum > maxSum;
      if (isNewMax) {
        maxSum = currentSum;
        optimalStart = windowStart;
        optimalEnd = windowEnd;
      }
      
      steps.push({
        array: arr.map((item, idx) => ({
          ...item,
          status: (idx >= windowStart && idx <= windowEnd) ? 'window' : 'outside'
        })),
        description: `Window [${windowStart}, ${windowEnd}]: sum = ${currentSum}${isNewMax ? ' (new maximum!)' : ''}`,
        windowStart: windowStart,
        windowEnd: windowEnd,
        currentSum: currentSum,
        maxSum: maxSum,
        optimalStart: optimalStart,
        optimalEnd: optimalEnd
      });
    }
    
    // Final result
    steps.push({
      array: arr.map((item, idx) => ({
        ...item,
        status: (idx >= optimalStart && idx <= optimalEnd) ? 'optimal' : 'outside'
      })),
      description: `Maximum sum found: ${maxSum} in window [${optimalStart}, ${optimalEnd}]`,
      windowStart: optimalStart,
      windowEnd: optimalEnd,
      currentSum: maxSum,
      maxSum: maxSum,
      optimalStart: optimalStart,
      optimalEnd: optimalEnd
    });
    
    setWindowSteps(steps);
    setCurrentStep(0);
    setIsAnimating(true);
    setMaxSum(maxSum);
    setOptimalWindow({start: optimalStart, end: optimalEnd});
  };

  const stepForward = () => {
    if (currentStep < windowSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const resetAnimation = () => {
    setCurrentStep(0);
    setIsAnimating(false);
    setCurrentDescription('');
    setMaxSum(0);
    setOptimalWindow({start: -1, end: -1});
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    
    setArray(array.map(item => ({ ...item, status: 'default' })));
  };

  useEffect(() => {
    generateRandomArray();
  }, []);

  useEffect(() => {
    if (isAnimating && windowSteps.length > 0) {
      if (currentStep < windowSteps.length) {
        const step = windowSteps[currentStep];
        setCurrentDescription(step.description);
        setArray(step.array);
        
        animationRef.current = setTimeout(() => {
          if (currentStep < windowSteps.length - 1) {
            setCurrentStep(currentStep + 1);
          } else {
            setIsAnimating(false);
          }
        }, 1500);
      }
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isAnimating, currentStep, windowSteps]);

  const getBarColor = (status: string) => {
    switch (status) {
      case 'window': return 'bg-orange-500';
      case 'optimal': return 'bg-green-500';
      case 'outside': return 'bg-gray-400';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sliding Window - Maximum Sum Subarray</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="flex gap-4 items-center justify-center flex-wrap">
            <Button onClick={generateRandomArray} variant="outline" size="sm">
              <Shuffle className="h-4 w-4 mr-2" />
              Generate Array
            </Button>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Window Size"
                value={windowSize}
                onChange={(e) => setWindowSize(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-32"
                min="1"
                max={array.length}
              />
              <Button onClick={performSlidingWindow} size="sm">
                Find Max Sum
              </Button>
            </div>
          </div>

          {/* Animation Controls */}
          {windowSteps.length > 0 && (
            <div className="flex gap-2 justify-center items-center p-4 bg-muted/20 rounded-lg">
              <Button 
                onClick={() => setIsAnimating(!isAnimating)} 
                size="sm"
                disabled={currentStep >= windowSteps.length - 1}
              >
                {isAnimating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isAnimating ? 'Pause' : 'Play'}
              </Button>
              <Button onClick={stepForward} size="sm" disabled={currentStep >= windowSteps.length - 1}>
                <SkipForward className="h-4 w-4 mr-2" />
                Step
              </Button>
              <Button onClick={resetAnimation} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {windowSteps.length}
              </span>
            </div>
          )}

          {/* Color Legend */}
          <div className="bg-muted/20 p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Color Legend:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>🔵 Default</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span>🟠 Current Window</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>🟢 Optimal Window</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded"></div>
                <span>⚪ Outside Window</span>
              </div>
            </div>
          </div>

          {/* Description Box */}
          {currentDescription && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
              <strong>Step:</strong> {currentDescription}
            </div>
          )}

          {/* Array Visualization */}
          <div className="bg-muted/20 p-6 rounded-lg">
            <div className="flex items-end justify-center gap-2 min-h-[200px] overflow-x-auto">
              {array.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center relative"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: item.status === 'optimal' ? 1.1 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`w-12 ${getBarColor(item.status)} text-white font-bold flex items-center justify-center text-sm rounded-t transition-all duration-300`}
                    style={{ height: `${Math.max(item.value * 8, 40)}px` }}
                  >
                    {item.value}
                  </div>
                  <div className="text-xs mt-1 text-center font-medium">
                    [{index}]
                  </div>
                  
                  {/* Window indicator */}
                  {item.status === 'window' || item.status === 'optimal' ? (
                    <motion.div
                      className={`absolute -top-2 left-0 right-0 h-1 ${
                        item.status === 'optimal' ? 'bg-green-600' : 'bg-orange-600'
                      } rounded-full`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  ) : null}
                </motion.div>
              ))}
            </div>
            
            {/* Current sum display */}
            {windowSteps.length > 0 && currentStep < windowSteps.length && (
              <div className="text-center mt-4">
                <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium mr-4">
                  Current Sum: {windowSteps[currentStep].currentSum || 0}
                </div>
                <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
                  Max Sum: {windowSteps[currentStep].maxSum || 0}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SlidingWindowVisualizer;
