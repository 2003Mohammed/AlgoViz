
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Play, Pause, SkipForward, RotateCcw, Shuffle, ExternalLink, Gauge } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from '../ui/slider';
import { LearnMoreLink } from '../LearnMoreLink';

interface ArrayItem {
  value: number;
  status: 'default' | 'dividing' | 'merging' | 'comparing' | 'sorted';
  level?: number;
}

interface MergeStep {
  array: ArrayItem[];
  description: string;
  highlightRange?: [number, number];
}

const MergeSortVisualizer: React.FC = () => {
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
  const [animationSteps, setAnimationSteps] = useState<MergeStep[]>([]);
  const [error, setError] = useState('');
  const [comparisons, setComparisons] = useState(0);
  const [merges, setMerges] = useState(0);
  const [currentDescription, setCurrentDescription] = useState('');
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [animationSpeed, setAnimationSpeed] = useState([1.5]);

  const resetError = () => setError('');

  const generateExample = () => {
    const examples = [
      [64, 34, 25, 12, 22, 11, 90, 88],
      [45, 23, 78, 12, 56, 89, 34, 67],
      [10, 30, 20, 50, 40, 60, 80, 70],
      [100, 75, 50, 25, 15, 5, 85, 95]
    ];
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setArray(randomExample.map(value => ({ value, status: 'default' as const })));
    setAnimationSteps([]);
    setCurrentStep(0);
    setComparisons(0);
    setMerges(0);
    setCurrentDescription('');
    setIsAnimating(false);
    setIsPaused(false);
    resetError();
  };

  const eraseExample = () => {
    setArray([]);
    setAnimationSteps([]);
    setCurrentStep(0);
    setComparisons(0);
    setMerges(0);
    setCurrentDescription('');
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
    
    if (values.length > 12) {
      setError('Please enter no more than 12 numbers');
      return;
    }

    resetError();
    setArray(values.map(value => ({ value, status: 'default' as const })));
    setAnimationSteps([]);
    setCurrentStep(0);
    setComparisons(0);
    setMerges(0);
    setCurrentDescription('');
    setIsAnimating(false);
    setIsPaused(false);
    setCustomArray('');
  };

  const mergeSort = () => {
    if (array.length === 0) {
      setError('Array is empty');
      return;
    }

    resetError();
    const steps: MergeStep[] = [];
    const sortArray = [...array];
    let compCount = 0;
    let mergeCount = 0;
    
    // Initial state
    steps.push({
      array: [...sortArray],
      description: 'Starting Merge Sort - Divide and Conquer approach'
    });
    
    const mergeSortRecursive = (arr: ArrayItem[], left: number, right: number, level: number = 0): ArrayItem[] => {
      if (left >= right) return [arr[left]];
      
      const mid = Math.floor((left + right) / 2);
      
      // Highlight division
      const divideArray = [...sortArray];
      for (let i = left; i <= right; i++) {
        divideArray[i] = { ...divideArray[i], status: 'dividing', level };
      }
      steps.push({
        array: [...divideArray],
        description: `Dividing array: indices ${left}-${right} (mid: ${mid})`,
        highlightRange: [left, right]
      });
      
      // Recursively sort left and right halves
      const leftSorted = mergeSortRecursive(arr, left, mid, level + 1);
      const rightSorted = mergeSortRecursive(arr, mid + 1, right, level + 1);
      
      // Merge the sorted halves
      return merge(leftSorted, rightSorted, left, right, level);
    };
    
    const merge = (left: ArrayItem[], right: ArrayItem[], startIdx: number, endIdx: number, level: number): ArrayItem[] => {
      const result: ArrayItem[] = [];
      let i = 0, j = 0;
      
      mergeCount++;
      
      // Highlight merging arrays
      const mergeArray = [...sortArray];
      for (let k = startIdx; k <= endIdx; k++) {
        mergeArray[k] = { ...mergeArray[k], status: 'merging', level };
      }
      steps.push({
        array: [...mergeArray],
        description: `Merging subarrays of size ${left.length} and ${right.length}`,
        highlightRange: [startIdx, endIdx]
      });
      
      // Merge process
      while (i < left.length && j < right.length) {
        compCount++;
        
        // Show comparison
        const compareArray = [...mergeArray];
        steps.push({
          array: [...compareArray],
          description: `Comparing ${left[i].value} and ${right[j].value}`,
          highlightRange: [startIdx, endIdx]
        });
        
        if (left[i].value <= right[j].value) {
          result.push({ ...left[i], status: 'comparing' });
          i++;
        } else {
          result.push({ ...right[j], status: 'comparing' });
          j++;
        }
        
        // Update array with merge progress
        const updatedArray = [...sortArray];
        for (let k = 0; k < result.length; k++) {
          updatedArray[startIdx + k] = { ...result[k], status: 'merging' };
        }
        steps.push({
          array: [...updatedArray],
          description: `Merged ${result.length} elements so far`,
          highlightRange: [startIdx, endIdx]
        });
      }
      
      // Add remaining elements
      while (i < left.length) {
        result.push({ ...left[i], status: 'merging' });
        i++;
      }
      while (j < right.length) {
        result.push({ ...right[j], status: 'merging' });
        j++;
      }
      
      // Show completed merge
      const completedArray = [...sortArray];
      for (let k = 0; k < result.length; k++) {
        completedArray[startIdx + k] = { ...result[k], status: 'sorted' };
      }
      steps.push({
        array: [...completedArray],
        description: `Completed merging subarray indices ${startIdx}-${endIdx}`,
        highlightRange: [startIdx, endIdx]
      });
      
      // Update main array
      for (let k = 0; k < result.length; k++) {
        sortArray[startIdx + k] = result[k];
      }
      
      return result;
    };
    
    // Start merge sort
    mergeSortRecursive(sortArray, 0, sortArray.length - 1);
    
    // Final state - all sorted
    const finalArray = sortArray.map(item => ({ ...item, status: 'sorted' as const }));
    steps.push({
      array: finalArray,
      description: 'Merge Sort completed! Array is fully sorted.'
    });
    
    setAnimationSteps(steps);
    setCurrentStep(0);
    setComparisons(compCount);
    setMerges(mergeCount);
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
      setArray(animationSteps[nextStep].array);
      setCurrentDescription(animationSteps[nextStep].description);
    }
  };

  const resetAnimation = () => {
    if (animationSteps.length > 0) {
      setCurrentStep(0);
      setArray(animationSteps[0].array);
      setCurrentDescription(animationSteps[0].description);
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
    setMerges(0);
    setCurrentDescription('');
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
          setArray(animationSteps[nextStep].array);
          setCurrentDescription(animationSteps[nextStep].description);
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

  const getItemColor = (status: ArrayItem['status']) => {
    switch (status) {
      case 'dividing': return 'bg-blue-500';
      case 'merging': return 'bg-purple-500';
      case 'comparing': return 'bg-yellow-500';
      case 'sorted': return 'bg-green-500';
      default: return 'bg-primary';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Merge Sort Visualizer</CardTitle>
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
            <Button onClick={mergeSort} disabled={isAnimating || array.length === 0}>
              Start Merge Sort
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

          {/* Speed Control */}
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

          {/* Current Step Description */}
          {currentDescription && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
              <strong>Current Step:</strong> {currentDescription}
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
                        scale: item.status === 'comparing' || item.status === 'merging' ? 1.1 : 1,
                        y: item.status === 'dividing' ? -10 : 0
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
              <div className="font-medium">Merges</div>
              <div className="text-lg font-bold">{merges}</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-medium">Time Complexity</div>
              <div className="text-lg font-bold">O(n log n)</div>
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
                    <span className="font-mono">O(n log n)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Average Case:</span>
                    <span className="font-mono">O(n log n)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Worst Case:</span>
                    <span className="font-mono">O(n log n)</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Space Complexity:</h4>
                <p className="text-sm font-mono">O(n) - Additional space needed</p>
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
                <li>• Large datasets requiring guaranteed O(n log n)</li>
                <li>• External sorting (when data doesn't fit in memory)</li>
                <li>• Stable sorting (preserves relative order)</li>
                <li>• Parallel computing (divide-and-conquer nature)</li>
                <li>• Database systems and search engines</li>
              </ul>
              <div className="flex gap-2">
                <LearnMoreLink algorithmName="Merge Sort" />
                <Button variant="outline" size="sm" asChild>
                  <a href="https://www.geeksforgeeks.org/merge-sort/" target="_blank" rel="noopener noreferrer">
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

export default MergeSortVisualizer;
