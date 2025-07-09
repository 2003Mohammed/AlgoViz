
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Play, Pause, SkipForward, RotateCcw, Shuffle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ArrayItem {
  value: number;
  status: 'default' | 'exponential' | 'binary' | 'found' | 'not-found';
  index: number;
}

interface SearchStep {
  array: ArrayItem[];
  description: string;
  phase: 'exponential' | 'binary';
  left?: number;
  right?: number;
  mid?: number;
  bound?: number;
}

const ExponentialSearchVisualizer: React.FC = () => {
  const [array, setArray] = useState<ArrayItem[]>([]);
  const [target, setTarget] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [searchSteps, setSearchSteps] = useState<SearchStep[]>([]);
  const [currentDescription, setCurrentDescription] = useState('');
  const [foundIndex, setFoundIndex] = useState<number>(-1);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * 8) + 8; // 8-15 elements
    const newArray = Array.from({ length: size }, (_, i) => ({
      value: (i + 1) * 2 + Math.floor(Math.random() * 3), // Sorted with some variation
      status: 'default' as const,
      index: i
    }));
    
    // Ensure it's sorted
    newArray.sort((a, b) => a.value - b.value);
    newArray.forEach((item, index) => item.index = index);
    
    setArray(newArray);
    setTarget(newArray[Math.floor(Math.random() * newArray.length)].value);
    resetAnimation();
  };

  const performExponentialSearch = () => {
    if (array.length === 0) return;
    
    const steps: SearchStep[] = [];
    const arr = [...array];
    
    // Phase 1: Exponential Search
    let bound = 1;
    
    // Initial state
    steps.push({
      array: arr.map(item => ({ ...item, status: 'default' })),
      description: `Starting exponential search for ${target}. Checking bounds exponentially.`,
      phase: 'exponential'
    });
    
    // Find the range for binary search
    while (bound < arr.length && arr[bound].value < target) {
      steps.push({
        array: arr.map((item, idx) => ({
          ...item,
          status: idx === bound ? 'exponential' : 'default'
        })),
        description: `Checking index ${bound} with value ${arr[bound].value}. ${arr[bound].value} < ${target}, so expand bound.`,
        phase: 'exponential',
        bound: bound
      });
      
      bound *= 2;
    }
    
    // Found the range
    const left = Math.floor(bound / 2);
    const right = Math.min(bound, arr.length - 1);
    
    steps.push({
      array: arr.map((item, idx) => ({
        ...item,
        status: (idx >= left && idx <= right) ? 'binary' : 'default'
      })),
      description: `Range found: [${left}, ${right}]. Starting binary search in this range.`,
      phase: 'binary',
      left: left,
      right: right
    });
    
    // Phase 2: Binary Search
    let l = left;
    let r = right;
    let found = false;
    
    while (l <= r) {
      const mid = Math.floor((l + r) / 2);
      
      steps.push({
        array: arr.map((item, idx) => ({
          ...item,
          status: idx === mid ? 'binary' : 
                 (idx >= l && idx <= r) ? 'binary' : 'default'
        })),
        description: `Binary search: checking middle index ${mid} with value ${arr[mid].value}`,
        phase: 'binary',
        left: l,
        right: r,
        mid: mid
      });
      
      if (arr[mid].value === target) {
        steps.push({
          array: arr.map((item, idx) => ({
            ...item,
            status: idx === mid ? 'found' : 'default'
          })),
          description: `Found ${target} at index ${mid}!`,
          phase: 'binary',
          left: l,
          right: r,
          mid: mid
        });
        found = true;
        setFoundIndex(mid);
        break;
      } else if (arr[mid].value < target) {
        l = mid + 1;
        steps.push({
          array: arr.map((item, idx) => ({
            ...item,
            status: (idx >= l && idx <= r) ? 'binary' : 'default'
          })),
          description: `${arr[mid].value} < ${target}, search right half [${l}, ${r}]`,
          phase: 'binary',
          left: l,
          right: r
        });
      } else {
        r = mid - 1;
        steps.push({
          array: arr.map((item, idx) => ({
            ...item,
            status: (idx >= l && idx <= r) ? 'binary' : 'default'
          })),
          description: `${arr[mid].value} > ${target}, search left half [${l}, ${r}]`,
          phase: 'binary',
          left: l,
          right: r
        });
      }
    }
    
    if (!found) {
      steps.push({
        array: arr.map(item => ({ ...item, status: 'not-found' })),
        description: `${target} not found in the array`,
        phase: 'binary'
      });
      setFoundIndex(-1);
    }
    
    setSearchSteps(steps);
    setCurrentStep(0);
    setIsAnimating(true);
  };

  const stepForward = () => {
    if (currentStep < searchSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const resetAnimation = () => {
    setCurrentStep(0);
    setIsAnimating(false);
    setCurrentDescription('');
    setFoundIndex(-1);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    
    setArray(array.map(item => ({ ...item, status: 'default' })));
  };

  useEffect(() => {
    generateRandomArray();
  }, []);

  useEffect(() => {
    if (isAnimating && searchSteps.length > 0) {
      if (currentStep < searchSteps.length) {
        const step = searchSteps[currentStep];
        setCurrentDescription(step.description);
        setArray(step.array);
        
        animationRef.current = setTimeout(() => {
          if (currentStep < searchSteps.length - 1) {
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
  }, [isAnimating, currentStep, searchSteps]);

  const getBarColor = (status: string) => {
    switch (status) {
      case 'exponential': return 'bg-orange-500';
      case 'binary': return 'bg-yellow-500';
      case 'found': return 'bg-green-500';
      case 'not-found': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exponential Search Visualizer</CardTitle>
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
                placeholder="Target"
                value={target}
                onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
                className="w-24"
              />
              <Button onClick={performExponentialSearch} size="sm">
                Search
              </Button>
            </div>
          </div>

          {/* Animation Controls */}
          {searchSteps.length > 0 && (
            <div className="flex gap-2 justify-center items-center p-4 bg-muted/20 rounded-lg">
              <Button 
                onClick={() => setIsAnimating(!isAnimating)} 
                size="sm"
                disabled={currentStep >= searchSteps.length - 1}
              >
                {isAnimating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isAnimating ? 'Pause' : 'Play'}
              </Button>
              <Button onClick={stepForward} size="sm" disabled={currentStep >= searchSteps.length - 1}>
                <SkipForward className="h-4 w-4 mr-2" />
                Step
              </Button>
              <Button onClick={resetAnimation} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {searchSteps.length}
              </span>
            </div>
          )}

          {/* Color Legend */}
          <div className="bg-muted/20 p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Color Legend:</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>🔵 Default</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span>🟠 Exponential Jump</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>🟡 Binary Search</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>🟢 Found</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>🔴 Not Found</span>
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
                  className="flex flex-col items-center"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: item.status === 'found' ? 1.1 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`w-12 ${getBarColor(item.status)} text-white font-bold flex items-center justify-center text-sm rounded-t`}
                    style={{ height: `${Math.max(item.value * 8, 40)}px` }}
                  >
                    {item.value}
                  </div>
                  <div className="text-xs mt-1 text-center font-medium">
                    [{index}]
                  </div>
                </motion.div>
              ))}
            </div>
            
            {foundIndex !== -1 && (
              <div className="text-center mt-4">
                <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
                  ✅ Found {target} at index {foundIndex}
                </div>
              </div>
            )}
            
            {foundIndex === -1 && searchSteps.length > 0 && currentStep === searchSteps.length - 1 && (
              <div className="text-center mt-4">
                <div className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-lg font-medium">
                  ⚠️ {target} not found in array
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExponentialSearchVisualizer;
