
import React, { useState, useEffect, useRef } from 'react';
import { VisualizerControls } from './VisualizerControls';
import { CodeHighlighter } from './CodeHighlighter';
import { Button } from './ui/button';
import { RefreshCw } from 'lucide-react';
import { ArrayItem, VisualizerProps, VisualizerStep } from '../types/visualizer';
import { generateRandomArray } from '../utils/visualizerUtils';
import { ArrayVisualizer } from './visualizer/ArrayVisualizer';
import { CustomArrayInput } from './visualizer/CustomArrayInput';
import { AlgorithmAnalysis } from './visualizer/AlgorithmAnalysis';
import { getVisualizationSteps } from '../utils/algorithms/visualizations';
import { toast } from '../hooks/use-toast';

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
  }, [algorithm.id]); // Re-initialize when algorithm changes
  
  const handleGenerateRandomArray = () => {
    try {
      const newArray = generateRandomArray();
      setArray(newArray);
      reset();
      
      // Generate real visualization steps
      const visualizationSteps = getVisualizationSteps(algorithm.id, newArray);
      stepsRef.current = visualizationSteps;
      setTotalSteps(visualizationSteps.length);
      
      toast({
        title: "New array generated",
        description: `Ready to visualize ${algorithm.name}`,
      });
    } catch (error) {
      console.error("Error generating array:", error);
      toast({
        title: "Error",
        description: "Failed to generate new array",
        variant: "destructive",
      });
    }
  };
  
  const handleCustomArraySubmit = (inputArray: number[]) => {
    try {
      const newArray = inputArray.map(value => ({
        value,
        status: 'default' as const
      }));
      
      setArray(newArray);
      reset();
      
      // Generate real visualization steps for the custom array
      const visualizationSteps = getVisualizationSteps(algorithm.id, newArray);
      stepsRef.current = visualizationSteps;
      setTotalSteps(visualizationSteps.length);
      
      toast({
        title: "Custom array loaded",
        description: `Ready to visualize ${algorithm.name}`,
      });
    } catch (error) {
      console.error("Error processing custom array:", error);
      toast({
        title: "Error",
        description: "Failed to process custom array",
        variant: "destructive",
      });
    }
  };
  
  const reset = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsPlaying(false);
    setCurrentStep(0);
    setActiveLineIndex(-1);
    
    // Reset array to initial state if steps are available
    if (stepsRef.current.length > 0) {
      setArray(stepsRef.current[0].array);
    }
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
