
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
  
  // Animation controls
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
    jumpToStart,
    jumpToEnd,
    speed,
    setSpeed,
    setCurrentStep
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
    if (algorithmId.includes('sort')) {
      setVisualizationType('array');
      handleGenerateRandomArray();
    } else if (algorithmId.includes('search')) {
      setVisualizationType('array');
      handleGenerateRandomArray(true);
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

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [algorithmId]);
  
  return {
    array,
    graphData,
    treeData,
    visualizationType,
    isPlaying,
    currentStep,
    totalSteps,
    activeLineIndex,
    speed,
    setSpeed,
    handleGenerateRandomArray,
    handleGenerateRandomGraph,
    handleGenerateRandomTree,
    handleCustomArraySubmit,
    reset,
    togglePlayPause,
    stepForward,
    stepBackward,
    jumpToStart,
    jumpToEnd,
    exportVisualization
  };
}
