import { ArrayItem, GraphData, TreeNode, VisualizerStep } from '../../types/visualizer';
import { visualizeArrayOperation } from './array-visualizations';
import { visualizeStackOperation } from './stack-visualizations';
import { visualizeQueueOperation } from './queue-visualizations';
import { visualizeHashTableOperation } from './hash-table-visualizations';
import { visualizeGraphOperation, visualizeBFS, visualizeDFS, visualizeDijkstra, visualizeAStar } from './graph-visualizations';
import {
  visualizeBubbleSort,
  visualizeHeapSort,
  visualizeInsertionSort,
  visualizeMergeSort,
  visualizeQuickSort,
} from './sort-visualizations';
import { visualizeBinarySearch, visualizeLinearSearch } from './search-visualizations';

export * from './array-visualizations';
export * from './stack-visualizations';
export * from './queue-visualizations';
export * from './hash-table-visualizations';
export * from './graph-visualizations';
export * from './constants';

const toValues = (input: ArrayItem[]) => input.map((item) => Number(item.value));

const visualizeSelectionSort = (array: number[]): VisualizerStep[] => {
  const arr = array.map((value) => ({ value, status: 'default' as const }));
  const steps: VisualizerStep[] = [{ array: JSON.parse(JSON.stringify(arr)), lineIndex: 0 }];

  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < arr.length; j++) {
      const compare = JSON.parse(JSON.stringify(arr));
      compare[minIndex].status = 'active';
      compare[j].status = 'comparing';
      steps.push({ array: compare, lineIndex: 1, comparingIndices: [minIndex, j] });
      if (arr[j].value < arr[minIndex].value) minIndex = j;
    }

    if (minIndex !== i) {
      const swap = JSON.parse(JSON.stringify(arr));
      swap[i].status = 'swapping';
      swap[minIndex].status = 'swapping';
      steps.push({ array: swap, lineIndex: 2, swappedIndices: [i, minIndex] });
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }

    arr[i].status = 'sorted';
    steps.push({ array: JSON.parse(JSON.stringify(arr)), lineIndex: 3, sortedIndices: [i] });
  }

  arr[arr.length - 1].status = 'sorted';
  steps.push({ array: JSON.parse(JSON.stringify(arr)), lineIndex: 4 });
  return steps;
};

const buildTreeTraversalFrames = (tree: TreeNode): VisualizerStep[] => {
  const frames: VisualizerStep[] = [{ array: [], treeData: tree, lineIndex: 0, description: 'Initial tree' }];
  const visit = (node: TreeNode | null | undefined) => {
    if (!node) return;
    const mark = (current: TreeNode | null | undefined): TreeNode | null => {
      if (!current) return null;
      return {
        ...current,
        status: current.id === node.id ? 'active' : 'default',
        left: mark(current.left ?? null),
        right: mark(current.right ?? null),
      };
    };
    const marked = mark(tree);
    if (marked) frames.push({ array: [], treeData: marked, lineIndex: 1, description: `Visiting ${node.value}` });
    visit(node.left ?? null);
    visit(node.right ?? null);
  };
  visit(tree);
  return frames;
};

export function generateVisualizationSteps(algorithmId: string, data: any, options?: { target?: string; startNode?: string }): VisualizerStep[] {
  if (algorithmId.includes('sort')) {
    const values = toValues(data as ArrayItem[]);
    switch (algorithmId) {
      case 'bubble-sort':
        return visualizeBubbleSort(values);
      case 'selection-sort':
        return visualizeSelectionSort(values);
      case 'insertion-sort':
        return visualizeInsertionSort(values);
      case 'merge-sort':
        return visualizeMergeSort(values);
      case 'quick-sort':
        return visualizeQuickSort(values);
      case 'heap-sort':
        return visualizeHeapSort(values);
      default:
        return visualizeBubbleSort(values);
    }
  }

  if (algorithmId.includes('search')) {
    const values = toValues(data as ArrayItem[]);
    const normalizedTarget = Number((options?.target ?? '').trim());
    const target = Number.isNaN(normalizedTarget) ? values[Math.floor(values.length / 2)] : normalizedTarget;
    return algorithmId === 'binary-search' ? visualizeBinarySearch(values, target) : visualizeLinearSearch(values, target);
  }

  if (['bfs', 'dfs', 'dijkstra', 'astar'].includes(algorithmId)) {
    const graph = data as GraphData;
    const requested = options?.startNode?.trim().toLowerCase();
    const selected = graph.nodes.find((node) => node.id.toLowerCase() === requested)?.id ?? graph.nodes[0]?.id ?? 'node-0';
    if (algorithmId === 'bfs') return visualizeBFS(graph, selected);
    if (algorithmId === 'dfs') return visualizeDFS(graph, selected);
    if (algorithmId === 'astar') return visualizeAStar(graph, selected);
    return visualizeDijkstra(graph, selected);
  }

  if (algorithmId.includes('tree') && data) {
    return buildTreeTraversalFrames(data as TreeNode);
  }

  return [{ array: [], lineIndex: 0, description: `Algorithm: ${algorithmId}` }];
}

export {
  visualizeArrayOperation,
  visualizeStackOperation,
  visualizeQueueOperation,
  visualizeHashTableOperation,
  visualizeGraphOperation,
  visualizeBFS,
  visualizeDFS,
  visualizeDijkstra,
};
