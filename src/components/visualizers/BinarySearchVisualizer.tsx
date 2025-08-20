
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Play, Pause, SkipForward, RotateCcw, Shuffle, Search, ArrowUp, ExternalLink, Gauge } from 'lucide-react';
import { motion } from 'framer-motion';
import { Slider } from '../ui/slider';

interface ArrayItem {
  value: number;
  status: 'default' | 'checking' | 'found' | 'eliminated' | 'range';
}

interface SearchStep {
  array: ArrayItem[];
  description: string;
  left: number;
  right: number;
  mid?: number;
  found?: boolean;
}

const BinarySearchVisualizer: React.FC = () => {
  const [array, setArray] = useState<ArrayItem[]>([
    { value: 12, status: 'default' },
    { value: 25, status: 'default' },
    { value: 34, status: 'default' },
    { value: 48, status: 'default' },
    { value: 56, status: 'default' },
    { value: 67, status: 'default' },
    { value: 78, status: 'default' },
    { value: 89, status: 'default' }
  ]);
  const [targetValue, setTargetValue] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [searchSteps, setSearchSteps] = useState<SearchStep[]>([]);
  const [currentDescription, setCurrentDescription] = useState('');
  const [searchResult, setSearchResult] = useState<'found' | 'not-found' | null>(null);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [animationSpeed, setAnimationSpeed] = useState([2]);

  const generateBinarySearchSteps = (arr: ArrayItem[], target: number): SearchStep[] => {
    const steps: SearchStep[] = [];
    const workingArray = arr.map(item => ({ ...item, status: 'default' as const }));
    
    let left = 0;
    let right = workingArray.length - 1;
    
    steps.push({
      array: [...workingArray],
      description: `Starting Binary Search for target value ${target} in sorted array`,
      left,
      right
    });
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      // Show current search range
      const rangeArray = workingArray.map((item, index) => ({
        ...item,
        status: index === mid ? 'checking' as const :
                (index >= left && index <= right) ? 'range' as const : 'eliminated' as const
      }));
      
      steps.push({
        array: [...rangeArray],
        description: `Checking middle element at index ${mid}: ${workingArray[mid].value}`,
        left,
        right,
        mid
      });
      
      if (workingArray[mid].value === target) {
        // Found the target
        const foundArray = workingArray.map((item, index) => ({
          ...item,
          status: index === mid ? 'found' as const : 'eliminated' as const
        }));
        
        steps.push({
          array: [...foundArray],
          description: `Found target value ${target} at index ${mid}!`,
          left,
          right,
          mid,
          found: true
        });
        
        return steps;
      } else if (workingArray[mid].value < target) {
        steps.push({
          array: [...rangeArray],
          description: `${workingArray[mid].value} < ${target}, searching right half`,
          left,
          right,
          mid
        });
        left = mid + 1;
      } else {
        steps.push({
          array: [...rangeArray],
          description: `${workingArray[mid].value} > ${target}, searching left half`,
          left,
          right,
          mid
        });
        right = mid - 1;
      }
    }
    
    // Target not found
    const notFoundArray = workingArray.map(item => ({
      ...item,
      status: 'eliminated' as const
    }));
    
    steps.push({
      array: [...notFoundArray],
      description: `Target value ${target} not found in the array`,
      left,
      right,
      found: false
    });
    
    return steps;
  };

  const startSearch = () => {
    const target = parseInt(targetValue);
    if (isNaN(target)) return;
    
    // Ensure array is sorted
    const sortedArray = [...array].sort((a, b) => a.value - b.value);
    setArray(sortedArray);
    
    const steps = generateBinarySearchSteps(sortedArray, target);
    setSearchSteps(steps);
    setCurrentStep(0);
    setSearchResult(null);
    setIsAnimating(true);
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
    setSearchSteps([]);
    setCurrentDescription('');
    setSearchResult(null);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    setArray(prev => prev.map(item => ({ ...item, status: 'default' as const })));
  };

  const stepForward = () => {
    if (currentStep < searchSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      const nextStep = searchSteps[currentStep + 1];
      setArray(nextStep.array);
      setCurrentDescription(nextStep.description);
      if (nextStep.found !== undefined) {
        setSearchResult(nextStep.found ? 'found' : 'not-found');
      }
    }
  };

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 8 }, () => ({
      value: Math.floor(Math.random() * 90) + 10,
      status: 'default' as const
    })).sort((a, b) => a.value - b.value);
    setArray(newArray);
    resetAnimation();
  };

  const handleCustomInput = () => {
    try {
      const values = customInput.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
      if (values.length > 0 && values.length <= 12) {
        const newArray = values.map(value => ({ value, status: 'default' as const }))
          .sort((a, b) => a.value - b.value);
        setArray(newArray);
        setCustomInput('');
        resetAnimation();
      }
    } catch (error) {
      console.error('Invalid input');
    }
  };

  useEffect(() => {
    if (isAnimating && searchSteps.length > 0) {
      if (currentStep < searchSteps.length - 1) {
        animationRef.current = setTimeout(() => {
          setCurrentStep(prev => prev + 1);
          const nextStep = searchSteps[currentStep + 1];
          setArray(nextStep.array);
          setCurrentDescription(nextStep.description);
          if (nextStep.found !== undefined) {
            setSearchResult(nextStep.found ? 'found' : 'not-found');
          }
        }, animationSpeed[0] * 1000);
      } else {
        setIsAnimating(false);
      }
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isAnimating, currentStep, searchSteps]);

  const getBarColor = (status: ArrayItem['status']) => {
    switch (status) {
      case 'checking': return 'bg-orange-500';
      case 'found': return 'bg-green-500';
      case 'range': return 'bg-blue-400';
      case 'eliminated': return 'bg-gray-400';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Binary Search Visualizer
            <span className="text-sm font-normal text-muted-foreground">O(log n) Time Complexity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter array (comma separated)"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCustomInput()}
              />
              <Button onClick={handleCustomInput} variant="outline">Set Array</Button>
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Target value"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && startSearch()}
              />
              <Button onClick={startSearch} disabled={!targetValue || isAnimating}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Note about sorted array */}
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
            <strong>Note:</strong> Binary search requires a sorted array. The array will be automatically sorted before searching.
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Button onClick={generateRandomArray} variant="outline" size="sm">
              <Shuffle className="h-4 w-4 mr-2" />
              Random Sorted Array
            </Button>
            <Button 
              onClick={isAnimating ? pauseAnimation : () => setIsAnimating(true)} 
              size="sm"
              disabled={searchSteps.length === 0 || currentStep >= searchSteps.length - 1}
            >
              {isAnimating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isAnimating ? 'Pause' : 'Play'}
            </Button>
            <Button onClick={stepForward} variant="outline" size="sm" disabled={isAnimating || currentStep >= searchSteps.length - 1}>
              <SkipForward className="h-4 w-4 mr-2" />
              Step
            </Button>
            <Button onClick={resetAnimation} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

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

          {/* Color Legend */}
          <div className="bg-muted/20 p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Color Legend:</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500"></div>
                <span>🔵 Unsearched</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400"></div>
                <span>🔵 Search Range</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500"></div>
                <span>🟠 Checking Mid</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500"></div>
                <span>🟢 Found</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400"></div>
                <span>⚫ Eliminated</span>
              </div>
            </div>
          </div>

          {/* Search Result */}
          {searchResult && (
            <div className={`p-3 rounded-lg text-sm ${
              searchResult === 'found' 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              <strong>Result:</strong> {searchResult === 'found' ? 'Target found!' : 'Target not found in array'}
            </div>
          )}

          {/* Step Description */}
          {currentDescription && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
              <strong>Step:</strong> {currentDescription}
            </div>
          )}

          {/* Array Visualization */}
          <div className="bg-muted/20 p-6 rounded-lg min-h-[200px] flex items-end justify-center gap-2">
            {array.map((item, index) => (
              <motion.div
                key={`${index}-${item.value}`}
                className={`${getBarColor(item.status)} text-white text-sm font-bold flex items-end justify-center relative transition-all duration-300 rounded-t`}
                style={{ 
                  height: `${Math.max(item.value, 40)}px`,
                  width: '50px'
                }}
                animate={{ 
                  scale: item.status === 'checking' ? 1.2 : 1,
                  y: item.status === 'found' ? -5 : 0
                }}
              >
                <span className="absolute bottom-1">{item.value}</span>
                <span className="absolute -bottom-6 text-xs text-muted-foreground">{index}</span>
                {item.status === 'checking' && (
                  <ArrowUp className="absolute -top-8 left-1/2 transform -translate-x-1/2 h-4 w-4 text-orange-500" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Progress */}
          <div className="text-center text-sm text-muted-foreground">
            Step {currentStep + 1} of {searchSteps.length || 1}
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
                <span className="font-mono">O(log n)</span>
              </div>
              <div className="flex justify-between">
                <span>Space Complexity:</span>
                <span className="font-mono">O(1)</span>
              </div>
              <div className="flex justify-between">
                <span>Best Case:</span>
                <span className="font-mono">O(1)</span>
              </div>
              <div className="flex justify-between">
                <span>Worst Case:</span>
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
              <li>• Requires sorted array</li>
              <li>• Divides search space in half each iteration</li>
              <li>• Much faster than linear search</li>
              <li>• Eliminates half of remaining elements</li>
              <li>• Ideal for large sorted datasets</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Learn More Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Learn More
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            For a more detailed explanation and examples, check out these resources:
          </p>
          <ul className="text-sm space-y-1">
            <li>
              <a href="https://www.w3schools.com/algorithms/algorithm_binary_search.asp" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                W3Schools - Binary Search Algorithm
              </a>
            </li>
            <li>
              <a href="https://www.geeksforgeeks.org/binary-search/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                GeeksforGeeks - Binary Search
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default BinarySearchVisualizer;
