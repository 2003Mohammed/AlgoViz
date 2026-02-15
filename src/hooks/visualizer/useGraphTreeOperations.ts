import { useState } from 'react';
import { generateRandomGraph, generateRandomTree } from '../../utils/visualizerUtils';
import { generateVisualizationSteps, visualizeGraphOperation } from '../../utils/visualizations';
import { toast } from '../use-toast';
import { ArrayItem, GraphData, TreeNode, VisualizerStep } from '../../types/visualizer';

export function useGraphTreeOperations(
  algorithmId: string,
  setGraphData: React.Dispatch<React.SetStateAction<GraphData | null>>,
  setTreeData: React.Dispatch<React.SetStateAction<TreeNode | null>>,
  resetAnimation: () => void,
  setTotalSteps: React.Dispatch<React.SetStateAction<number>>,
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>,
  setActiveLineIndex: React.Dispatch<React.SetStateAction<number>>,
  stepsRef: React.MutableRefObject<VisualizerStep[]>,
  setArray: React.Dispatch<React.SetStateAction<ArrayItem[]>>
) {
  const [startNode, setStartNode] = useState<string | undefined>();
  const [endNode, setEndNode] = useState<string | undefined>();

  const applyInitialStep = (steps: VisualizerStep[]) => {
    stepsRef.current = steps;
    setTotalSteps(steps.length);
    setCurrentStep(0);
    if (steps.length > 0) {
      setActiveLineIndex(steps[0].lineIndex ?? -1);
      if (steps[0].array) {
        setArray(steps[0].array);
      }
      if (steps[0].graphData) {
        setGraphData(steps[0].graphData);
      }
      if (steps[0].treeData) {
        setTreeData(steps[0].treeData);
      }
    }
  };

  const handleGenerateRandomGraph = () => {
    try {
      const newGraph = generateRandomGraph();
      setGraphData(newGraph);
      resetAnimation();

      if (newGraph.nodes.length > 0) {
        const randomStartIndex = Math.floor(Math.random() * newGraph.nodes.length);
        let randomEndIndex = randomStartIndex;
        while (randomEndIndex === randomStartIndex && newGraph.nodes.length > 1) {
          randomEndIndex = Math.floor(Math.random() * newGraph.nodes.length);
        }

        const start = newGraph.nodes[randomStartIndex].id;
        const end = newGraph.nodes[randomEndIndex].id;

        setStartNode(start);
        setEndNode(end);

        const operation = algorithmId === 'astar' ? 'dijkstra' : algorithmId;
        const steps =
          operation === 'bfs' || operation === 'dfs' || operation === 'dijkstra'
            ? visualizeGraphOperation(newGraph, operation, start, end)
            : generateVisualizationSteps(algorithmId, newGraph);

        applyInitialStep(steps);
      }

      toast({
        title: 'Example graph generated',
        description: `Ready to visualize ${algorithmId}`,
      });
    } catch (error) {
      console.error('Error generating graph:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate example graph',
        variant: 'destructive',
      });
    }
  };

  const handleGenerateRandomTree = () => {
    try {
      const newTree = generateRandomTree();
      setTreeData(newTree);
      resetAnimation();

      const steps = generateVisualizationSteps(algorithmId, newTree);
      applyInitialStep(steps);

      toast({
        title: 'Example tree generated',
        description: `Ready to visualize ${algorithmId}`,
      });
    } catch (error) {
      console.error('Error generating tree:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate example tree',
        variant: 'destructive',
      });
    }
  };

  return {
    handleGenerateRandomGraph,
    handleGenerateRandomTree,
    startNode,
    endNode,
    setStartNode,
    setEndNode,
  };
}
