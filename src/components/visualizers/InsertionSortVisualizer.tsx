
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Play, Pause, SkipForward, RotateCcw, Shuffle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ArrayItem {
  value: number;
  status: 'default' | 'current' | 'comparing' | 'sorted' | 'inserting';
}

const InsertionSortVisualizer: React.FC = () => {
  const [array, setArray] = useState<ArrayItem[]>([
    { value: 64, status: 'default' },
    { value: 34, status: 'default' },
    { value: 25, status: 'default' },
    { value: 12, status: 'default' },
    { value: 22, status: 'default' }
  ]);
  const [customArray, setCustomArray] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSteps, setAnimationSteps] = useState<ArrayItem[][]>([]);
  const [error, setError] = useState('');
  const [comparisons, setComparisons] = useState(0);
  const [movements, setMovements] = useState(0);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetError = () => setError('');

  const generateExample = () => {
    const examples = [
      [64, 34, 25, 12, 22, 11, 90],
      [45, 23, 78, 12, 56, 89, 34],
      [10, 30, 20, 50, 40, 60, 80],
      [100, 75, 50, 25, 15, 5, 85]
    ];
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setArray(randomExample.map(value => ({ value, status: 'default' as const })));
    setAnimationSteps([]);
    setCurrentStep(0);
    setComparisons(0);
    setMovements(0);
    setIsAnimating(false);
    setIsPaused(false);
    resetError();
  };

  const eraseExample = () => {
    setArray([]);
    setAnimationSteps([]);
    setCurrentStep(0);
    setComparisons(0);
    setMovements(0);
    setIsAnimating(false);
    setIsPaused(false);
    resetError();
  };

  const handleCustomArray = () => {
    const values = customArray.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    
    if (values.length === 0) {
      setError('Please enter valid numbers separated by commas');
      return;
    }
    
    if (values.length > 15) {
      setError('Please enter no more than 15 numbers');
      return;
    }

    resetError();
    setArray(values.map(value => ({ value, status: 'default' as const })));
    setAnimationSteps([]);
    setCurrentStep(0);
    setComparisons(0);
    setMovements(0);
    setIsAnimating(false);
    setIsPaused(false);
    setCustomArray('');
  };

  const insertionSort = () => {
    if (array.length === 0) {
      setError('Array is empty');
      return;
    }

    resetError();
    const steps: ArrayItem[][] = [];
    const sortArray = [...array];
    let compCount = 0;
    let moveCount = 0;
    
    // Initial state
    steps.push([...sortArray]);
    
    // Insertion sort algorithm with detailed steps
    for (let i = 1; i < sortArray.length; i++) {
      // Mark current element
      sortArray[i].status = 'current';
      steps.push([...sortArray]);
      
      const key = sortArray[i];
      let j = i - 1;
      
      // Find correct position
      while (j >= 0) {
        compCount++;
        
        // Highlight comparison
        sortArray[j].status = 'comparing';
        sortArray[i].status = 'current';
        steps.push([...sortArray]);
        
        if (sortArray[j].value > key.value) {
          // Move element
          moveCount++;
          sortArray[j + 1] = { ...sortArray[j], status: 'inserting' };
          steps.push([...sortArray]);
          j--;
        } else {
          // Reset comparison status
          sortArray[j].status = 'sorted';
          break;
        }
        
        // Reset previous comparison
        if (j >= 0) {
          sortArray[j + 1].status = 'default';
        }
      }
      
      // Insert the key at correct position
      sortArray[j + 1] = { ...key, status: 'inserting' };
      steps.push([...sortArray]);
      
      // Mark all elements up to i as sorted
      for (let k = 0; k <= i; k++) {
        sortArray[k].status = 'sorted';
      }
      steps.push([...sortArray]);
    }
    
    // Final state - all sorted
    const finalArray = sortArray.map(item => ({ ...item, status: 'sorted' as const }));
    steps.push(finalArray);
    
    setAnimationSteps(steps);
    setCurrentStep(0);
    setComparisons(compCount);
    setMovements(moveCount);
    setIsAnimating(true);
    setIsPaused(false);
  };

  const playAnimation = () => {
    if (animationSteps.length === 0) {
      setError('No animation to play. Start sorting first.');
      return;
    }
    setIsAnimating(true);
    setIsPaused(false);
  };

  const pauseAnimation = () => {
    setIsAnimating(false);
    setIsPaused(true);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
  };

  const stepForward = () => {
    if (currentStep < animationSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setArray(animationSteps[nextStep]);
    }
  };

  const resetAnimation = () => {
    if (animationSteps.length > 0) {
      setCurrentStep(0);
      setArray(animationSteps[0]);
    }
    setIsAnimating(false);
    setIsPaused(false);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
  };

  const resetAll = () => {
    setArray(prev => prev.map(item => ({ ...item, status: 'default' })));
    setAnimationSteps([]);
    setCurrentStep(0);
    setComparisons(0);
    setMovements(0);
    setIsAnimating(false);
    setIsPaused(false);
    setCustomArray('');
    resetError();
    if (animationRef.current) clearTimeout(animationRef.current);
  };

  // Animation effect
  useEffect(() => {
    if (isAnimating && !isPaused && animationSteps.length > 0) {
      if (currentStep < animationSteps.length - 1) {
        animationRef.current = setTimeout(() => {
          const nextStep = currentStep + 1;
          setCurrentStep(nextStep);
          setArray(animationSteps[nextStep]);
        }, 1000);
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

  const getItemColor = (status: ArrayItem['status']) => {
    switch (status) {
      case 'current': return 'bg-blue-500';
      case 'comparing': return 'bg-yellow-500';
      case 'sorted': return 'bg-green-500';
      case 'inserting': return 'bg-purple-500';
      default: return 'bg-primary';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Insertion Sort Visualizer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button onClick={generateExample} variant="outline" size="sm">
              <Shuffle className="h-4 w-4 mr-2" />
              Generate Example
            </Button>
            <Button onClick={eraseExample} variant="outline" size="sm">
              Erase Example
            </Button>
            <Button onClick={insertionSort} disabled={isAnimating || array.length === 0}>
              Start Insertion Sort
            </Button>
          </div>

          {/* Custom Array Input */}
          <div className="flex gap-2 justify-center">
            <Input
              placeholder="Enter numbers: 5,2,8,1,9"
              value={customArray}
              onChange={(e) => setCustomArray(e.target.value)}
              disabled={isAnimating}
              className="max-w-xs"
            />
            <Button onClick={handleCustomArray} disabled={isAnimating || !customArray.trim()}>
              Set Array
            </Button>
          </div>

          {/* Animation Controls */}
          {animationSteps.length > 0 && (
            <div className="flex gap-2 justify-center items-center p-4 bg-muted/20 rounded-lg">
              <Button 
                onClick={playAnimation} 
                disabled={isAnimating}
                size="sm"
              >
                <Play className="h-4 w-4 mr-2" />
                Play
              </Button>
              <Button 
                onClick={pauseAnimation} 
                disabled={!isAnimating}
                size="sm"
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button onClick={stepForward} size="sm">
                <SkipForward className="h-4 w-4 mr-2" />
                Step
              </Button>
              <Button onClick={resetAnimation} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {animationSteps.length}
              </span>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Array Visualization */}
          <div className="bg-muted/20 p-6 rounded-lg min-h-[200px] flex items-end justify-center gap-2">
            {array.length === 0 ? (
              <div className="text-center text-muted-foreground">
                <p className="text-lg font-medium">Empty Array</p>
                <p className="text-sm">Generate an example or enter custom values</p>
              </div>
            ) : (
              <AnimatePresence>
                {array.map((item, index) => (
                  <motion.div
                    key={`${index}-${item.value}`}
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-xs text-muted-foreground mb-1">{index}</div>
                    <motion.div
                      className={`w-12 h-16 ${getItemColor(item.status)} text-white rounded-md flex items-center justify-center font-bold text-sm shadow-lg`}
                      animate={{ 
                        scale: item.status === 'current' || item.status === 'inserting' ? 1.1 : 1,
                        y: item.status === 'inserting' ? -5 : 0
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.value}
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-medium">Array Length</div>
              <div className="text-lg font-bold">{array.length}</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-medium">Comparisons</div>
              <div className="text-lg font-bold">{comparisons}</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-medium">Movements</div>
              <div className="text-lg font-bold">{movements}</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-medium">Time Complexity</div>
              <div className="text-lg font-bold">O(n²)</div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={resetAll} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Educational Content */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Algorithm Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Time Complexity:</h4>
                <ul className="text-sm space-y-1">
                  <li className="flex justify-between">
                    <span>Best Case:</span>
                    <span className="font-mono">O(n)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Average Case:</span>
                    <span className="font-mono">O(n²)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Worst Case:</span>
                    <span className="font-mono">O(n²)</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Space Complexity:</h4>
                <p className="text-sm font-mono">O(1) - In-place sorting</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Real-world Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ul className="text-sm space-y-1">
                <li>• Small datasets (≤ 50 elements)</li>
                <li>• Nearly sorted arrays</li>
                <li>• Online sorting (sorting as data arrives)</li>
                <li>• Hybrid algorithms (Timsort uses insertion sort)</li>
                <li>• Embedded systems (simple implementation)</li>
              </ul>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://www.w3schools.com/algorithms/insertion_sort.asp" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    W3Schools
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://www.geeksforgeeks.org/insertion-sort/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    GeeksforGeeks
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InsertionSortVisualizer;
