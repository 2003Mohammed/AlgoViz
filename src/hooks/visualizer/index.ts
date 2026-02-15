import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrayItem, VisualizerStep, GraphData, TreeNode } from '../../types/visualizer';
import { useArrayOperations } from './useArrayOperations';
import { useGraphTreeOperations } from './useGraphTreeOperations';
import { useAnimationControls } from './useAnimationControls';
import { exportVisualizationData } from './utils';
import { VisualizerStateReturnType } from './types';


const getVisualizationType = (algorithmId: string): 'array' | 'graph' | 'tree' => {
  if (
    algorithmId.includes('graph') ||
    algorithmId.includes('path') ||
    algorithmId === 'bfs' ||
    algorithmId === 'dfs' ||
    algorithmId === 'dijkstra' ||
    algorithmId === 'astar'
  ) {
    return 'graph';
  }

  if (algorithmId.includes('tree')) {
    return 'tree';
  }

  return 'array';
};


export function useVisualizerState(algorithmId: string): VisualizerStateReturnType {
  const [array, setArray] = useState<ArrayItem[]>([]);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [visualizationType, setVisualizationType] = useState<'array' | 'graph' | 'tree'>(() => getVisualizationType(algorithmId));
  const [totalSteps, setTotalSteps] = useState(0);
  const [activeLineIndex, setActiveLineIndex] = useState(-1);

  const stepsRef = useRef<VisualizerStep[]>([]);

  const applyStep = useCallback(
    (step: VisualizerStep) => {
      if (step.array) {
        setArray(step.array);
      }
      if (step.graphData) {
        setGraphData(step.graphData);
      }
      if (step.treeData) {
        setTreeData(step.treeData);
      }
      setActiveLineIndex(step.lineIndex ?? -1);
    },
    []
  );

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
    setCurrentStep,
  } = useAnimationControls(totalSteps, stepsRef, applyStep);

  const {
    handleGenerateRandomArray,
    handleCustomArraySubmit,
  } = useArrayOperations(
    algorithmId,
    setArray,
    setTotalSteps,
    setCurrentStep,
    setActiveLineIndex,
    stepsRef,
    reset
  );

  const {
    handleGenerateRandomGraph,
    handleGenerateRandomTree,
  } = useGraphTreeOperations(
    algorithmId,
    setGraphData,
    setTreeData,
    reset,
    setTotalSteps,
    setCurrentStep,
    setActiveLineIndex,
    stepsRef,
    setArray
  );

  const exportVisualization = () => {
    exportVisualizationData(algorithmId, stepsRef.current, currentStep);
  };

  useEffect(() => {
    const nextType = getVisualizationType(algorithmId);
    setVisualizationType(nextType);

    if (nextType === 'array') {
      handleGenerateRandomArray(algorithmId.includes('binary-search'));
    } else if (nextType === 'graph') {
      handleGenerateRandomGraph();
    } else {
      handleGenerateRandomTree();
    }
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
    exportVisualization,
  };
}
