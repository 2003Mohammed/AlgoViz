
import React, { useState, useEffect, useRef } from 'react';
import { VisualizerControls } from './VisualizerControls';
import { CodeHighlighter } from './CodeHighlighter';
import { Algorithm } from '../utils/algorithmData';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { RefreshCw } from 'lucide-react';

interface VisualizerProps {
  algorithm: Algorithm;
}

interface ArrayItem {
  value: number;
  status: 'default' | 'comparing' | 'sorted' | 'pivot' | 'current';
}

export const Visualizer: React.FC<VisualizerProps> = ({ algorithm }) => {
  const [array, setArray] = useState<ArrayItem[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [activeLineIndex, setActiveLineIndex] = useState(-1);
  const [userInput, setUserInput] = useState<string>('');
  
  const animationRef = useRef<number | null>(null);
  const stepsRef = useRef<any[]>([]);
  
  useEffect(() => {
    generateRandomArray();
  }, []);
  
  const generateRandomArray = () => {
    const size = 15;
    const newArray = Array.from({ length: size }, () => ({
      value: Math.floor(Math.random() * 100) + 5,
      status: 'default' as const
    }));
    
    setArray(newArray);
    reset();
    
    // If this was a real implementation, we would compute all the steps
    // of the algorithm here and store them in stepsRef.current
    const mockSteps = generateMockSteps(newArray);
    stepsRef.current = mockSteps;
    setTotalSteps(mockSteps.length);
  };
  
  const handleUserArraySubmit = () => {
    try {
      // Parse user input as an array of numbers
      const inputArray = userInput
        .split(',')
        .map(item => item.trim())
        .filter(item => item !== '')
        .map(item => {
          const num = Number(item);
          if (isNaN(num)) {
            throw new Error(`Invalid input: "${item}" is not a number`);
          }
          return num;
        });
      
      if (inputArray.length === 0) {
        throw new Error('Please enter at least one number');
      }
      
      if (inputArray.length > 30) {
        throw new Error('Maximum array size is 30 elements');
      }
      
      const newArray = inputArray.map(value => ({
        value,
        status: 'default' as const
      }));
      
      setArray(newArray);
      reset();
      
      // Generate steps for the new array
      const mockSteps = generateMockSteps(newArray);
      stepsRef.current = mockSteps;
      setTotalSteps(mockSteps.length);
      
      setUserInput('');
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Invalid input');
    }
  };
  
  // This is just a mock function to simulate algorithm steps
  const generateMockSteps = (initialArray: ArrayItem[]) => {
    const steps = [];
    const pseudoCodeLines = algorithm.pseudocode?.length || 0;
    
    // For demo purposes, we'll just create some random visualizations
    // In a real implementation, we would compute the actual algorithm steps
    for (let i = 0; i < 20; i++) {
      const modifiedArray = [...initialArray].map((item, index) => {
        if (i % 5 === 0 && index === i % initialArray.length) {
          return { ...item, status: 'comparing' };
        }
        if (i % 7 === 0 && index === (i + 1) % initialArray.length) {
          return { ...item, status: 'current' };
        }
        if (i % 3 === 0 && index < i / 2) {
          return { ...item, status: 'sorted' };
        }
        if (i % 9 === 0 && index === Math.floor(initialArray.length / 2)) {
          return { ...item, status: 'pivot' };
        }
        return { ...item, status: 'default' };
      });
      
      steps.push({
        array: modifiedArray,
        lineIndex: i % pseudoCodeLines
      });
    }
    
    return steps;
  };
  
  const reset = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsPlaying(false);
    setCurrentStep(0);
    setActiveLineIndex(-1);
  };
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const stepForward = () => {
    if (currentStep < totalSteps - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      const step = stepsRef.current[nextStep];
      if (step) {
        setArray(step.array);
        setActiveLineIndex(step.lineIndex);
      }
    } else {
      setIsPlaying(false);
    }
  };
  
  const stepBackward = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      
      const step = stepsRef.current[prevStep];
      if (step) {
        setArray(step.array);
        setActiveLineIndex(step.lineIndex);
      }
    }
  };
  
  const changeSpeed = (newSpeed: number) => {
    setSpeed(newSpeed);
  };
  
  // Animation loop
  useEffect(() => {
    if (isPlaying) {
      let lastTime = 0;
      const interval = 1000 / speed;
      
      const animate = (timestamp: number) => {
        if (!lastTime || timestamp - lastTime >= interval) {
          lastTime = timestamp;
          
          if (currentStep < totalSteps - 1) {
            stepForward();
          } else {
            setIsPlaying(false);
            return;
          }
        }
        
        if (isPlaying) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isPlaying, currentStep, speed, totalSteps]);
  
  const getStatusColor = (status: ArrayItem['status']) => {
    switch (status) {
      case 'comparing': return 'bg-yellow-500';
      case 'sorted': return 'bg-green-500';
      case 'pivot': return 'bg-purple-500';
      case 'current': return 'bg-primary';
      default: return 'bg-gray-300';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">{algorithm.name} Visualization</h3>
          <div className="flex gap-2">
            <Button 
              onClick={generateRandomArray}
              variant="secondary"
              size="sm"
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              New Array
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <Input
              placeholder="Enter numbers separated by commas (e.g., 5, 3, 8, 1, 9)"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={handleUserArraySubmit} className="whitespace-nowrap">
              Use Custom Array
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter your own dataset to visualize how the algorithm works on specific inputs.
          </p>
        </div>
        
        <div className="relative h-64 flex items-end justify-center gap-1 mb-6">
          {array.map((item, index) => (
            <div
              key={index}
              className={`w-8 rounded-t-md ${getStatusColor(item.status)} transition-all duration-300`}
              style={{ height: `${(item.value / 100) * 80}%` }}
            >
              <div className="text-xs mt-2 text-center">{item.value}</div>
            </div>
          ))}
        </div>
        
        <VisualizerControls
          isPlaying={isPlaying}
          onPlayPause={togglePlayPause}
          onReset={reset}
          onStepForward={stepForward}
          onStepBackward={stepBackward}
          onSpeedChange={changeSpeed}
          currentSpeed={speed}
          disableBackward={currentStep === 0}
          disableForward={currentStep === totalSteps - 1}
        />
        
        <div className="mt-6 text-sm text-center text-muted-foreground">
          Step {currentStep + 1} of {totalSteps}
        </div>
      </div>
      
      {algorithm.pseudocode && (
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-4">Pseudocode</h3>
          <CodeHighlighter 
            code={algorithm.pseudocode} 
            activeLineIndex={activeLineIndex}
          />
        </div>
      )}
      
      {algorithm.implementation && (
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-4">Implementation</h3>
          <CodeHighlighter 
            code={algorithm.implementation.split('\n')} 
          />
        </div>
      )}
      
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold mb-4">Algorithm Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium mb-2">Time Complexity</h4>
            <ul className="space-y-2">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Best:</span>
                <span className="font-mono">{algorithm.timeComplexity.best}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Average:</span>
                <span className="font-mono">{algorithm.timeComplexity.average}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Worst:</span>
                <span className="font-mono">{algorithm.timeComplexity.worst}</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-medium mb-2">Space Complexity</h4>
            <div className="font-mono">{algorithm.spaceComplexity}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
