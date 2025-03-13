
import { useState, useRef, useEffect } from 'react';
import { ArrayItem, VisualizerStep, GraphData, TreeNode } from '../types/visualizer';
import { generateRandomArray, generateRandomGraph, generateRandomTree } from '../utils/visualizerUtils';
import { getVisualizationSteps } from '../utils/algorithms/visualizations';
import { toast } from './use-toast';

export function useVisualizerState(algorithmId: string) {
  const [array, setArray] = useState<ArrayItem[]>([]);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [visualizationType, setVisualizationType] = useState<'array' | 'graph' | 'tree'>('array');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [activeLineIndex, setActiveLineIndex] = useState(-1);
  
  const animationRef = useRef<number | null>(null);
  const stepsRef = useRef<VisualizerStep[]>([]);
  
  // Initialize visualization when component mounts or algorithm changes
  useEffect(() => {
    // Determine visualization type based on algorithm
    if (algorithmId.includes('sort')) {
      setVisualizationType('array');
      handleGenerateRandomArray();
    } else if (algorithmId.includes('search')) {
      setVisualizationType('array');
      handleGenerateRandomArray(true); // Generate sorted array for search algorithms
    } else if (algorithmId.includes('graph') || algorithmId.includes('path')) {
      setVisualizationType('graph');
      handleGenerateRandomGraph();
    } else if (algorithmId.includes('tree')) {
      setVisualizationType('tree');
      handleGenerateRandomTree();
    } else {
      setVisualizationType('array');
      handleGenerateRandomArray();
    }
    
    // Cleanup on unmount or algorithm change
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [algorithmId]); // Re-initialize when algorithm changes
  
  const handleGenerateRandomArray = (sorted = false) => {
    try {
      const newArray = generateRandomArray(sorted);
      setArray(newArray);
      reset();
      
      // Generate visualization steps
      const visualizationSteps = getVisualizationSteps(algorithmId, newArray);
      stepsRef.current = visualizationSteps;
      setTotalSteps(visualizationSteps.length);
      
      // Set the initial state from the first step
      if (visualizationSteps.length > 0) {
        setArray(visualizationSteps[0].array);
        setActiveLineIndex(visualizationSteps[0].lineIndex);
      }
      
      toast({
        title: "Example array generated",
        description: `Ready to visualize ${algorithmId}`,
      });
    } catch (error) {
      console.error("Error generating array:", error);
      toast({
        title: "Error",
        description: "Failed to generate example array",
        variant: "destructive",
      });
    }
  };
  
  const handleGenerateRandomGraph = () => {
    try {
      const newGraph = generateRandomGraph();
      setGraphData(newGraph);
      reset();
      
      toast({
        title: "Example graph generated",
        description: `Ready to visualize ${algorithmId}`,
      });
    } catch (error) {
      console.error("Error generating graph:", error);
      toast({
        title: "Error",
        description: "Failed to generate example graph",
        variant: "destructive",
      });
    }
  };
  
  const handleGenerateRandomTree = () => {
    try {
      const newTree = generateRandomTree();
      setTreeData(newTree);
      reset();
      
      toast({
        title: "Example tree generated",
        description: `Ready to visualize ${algorithmId}`,
      });
    } catch (error) {
      console.error("Error generating tree:", error);
      toast({
        title: "Error",
        description: "Failed to generate example tree",
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
      
      return true; // Successfully stepped forward
    } else {
      setIsPlaying(false);
      toast({
        title: "End of visualization",
        description: "Reached the final step of the algorithm",
      });
      return false; // Could not step forward (end reached)
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
      
      return true; // Successfully stepped backward
    }
    return false; // Could not step backward (beginning reached)
  };
  
  const changeSpeed = (newSpeed: number) => {
    setSpeed(newSpeed);
    toast({
      title: `Speed: ${newSpeed}x`,
      description: newSpeed > 1 ? "Faster animation" : "Slower animation",
    });
  };
  
  const exportVisualization = () => {
    try {
      const visualizationData = {
        algorithm: algorithmId,
        steps: stepsRef.current,
        currentStep: currentStep
      };
      
      const blob = new Blob([JSON.stringify(visualizationData)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${algorithmId}-visualization.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Visualization exported",
        description: "You can save this file and import it later",
      });
    } catch (error) {
      console.error("Error exporting visualization:", error);
      toast({
        title: "Export failed",
        description: "Could not export the visualization",
        variant: "destructive",
      });
    }
  };
  
  // Animation effect - optimized with requestAnimationFrame
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

  // Public API
  return {
    array,
    graphData,
    treeData,
    visualizationType,
    isPlaying,
    currentStep,
    totalSteps,
    speed,
    activeLineIndex,
    handleGenerateRandomArray,
    handleGenerateRandomGraph,
    handleGenerateRandomTree,
    handleCustomArraySubmit: (inputArray: number[]) => {
      try {
        const newArray = inputArray.map(value => ({
          value,
          status: 'default' as const
        }));
        
        setArray(newArray);
        reset();
        
        // Generate visualization steps for the custom array
        const visualizationSteps = getVisualizationSteps(algorithmId, newArray);
        stepsRef.current = visualizationSteps;
        setTotalSteps(visualizationSteps.length);
        
        // Set the initial state from the first step
        if (visualizationSteps.length > 0) {
          setArray(visualizationSteps[0].array);
          setActiveLineIndex(visualizationSteps[0].lineIndex);
        }
        
        toast({
          title: "Custom array loaded",
          description: `Ready to visualize ${algorithmId}`,
        });
      } catch (error) {
        console.error("Error processing custom array:", error);
        toast({
          title: "Error",
          description: "Failed to process custom array",
          variant: "destructive",
        });
      }
    },
    reset,
    togglePlayPause,
    stepForward,
    stepBackward,
    changeSpeed,
    exportVisualization
  };
}
