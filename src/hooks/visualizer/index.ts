
import { useState, useCallback } from 'react';
import { ArrayItem } from '../../types/visualizer';

export const useVisualizerState = (algorithmId: string) => {
  const [array, setArray] = useState<ArrayItem[]>([
    { value: 64, status: 'default' },
    { value: 34, status: 'default' },
    { value: 25, status: 'default' },
    { value: 12, status: 'default' },
    { value: 22, status: 'default' },
    { value: 11, status: 'default' },
    { value: 90, status: 'default' }
  ]);
  
  const [graphData, setGraphData] = useState(null);
  const [treeData, setTreeData] = useState(null);
  const [visualizationType] = useState<'array' | 'graph' | 'tree'>('array');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(1);
  const [activeLineIndex, setActiveLineIndex] = useState(0);

  const handleGenerateRandomArray = useCallback(() => {
    const newArray = Array.from({ length: 7 }, () => ({
      value: Math.floor(Math.random() * 100) + 1,
      status: 'default' as const
    }));
    setArray(newArray);
  }, []);

  const handleGenerateRandomGraph = useCallback(() => {
    console.log('Generate random graph');
  }, []);

  const handleGenerateRandomTree = useCallback(() => {
    console.log('Generate random tree');
  }, []);

  const handleCustomArraySubmit = useCallback((customArray: number[]) => {
    const newArray = customArray.map(value => ({
      value,
      status: 'default' as const
    }));
    setArray(newArray);
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
    setActiveLineIndex(0);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const stepForward = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, totalSteps]);

  const stepBackward = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const exportVisualization = useCallback(() => {
    console.log('Export visualization');
  }, []);

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
};
