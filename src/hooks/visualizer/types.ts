
import { ArrayItem, GraphData, TreeNode } from '../../types/visualizer';

export interface VisualizerStateReturnType {
  array: ArrayItem[];
  graphData: GraphData | null;
  treeData: TreeNode | null;
  visualizationType: 'array' | 'graph' | 'tree';
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  activeLineIndex: number;
  speed: number;
  setSpeed: (speed: number) => void;
  searchTarget: string;
  setSearchTarget: (target: string) => void;
  graphStartNode: string;
  setGraphStartNode: (node: string) => void;
  handleGenerateRandomArray: (sorted?: boolean) => void;
  handleGenerateRandomGraph: () => void;
  handleGenerateRandomTree: () => void;
  handleCustomArraySubmit: (inputArray: number[]) => void;
  reset: () => void;
  togglePlayPause: () => void;
  stepForward: () => boolean;
  stepBackward: () => boolean;
  jumpToStart: () => boolean;
  jumpToEnd: () => boolean;
  exportVisualization: () => void;
}
