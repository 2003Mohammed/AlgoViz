
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Play, Pause, SkipForward, RotateCcw, Shuffle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface ArrayItem {
  value: number;
  status: 'default' | 'comparing' | 'minimum' | 'swapping' | 'sorted';
}

const SelectionSortVisualizer: React.FC = () => {
  const [array, setArray] = useState<ArrayItem[]>([
    { value: 64, status: 'default' },
    { value: 34, status: 'default' },
    { value: 25, status: 'default' },
    { value: 12, status: 'default' },
    { value: 22, status: 'default' },
    { value: 11, status: 'default' }
  ]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSteps, setAnimationSteps] = useState<ArrayItem[][]>([]);
  const [customInput, setCustomInput] = useState('');
  const [speed, setSpeed] = useState(1);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generateSelectionSortSteps = (arr: ArrayItem[]): ArrayItem[][] => {
    const steps: ArrayItem[][] = [];
    const workingArray = [...arr];
    const n = workingArray.length;
    
    steps.push([...workingArray]);
    
    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;
      
      // Mark current position
      const startStep = workingArray.map((item, index) => ({
        ...item,
        status: index === i ? 'comparing' as const : (index < i ? 'sorted' as const : 'default' as const)
      }));
      steps.push([...startStep]);
      
      // Find minimum
      for (let j = i + 1; j < n; j++) {
        // Show comparison
        const compareStep = workingArray.map((item, index) => ({
          ...item,
          status: index === i ? 'comparing' as const : 
                 index === minIndex ? 'minimum' as const :
                 index === j ? 'comparing' as const :
                 index < i ? 'sorted' as const : 'default' as const
        }));
        steps.push([...compareStep]);
        
        if (workingArray[j].value < workingArray[minIndex].value) {
          minIndex = j;
        }
      }
      
      // Show final minimum
      const minStep = workingArray.map((item, index) => ({
        ...item,
        status: index === i ? 'comparing' as const : 
               index === minIndex ? 'minimum' as const :
               index < i ? 'sorted' as const : 'default' as const
      }));
      steps.push([...minStep]);
      
      // Swap if needed
      if (minIndex !== i) {
        const swapStep = workingArray.map((item, index) => ({
          ...item,
          status: (index === i || index === minIndex) ? 'swapping' as const :
                 index < i ? 'sorted' as const : 'default' as const
        }));
        steps.push([...swapStep]);
        
        [workingArray[i], workingArray[minIndex]] = [workingArray[minIndex], workingArray[i]];
      }
      
      // Mark as sorted
      workingArray[i].status = 'sorted';
      steps.push([...workingArray]);
    }
    
    // Mark all as sorted
    const finalStep = workingArray.map(item => ({ ...item, status: 'sorted' as const }));
    steps.push(finalStep);
    
    return steps;
  };

  const startAnimation = () => {
    if (animationSteps.length === 0) {
      const steps = generateSelectionSortSteps(array);
      setAnimationSteps(steps);
      setCurrentStep(0);
      setIsAnimating(true);
    } else {
      setIsAnimating(true);
    }
  };

  const pauseAnimation = () => {
    setIsAnimating(false);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setCurrentStep(0);
    setAnimationSteps([]);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    setArray(prev => prev.map(item => ({ ...item, status: 'default' as const })));
  };

  const stepForward = () => {
    if (currentStep < animationSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setArray(animationSteps[currentStep + 1]);
    }
  };

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 6 }, () => ({
      value: Math.floor(Math.random() * 90) + 10,
      status: 'default' as const
    }));
    setArray(newArray);
    resetAnimation();
  };

  const handleCustomInput = () => {
    try {
      const values = customInput.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
      if (values.length > 0 && values.length <= 10) {
        const newArray = values.map(value => ({ value, status: 'default' as const }));
        setArray(newArray);
        setCustomInput('');
        resetAnimation();
      }
    } catch (error) {
      console.error('Invalid input');
    }
  };

  useEffect(() => {
    if (isAnimating && animationSteps.length > 0) {
      if (currentStep < animationSteps.length - 1) {
        animationRef.current = setTimeout(() => {
          setCurrentStep(prev => prev + 1);
          setArray(animationSteps[currentStep + 1]);
        }, 1200 / speed);
      } else {
        setIsAnimating(false);
      }
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isAnimating, currentStep, animationSteps, speed]);

  const getBarColor = (status: ArrayItem['status']) => {
    switch (status) {
      case 'comparing': return 'bg-blue-500';
      case 'minimum': return 'bg-orange-500';
      case 'swapping': return 'bg-red-500';
      case 'sorted': return 'bg-green-500';
      default: return 'bg-primary';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Selection Sort Visualizer
            <span className="text-sm font-normal text-muted-foreground">O(n²) Time Complexity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Array Visualization */}
          <div className="bg-muted/20 p-6 rounded-lg min-h-[200px] flex items-end justify-center gap-2">
            {array.map((item, index) => (
              <motion.div
                key={`${index}-${item.value}`}
                className={`${getBarColor(item.status)} text-white text-sm font-bold flex items-end justify-center relative transition-all duration-300`}
                style={{ 
                  height: `${(item.value / 100) * 150 + 30}px`,
                  width: '40px'
                }}
                animate={{ scale: item.status === 'swapping' ? 1.1 : 1 }}
              >
                <span className="absolute bottom-1">{item.value}</span>
              </motion.div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Comparing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span>Minimum</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Swapping</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Sorted</span>
            </div>
          </div>

          {/* Custom Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter numbers (comma separated, max 10)"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCustomInput()}
            />
            <Button onClick={handleCustomInput} variant="outline">Set Array</Button>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Button onClick={generateRandomArray} variant="outline" size="sm">
              <Shuffle className="h-4 w-4 mr-2" />
              Random Array
            </Button>
            <Button 
              onClick={isAnimating ? pauseAnimation : startAnimation} 
              size="sm"
              disabled={animationSteps.length > 0 && currentStep >= animationSteps.length - 1}
            >
              {isAnimating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isAnimating ? 'Pause' : 'Start Sort'}
            </Button>
            <Button onClick={stepForward} variant="outline" size="sm" disabled={isAnimating || currentStep >= animationSteps.length - 1}>
              <SkipForward className="h-4 w-4 mr-2" />
              Step
            </Button>
            <Button onClick={resetAnimation} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Speed Control */}
          <div className="flex items-center gap-2 justify-center">
            <span className="text-sm text-muted-foreground">Speed:</span>
            <input
              type="range"
              min="0.25"
              max="3"
              step="0.25"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-32"
            />
            <span className="text-sm font-mono">{speed}x</span>
          </div>
        </CardContent>
      </Card>

      {/* Algorithm Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Time & Space Complexity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Best Case:</span>
                <span className="font-mono">O(n²)</span>
              </div>
              <div className="flex justify-between">
                <span>Average Case:</span>
                <span className="font-mono">O(n²)</span>
              </div>
              <div className="flex justify-between">
                <span>Worst Case:</span>
                <span className="font-mono">O(n²)</span>
              </div>
              <div className="flex justify-between">
                <span>Space Complexity:</span>
                <span className="font-mono">O(1)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Real-World Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              <li>• Simple sorting for small datasets</li>
              <li>• Memory-constrained environments</li>
              <li>• When swap cost is high (fewer swaps than bubble sort)</li>
              <li>• Educational algorithm demonstrations</li>
            </ul>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  MDN
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="https://www.geeksforgeeks.org/selection-sort/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  GeeksforGeeks
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SelectionSortVisualizer;
