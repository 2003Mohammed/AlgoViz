
import React, { useState, useEffect, useRef } from 'react';
import { VisualizerControls } from './VisualizerControls';
import { CodeHighlighter } from './CodeHighlighter';
import { Algorithm } from '../utils/algorithmData';
import { Button } from './ui/button';
import { RefreshCw } from 'lucide-react';
import { ArrayItem, VisualizerProps, VisualizerStep } from '../types/visualizer';
import { generateRandomArray, generateMockSteps } from '../utils/visualizerUtils';
import { ArrayVisualizer } from './visualizer/ArrayVisualizer';
import { CustomArrayInput } from './visualizer/CustomArrayInput';
import { AlgorithmAnalysis } from './visualizer/AlgorithmAnalysis';

export const Visualizer: React.FC<VisualizerProps> = ({ algorithm }) => {
  const [array, setArray] = useState<ArrayItem[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [activeLineIndex, setActiveLineIndex] = useState(-1);
  
  const animationRef = useRef<number | null>(null);
  const stepsRef = useRef<VisualizerStep[]>([]);
  
  useEffect(() => {
    handleGenerateRandomArray();
  }, []);
  
  const handleGenerateRandomArray = () => {
    const newArray = generateRandomArray();
    setArray(newArray);
    reset();
    
    const pseudoCodeLines = algorithm.pseudocode?.length || 0;
    const mockSteps = generateMockSteps(newArray, pseudoCodeLines);
    stepsRef.current = mockSteps;
    setTotalSteps(mockSteps.length);
  };
  
  const handleCustomArraySubmit = (inputArray: number[]) => {
    const newArray = inputArray.map(value => ({
      value,
      status: 'default' as const
    }));
    
    setArray(newArray);
    reset();
    
    const pseudoCodeLines = algorithm.pseudocode?.length || 0;
    const mockSteps = generateMockSteps(newArray, pseudoCodeLines);
    stepsRef.current = mockSteps;
    setTotalSteps(mockSteps.length);
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
  
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">{algorithm.name} Visualization</h3>
          <div className="flex gap-2">
            <Button 
              onClick={handleGenerateRandomArray}
              variant="secondary"
              size="sm"
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              New Array
            </Button>
          </div>
        </div>
        
        <CustomArrayInput onSubmit={handleCustomArraySubmit} />
        
        <ArrayVisualizer array={array} />
        
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
      
      <AlgorithmAnalysis algorithm={algorithm} />
    </div>
  );
};
