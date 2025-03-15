
import { ArrayItem, GraphData, TreeNode, VisualizerStep } from '../../types/visualizer';

export interface VisualizerStateReturnType {
  array: ArrayItem[];
  graphData: GraphData | null;
  treeData: TreeNode | null;
  visualizationType: 'array' | 'graph' | 'tree';
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  activeLineIndex: number;
  handleGenerateRandomArray: (sorted?: boolean) => void;
  handleGenerateRandomGraph: () => void;
  handleGenerateRandomTree: () => void;
  handleCustomArraySubmit: (inputArray: number[]) => void;
  reset: () => void;
  togglePlayPause: () => void;
  stepForward: () => boolean;
  stepBackward: () => boolean;
  changeSpeed: (newSpeed: number) => void;
  exportVisualization: () => void;
}
