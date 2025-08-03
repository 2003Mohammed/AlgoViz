import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Shuffle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface ArrayItem {
  value: number;
  status: 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'final';
}

interface AnimationStep {
  array: ArrayItem[];
  description: string;
  pivotIndex?: number;
}

interface EnhancedSortingVisualizerProps {
  algorithmName: string;
  algorithm: 'bubble-sort' | 'quick-sort' | 'merge-sort' | 'insertion-sort' | 'selection-sort';
  timeComplexity: { best: string; average: string; worst: string; space: string };
  description: string;
}

const EnhancedSortingVisualizer: React.FC<EnhancedSortingVisualizerProps> = ({
  algorithmName,
  algorithm,
  timeComplexity,
  description
}) => {
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
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [currentDescription, setCurrentDescription] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [speed, setSpeed] = useState(1);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generateSteps = (arr: ArrayItem[], sortType: string): AnimationStep[] => {
    const steps: AnimationStep[] = [];
    const workingArray = [...arr];
    const n = workingArray.length;
    
    steps.push({
      array: [...workingArray],
      description: `Starting ${algorithmName}`
    });

    switch (sortType) {
      case 'bubble-sort':
        for (let i = 0; i < n - 1; i++) {
          for (let j = 0; j < n - i - 1; j++) {
            // Comparing
            const compareStep = workingArray.map((item, index) => ({
              ...item,
              status: (index === j || index === j + 1) ? 'comparing' as const : item.status
            }));
            steps.push({
              array: [...compareStep],
              description: `🔍 Comparing ${workingArray[j].value} and ${workingArray[j + 1].value}`
            });
            
            if (workingArray[j].value > workingArray[j + 1].value) {
              // Swapping
              const swapStep = workingArray.map((item, index) => ({
                ...item,
                status: (index === j || index === j + 1) ? 'swapping' as const : item.status
              }));
              steps.push({
                array: [...swapStep],
                description: `🔁 Swapping ${workingArray[j].value} and ${workingArray[j + 1].value}`
              });
              
              [workingArray[j], workingArray[j + 1]] = [workingArray[j + 1], workingArray[j]];
            }
            
            // Reset status
            workingArray.forEach(item => {
              if (item.status === 'comparing' || item.status === 'swapping') {
                item.status = 'default';
              }
            });
          }
          
          // Mark as sorted
          workingArray[n - i - 1].status = 'sorted';
          steps.push({
            array: [...workingArray],
            description: `✅ Element ${workingArray[n - i - 1].value} is in correct position`
          });
        }
        break;

      case 'quick-sort':
        const quickSort = (low: number, high: number) => {
          if (low < high) {
            const pi = partition(low, high);
            quickSort(low, pi - 1);
            quickSort(pi + 1, high);
          }
        };

        const partition = (low: number, high: number): number => {
          const pivot = workingArray[high];
          let i = low - 1;
          
          workingArray[high].status = 'pivot';
          steps.push({
            array: [...workingArray],
            pivotIndex: high,
            description: `🎯 Selected ${pivot.value} as pivot`
          });
          
          for (let j = low; j < high; j++) {
            workingArray[j].status = 'comparing';
            steps.push({
              array: [...workingArray],
              pivotIndex: high,
              description: `🔍 Comparing ${workingArray[j].value} with pivot ${pivot.value}`
            });
            
            if (workingArray[j].value <= pivot.value) {
              i++;
              if (i !== j) {
                workingArray[i].status = 'swapping';
                workingArray[j].status = 'swapping';
                steps.push({
                  array: [...workingArray],
                  description: `🔁 Swapping ${workingArray[j].value} and ${workingArray[i].value}`
                });
                
                [workingArray[i], workingArray[j]] = [workingArray[j], workingArray[i]];
              }
            }
            
            workingArray[j].status = 'default';
            if (i >= 0) workingArray[i].status = 'default';
          }
          
          [workingArray[i + 1], workingArray[high]] = [workingArray[high], workingArray[i + 1]];
          workingArray[i + 1].status = 'sorted';
          
          steps.push({
            array: [...workingArray],
            description: `✅ Pivot ${workingArray[i + 1].value} placed correctly`
          });
          
          return i + 1;
        };

        quickSort(0, n - 1);
        break;

      case 'selection-sort':
        for (let i = 0; i < n - 1; i++) {
          let minIdx = i;
          workingArray[i].status = 'comparing';
          
          for (let j = i + 1; j < n; j++) {
            workingArray[j].status = 'comparing';
            steps.push({
              array: [...workingArray],
              description: `🔍 Comparing ${workingArray[j].value} with current minimum ${workingArray[minIdx].value}`
            });
            
            if (workingArray[j].value < workingArray[minIdx].value) {
              if (minIdx !== i) workingArray[minIdx].status = 'default';
              minIdx = j;
              workingArray[minIdx].status = 'pivot';
              steps.push({
                array: [...workingArray],
                description: `🎯 New minimum found: ${workingArray[minIdx].value}`
              });
            } else {
              workingArray[j].status = 'default';
            }
          }
          
          if (minIdx !== i) {
            workingArray[i].status = 'swapping';
            workingArray[minIdx].status = 'swapping';
            steps.push({
              array: [...workingArray],
              description: `🔁 Swapping ${workingArray[i].value} and ${workingArray[minIdx].value}`
            });
            
            [workingArray[i], workingArray[minIdx]] = [workingArray[minIdx], workingArray[i]];
          }
          
          workingArray[i].status = 'sorted';
          steps.push({
            array: [...workingArray],
            description: `✅ Position ${i} sorted with value ${workingArray[i].value}`
          });
        }
        break;

      default:
        break;
    }
    
    // Final state
    workingArray.forEach(item => item.status = 'final');
    steps.push({
      array: [...workingArray],
      description: `💡 ${algorithmName} completed! Array is now sorted.`
    });
    
    return steps;
  };

  const startAnimation = () => {
    if (animationSteps.length === 0) {
      const steps = generateSteps(array, algorithm);
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
    setCurrentDescription('');
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    setArray(prev => prev.map(item => ({ ...item, status: 'default' as const })));
  };

  const stepForward = () => {
    if (currentStep < animationSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      const nextStep = animationSteps[currentStep + 1];
      setArray(nextStep.array);
      setCurrentDescription(nextStep.description);
    }
  };

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      const prevStep = animationSteps[currentStep - 1];
      setArray(prevStep.array);
      setCurrentDescription(prevStep.description);
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
    if (isAnimating && animationSteps.length > 0) {
      if (currentStep < animationSteps.length - 1) {
        animationRef.current = setTimeout(() => {
          setCurrentStep(prev => prev + 1);
          const nextStep = animationSteps[currentStep + 1];
          setArray(nextStep.array);
          setCurrentDescription(nextStep.description);
        }, 1500 / speed);
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
      case 'comparing': return 'bg-yellow-500'; // 🔍 Currently Comparing
      case 'swapping': return 'bg-orange-500'; // 🔁 Swapping
      case 'pivot': return 'bg-purple-500'; // 🎯 Pivot
      case 'sorted': return 'bg-green-500'; // ✅ Sorted
      case 'final': return 'bg-blue-500'; // 💡 Final Result
      default: return 'bg-gray-400';
    }
  };

  const getAlgorithmLinks = () => {
    const baseUrls = {
      mdn: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort',
      geeksforgeeks: `https://www.geeksforgeeks.org/${algorithm}/`,
      w3schools: 'https://www.w3schools.com/js/js_array_sort.asp'
    };
    
    return baseUrls;
  };

  const links = getAlgorithmLinks();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {algorithmName} Visualizer
            <span className="text-sm font-normal text-muted-foreground">{timeComplexity.average} Average</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Custom Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter numbers (comma separated, max 12)"
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
            <Button onClick={stepBackward} variant="outline" size="sm" disabled={currentStep <= 0}>
              <SkipBack className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button 
              onClick={isAnimating ? pauseAnimation : startAnimation} 
              size="sm"
            >
              {isAnimating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isAnimating ? 'Pause' : 'Start'}
            </Button>
            <Button onClick={stepForward} variant="outline" size="sm" disabled={currentStep >= animationSteps.length - 1}>
              <SkipForward className="h-4 w-4 mr-2" />
              Next
            </Button>
            <Button onClick={resetAnimation} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Color Legend */}
          <div className="bg-muted/20 p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Color Legend:</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400"></div>
                <span>Unsorted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500"></div>
                <span>🔍 Comparing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500"></div>
                <span>🔁 Swapping</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500"></div>
                <span>🎯 Pivot</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500"></div>
                <span>✅ Sorted</span>
              </div>
            </div>
          </div>

          {/* Step Description */}
          {currentDescription && (
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-foreground text-sm">
              <strong>Step:</strong> {currentDescription}
            </div>
          )}

          {/* Array Visualization */}
          <div className="bg-muted/20 p-6 rounded-lg min-h-[200px] flex items-end justify-center gap-2">
            {array.map((item, index) => (
              <motion.div
                key={`${index}-${item.value}`}
                className={`${getBarColor(item.status)} text-white text-sm font-bold flex items-end justify-center relative transition-all duration-300`}
                style={{ 
                  height: `${(item.value / 100) * 150 + 30}px`,
                  width: '50px'
                }}
                animate={{ 
                  scale: item.status === 'swapping' ? 1.1 : 1,
                  y: item.status === 'swapping' ? -5 : 0
                }}
              >
                <span className="absolute bottom-1">{item.value}</span>
              </motion.div>
            ))}
          </div>

          {/* Speed Control */}
          <div className="flex items-center gap-2 justify-center">
            <span className="text-sm text-muted-foreground">Speed:</span>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.5"
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
                <span className="font-mono">{timeComplexity.best}</span>
              </div>
              <div className="flex justify-between">
                <span>Average Case:</span>
                <span className="font-mono">{timeComplexity.average}</span>
              </div>
              <div className="flex justify-between">
                <span>Worst Case:</span>
                <span className="font-mono">{timeComplexity.worst}</span>
              </div>
              <div className="flex justify-between">
                <span>Space Complexity:</span>
                <span className="font-mono">{timeComplexity.space}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>References & Learn More</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href={links.mdn} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  MDN Docs
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={links.geeksforgeeks} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  GeeksforGeeks
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={links.w3schools} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  W3Schools
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedSortingVisualizer;