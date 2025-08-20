
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Play, Pause, SkipForward, RotateCcw, Shuffle, ExternalLink, Gauge } from 'lucide-react';
import { motion } from 'framer-motion';
import { Slider } from '../ui/slider';

interface ArrayItem {
  value: number;
  status: 'default' | 'comparing' | 'swapping' | 'sorted';
}

interface AnimationStep {
  array: ArrayItem[];
  description: string;
}

const BubbleSortVisualizer: React.FC = () => {
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
  const [animationSpeed, setAnimationSpeed] = useState([1]);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generateBubbleSortSteps = (arr: ArrayItem[]): AnimationStep[] => {
    const steps: AnimationStep[] = [];
    const workingArray = [...arr];
    const n = workingArray.length;
    
    steps.push({
      array: [...workingArray],
      description: 'Starting Bubble Sort algorithm'
    });
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Show comparison
        const compareStep = workingArray.map((item, index) => ({
          ...item,
          status: (index === j || index === j + 1) ? 'comparing' as const : item.status
        }));
        steps.push({
          array: [...compareStep],
          description: `Comparing elements at index ${j} (${workingArray[j].value}) and ${j + 1} (${workingArray[j + 1].value})`
        });
        
        if (workingArray[j].value > workingArray[j + 1].value) {
          // Show swap
          const swapStep = workingArray.map((item, index) => ({
            ...item,
            status: (index === j || index === j + 1) ? 'swapping' as const : item.status
          }));
          steps.push({
            array: [...swapStep],
            description: `Swapping ${workingArray[j].value} and ${workingArray[j + 1].value}`
          });
          
          // Perform swap
          [workingArray[j], workingArray[j + 1]] = [workingArray[j + 1], workingArray[j]];
          
          // Show after swap
          steps.push({
            array: [...workingArray],
            description: `Swapped successfully`
          });
        } else {
          steps.push({
            array: [...workingArray],
            description: `No swap needed - elements are in correct order`
          });
        }
        
        // Reset comparison status
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
        description: `Element ${workingArray[n - i - 1].value} is now in its correct position`
      });
    }
    
    // Mark all as sorted
    workingArray[0].status = 'sorted';
    steps.push({
      array: [...workingArray],
      description: 'Bubble Sort completed! All elements are now sorted.'
    });
    
    return steps;
  };

  const startAnimation = () => {
    if (animationSteps.length === 0) {
      const steps = generateBubbleSortSteps(array);
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
          const nextStep = animationSteps[currentStep + 1];
          setArray(nextStep.array);
          setCurrentDescription(nextStep.description);
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
  }, [isAnimating, currentStep, animationSteps, animationSpeed]);

  const getBarColor = (status: ArrayItem['status']) => {
    switch (status) {
      case 'comparing': return 'bg-yellow-500';
      case 'swapping': return 'bg-red-500';
      case 'sorted': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Bubble Sort Visualizer
            <span className="text-sm font-normal text-muted-foreground">O(n²) Time Complexity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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

          {/* Color Legend */}
          <div className="bg-muted/20 p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Color Legend:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500"></div>
                <span>🔵 Unsorted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500"></div>
                <span>🟡 Comparing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500"></div>
                <span>🔴 Swapping</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500"></div>
                <span>🟢 Sorted</span>
              </div>
            </div>
          </div>

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

          {/* Speed Control */}
          <div className="space-y-3 p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Animation Speed</span>
            </div>
            <div className="flex items-center gap-4">
              <Slider value={animationSpeed} onValueChange={setAnimationSpeed} min={0.25} max={3} step={0.25} className="flex-1" />
              <span className="text-sm text-muted-foreground min-w-[60px]">{animationSpeed[0]}s</span>
            </div>
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
                <span className="font-mono">O(n)</span>
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
              <li>• Educational purposes and algorithm learning</li>
              <li>• Small datasets where simplicity matters</li>
              <li>• Nearly sorted data (best case O(n))</li>
              <li>• Embedded systems with memory constraints</li>
            </ul>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="https://www.w3schools.com/dsa/index.php" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  W3Schools
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="https://www.geeksforgeeks.org/bubble-sort/" target="_blank" rel="noopener noreferrer">
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

export default BubbleSortVisualizer;
