import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrayItem, VisualizerStep, GraphData, TreeNode } from '../../types/visualizer';
import { useArrayOperations } from './useArrayOperations';
import { useGraphTreeOperations } from './useGraphTreeOperations';
import { useAnimationControls } from './useAnimationControls';
import { exportVisualizationData } from './utils';
import { VisualizerStateReturnType } from './types';
import { generateVisualizationSteps } from '../../utils/visualizations';

const getVisualizationType = (algorithmId: string): 'array' | 'graph' | 'tree' => {
  if (algorithmId.includes('graph') || algorithmId.includes('path') || ['bfs', 'dfs', 'dijkstra', 'astar'].includes(algorithmId)) return 'graph';
  if (algorithmId.includes('tree')) return 'tree';
  return 'array';
};

export function useVisualizerState(algorithmId: string): VisualizerStateReturnType {
  const [array, setArray] = useState<ArrayItem[]>([]);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [visualizationType, setVisualizationType] = useState<'array' | 'graph' | 'tree'>(() => getVisualizationType(algorithmId));
  const [totalSteps, setTotalSteps] = useState(0);
  const [activeLineIndex, setActiveLineIndex] = useState(-1);
  const [searchTarget, setSearchTarget] = useState('');
  const [graphStartNode, setGraphStartNode] = useState('');

  const stepsRef = useRef<VisualizerStep[]>([]);

  const applyStep = useCallback((step: VisualizerStep) => {
    if (step.array) setArray(step.array);
    if (step.graphData) setGraphData(step.graphData);
    if (step.treeData) setTreeData(step.treeData);
    setActiveLineIndex(step.lineIndex ?? -1);
  }, []);

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

  const { handleGenerateRandomArray, handleCustomArraySubmit } = useArrayOperations(
    algorithmId,
    setArray,
    setTotalSteps,
    setCurrentStep,
    setActiveLineIndex,
    stepsRef,
    reset,
    searchTarget
  );

  const { handleGenerateRandomGraph, handleGenerateRandomTree } = useGraphTreeOperations(
    algorithmId,
    setGraphData,
    setTreeData,
    reset,
    setTotalSteps,
    setCurrentStep,
    setActiveLineIndex,
    stepsRef,
    setArray,
    graphStartNode
  );

  useEffect(() => {
    const nextType = getVisualizationType(algorithmId);
    setVisualizationType(nextType);

    if (nextType === 'array') handleGenerateRandomArray(algorithmId.includes('binary-search'));
    else if (nextType === 'graph') handleGenerateRandomGraph();
    else handleGenerateRandomTree();
  }, [algorithmId]);

  useEffect(() => {
    if (visualizationType !== 'array' || array.length === 0 || !algorithmId.includes('search')) return;
    const steps = generateVisualizationSteps(algorithmId, array, { target: searchTarget });
    stepsRef.current = steps;
    setTotalSteps(steps.length);
  }, [searchTarget]);

  useEffect(() => {
    if (visualizationType !== 'graph' || !graphData) return;
    const steps = generateVisualizationSteps(algorithmId, graphData, { startNode: graphStartNode });
    stepsRef.current = steps;
    setTotalSteps(steps.length);
  }, [graphStartNode]);

  const exportVisualization = () => exportVisualizationData(algorithmId, stepsRef.current, currentStep);

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
    searchTarget,
    setSearchTarget,
    graphStartNode,
    setGraphStartNode,
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
