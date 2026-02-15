import { generateRandomGraph, generateRandomTree } from '../../utils/visualizerUtils';
import { generateVisualizationSteps } from '../../utils/visualizations';
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
  setArray: React.Dispatch<React.SetStateAction<ArrayItem[]>>,
  graphStartNode: string
) {
  const applyInitialStep = (steps: VisualizerStep[]) => {
    stepsRef.current = steps;
    setTotalSteps(steps.length);
    setCurrentStep(0);

    if (steps.length > 0) {
      setActiveLineIndex(steps[0].lineIndex ?? -1);
      if (steps[0].array) setArray(steps[0].array);
      if (steps[0].graphData) setGraphData(steps[0].graphData);
      if (steps[0].treeData) setTreeData(steps[0].treeData);
    }
  };

  const handleGenerateRandomGraph = () => {
    try {
      const newGraph = generateRandomGraph();
      setGraphData(newGraph);
      resetAnimation();

      const steps = generateVisualizationSteps(algorithmId, newGraph, { startNode: graphStartNode });
      applyInitialStep(steps);

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
  };
}
