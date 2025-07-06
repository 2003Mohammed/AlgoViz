
import { useState, useRef, useEffect } from 'react';
import { ArrayItem, VisualizerStep, GraphData, TreeNode } from '../../types/visualizer';
import { useArrayOperations } from './useArrayOperations';
import { useGraphTreeOperations } from './useGraphTreeOperations';
import { useAnimationControls } from './useAnimationControls';
import { exportVisualizationData } from './utils';
import { VisualizerStateReturnType } from './types';

export function useVisualizerState(algorithmId: string): VisualizerStateReturnType {
  const [array, setArray] = useState<ArrayItem[]>([]);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [visualizationType, setVisualizationType] = useState<'array' | 'graph' | 'tree'>('array');
  const [totalSteps, setTotalSteps] = useState(0);
  const [activeLineIndex, setActiveLineIndex] = useState(-1);
  
  const animationRef = useRef<number | null>(null);
  const stepsRef = useRef<VisualizerStep[]>([]);
  
  // Animation controls (removed speed)
  const resetAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };
  
  const {
    isPlaying,
    currentStep,
    reset,
    togglePlayPause,
    stepForward,
    stepBackward,
    setCurrentStep,
    setIsPlaying
  } = useAnimationControls(
    totalSteps,
    stepsRef,
    setArray,
    setActiveLineIndex,
    animationRef
  );
  
  // Array operations
  const { 
    handleGenerateRandomArray,
    handleCustomArraySubmit
  } = useArrayOperations(
    algorithmId,
    setArray,
    setTotalSteps,
    setCurrentStep,
    setActiveLineIndex,
    stepsRef,
    resetAnimation
  );
  
  // Graph and tree operations
  const {
    handleGenerateRandomGraph,
    handleGenerateRandomTree
  } = useGraphTreeOperations(
    algorithmId,
    setGraphData,
    setTreeData,
    resetAnimation
  );
  
  // Export visualization
  const exportVisualization = () => {
    exportVisualizationData(algorithmId, stepsRef.current, currentStep);
  };
  
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
  }, [algorithmId]);
  
  // Animation effect with medium speed (1000ms interval)
  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        if (currentStep < totalSteps - 1) {
          stepForward();
        } else {
          setIsPlaying(false);
        }
      }, 1000); // Medium speed - 1 second per step
      
      return () => clearInterval(timer);
    }
  }, [isPlaying, currentStep, totalSteps, stepForward, setIsPlaying]);

  // Public API
  return {
    array,
    graphData,
    treeData,
    visualizationType,
    isPlaying,
    currentStep,
    totalSteps,
    activeLineIndex,
    handleGenerateRandomArray,
    handleGenerateRandomGraph,
    handleGenerateRandomTree,
    handleCustomArraySubmit,
    reset,
    togglePlayPause,
    stepForward,
    stepBackward,
    exportVisualization
  };
}
