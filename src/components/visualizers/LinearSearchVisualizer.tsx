
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Play, Pause, SkipForward, RotateCcw, Shuffle, Search, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface ArrayItem {
  value: number;
  status: 'default' | 'checking' | 'found' | 'not-found';
}

interface SearchStep {
  array: ArrayItem[];
  description: string;
  currentIndex?: number;
  found?: boolean;
}

const LinearSearchVisualizer: React.FC = () => {
  const [array, setArray] = useState<ArrayItem[]>([
    { value: 15, status: 'default' },
    { value: 32, status: 'default' },
    { value: 8, status: 'default' },
    { value: 45, status: 'default' },
    { value: 23, status: 'default' },
    { value: 67, status: 'default' }
  ]);
  const [targetValue, setTargetValue] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [searchSteps, setSearchSteps] = useState<SearchStep[]>([]);
  const [currentDescription, setCurrentDescription] = useState('');
  const [searchResult, setSearchResult] = useState<'found' | 'not-found' | null>(null);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generateLinearSearchSteps = (arr: ArrayItem[], target: number): SearchStep[] => {
    const steps: SearchStep[] = [];
    const workingArray = arr.map(item => ({ ...item, status: 'default' as const }));
    
    steps.push({
      array: [...workingArray],
      description: `Starting Linear Search for target value ${target}`,
    });
    
    for (let i = 0; i < workingArray.length; i++) {
      // Mark current element as checking
      const checkingArray = workingArray.map((item, index) => ({
        ...item,
        status: index === i ? 'checking' as const : 'default' as const
      }));
      
      steps.push({
        array: [...checkingArray],
        description: `Checking element at index ${i}: ${workingArray[i].value}`,
        currentIndex: i
      });
      
      if (workingArray[i].value === target) {
        // Found the target
        const foundArray = workingArray.map((item, index) => ({
          ...item,
          status: index === i ? 'found' as const : 'default' as const
        }));
        
        steps.push({
          array: [...foundArray],
          description: `Found target value ${target} at index ${i}!`,
          currentIndex: i,
          found: true
        });
        
        return steps;
      }
    }
    
    // Target not found
    const notFoundArray = workingArray.map(item => ({
      ...item,
      status: 'not-found' as const
    }));
    
    steps.push({
      array: [...notFoundArray],
      description: `Target value ${target} not found in the array`,
      found: false
    });
    
    return steps;
  };

  const startSearch = () => {
    const target = parseInt(targetValue);
    if (isNaN(target)) return;
    
    const steps = generateLinearSearchSteps(array, target);
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
    }));
    setArray(newArray);
    resetAnimation();
  };

  const handleCustomInput = () => {
    try {
      const values = customInput.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
      if (values.length > 0 && values.length <= 12) {
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
        }, 1500);
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
      case 'checking': return 'bg-yellow-500';
      case 'found': return 'bg-green-500';
      case 'not-found': return 'bg-red-300';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Linear Search Visualizer
            <span className="text-sm font-normal text-muted-foreground">O(n) Time Complexity</span>
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

          {/* Controls */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Button onClick={generateRandomArray} variant="outline" size="sm">
              <Shuffle className="h-4 w-4 mr-2" />
              Random Array
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

          {/* Color Legend */}
          <div className="bg-muted/20 p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Color Legend:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500"></div>
                <span>🔵 Default</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500"></div>
                <span>🟡 Checking</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500"></div>
                <span>🟢 Found</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-300"></div>
                <span>🔴 Not Found</span>
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
                  scale: item.status === 'checking' ? 1.1 : 1,
                  y: item.status === 'found' ? -5 : 0
                }}
              >
                <span className="absolute bottom-1">{item.value}</span>
                <span className="absolute -bottom-6 text-xs text-muted-foreground">{index}</span>
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
                <span className="font-mono">O(n)</span>
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
                <span className="font-mono">O(n)</span>
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
              <li>• Works on unsorted arrays</li>
              <li>• Simple implementation</li>
              <li>• Sequentially checks each element</li>
              <li>• Stops when target is found</li>
              <li>• Good for small datasets</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Learn More */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Learn More
            <ExternalLink className="h-4 w-4" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-2">
            <li>
              <a href="https://www.w3schools.com/algorithms/algorithm_search.asp" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                W3Schools - Linear Search
                <ExternalLink className="h-4 w-4" />
              </a>
            </li>
            <li>
              <a href="https://www.geeksforgeeks.org/linear-search/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                GeeksforGeeks - Linear Search
                <ExternalLink className="h-4 w-4" />
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default LinearSearchVisualizer;
