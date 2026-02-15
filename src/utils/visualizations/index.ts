import { ArrayItem, GraphData, TreeNode, VisualizerStep } from '../../types/visualizer';
import { visualizeArrayOperation } from './array-visualizations';
import { visualizeStackOperation } from './stack-visualizations';
import { visualizeQueueOperation } from './queue-visualizations';
import { visualizeHashTableOperation } from './hash-table-visualizations';
import { visualizeGraphOperation, visualizeBFS, visualizeDFS, visualizeDijkstra } from './graph-visualizations';

export * from './array-visualizations';
export * from './stack-visualizations';
export * from './queue-visualizations';
export * from './hash-table-visualizations';
export * from './graph-visualizations';
export * from './constants';

const toArrayStep = (values: number[], lineIndex: number, description: string, activeIndices: number[] = []): VisualizerStep => ({
  array: values.map((value, index) => ({
    value,
    status: activeIndices.includes(index) ? 'comparing' : 'default',
  })),
  lineIndex,
  description,
});

function buildSortingFrames(input: ArrayItem[], algorithmId: string): VisualizerStep[] {
  const values = input.map((item) => Number(item.value));
  const steps: VisualizerStep[] = [toArrayStep(values, 0, 'Initial state')];

  if (algorithmId === 'bubble-sort' || algorithmId === 'selection-sort' || algorithmId === 'insertion-sort') {
    const arr = [...values];
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        steps.push(toArrayStep(arr, 1, `Compare ${arr[i]} and ${arr[j]}`, [i, j]));
        if (arr[j] < arr[i]) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          steps.push(toArrayStep(arr, 2, `Swap ${arr[j]} and ${arr[i]}`, [i, j]));
        }
      }
    }
    steps.push({
      array: arr.map((value) => ({ value, status: 'sorted' })),
      lineIndex: 3,
      description: 'Sorted output',
    });
    return steps;
  }

  const sorted = [...values].sort((a, b) => a - b);
  steps.push(toArrayStep(sorted, 1, 'Sorted output'));
  return steps;
}

function buildSearchFrames(input: ArrayItem[], algorithmId: string): VisualizerStep[] {
  const values = input.map((item) => Number(item.value));
  const target = values[Math.floor(values.length / 2)] ?? 0;
  const steps: VisualizerStep[] = [toArrayStep(values, 0, `Target value: ${target}`)];

  if (algorithmId === 'binary-search') {
    const sorted = [...values].sort((a, b) => a - b);
    let left = 0;
    let right = sorted.length - 1;
    steps.push(toArrayStep(sorted, 1, 'Sort array before binary search'));

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      steps.push({
        array: sorted.map((value, index) => ({
          value,
          status: index === mid ? 'active' : index >= left && index <= right ? 'comparing' : 'default',
        })),
        lineIndex: 2,
        description: `Checking middle index ${mid}`,
      });

      if (sorted[mid] === target) {
        steps.push({
          array: sorted.map((value, index) => ({ value, status: index === mid ? 'found' : 'default' })),
          lineIndex: 3,
          description: `Found ${target} at index ${mid}`,
        });
        break;
      }
      if (sorted[mid] < target) left = mid + 1;
      else right = mid - 1;
    }
    return steps;
  }

  values.forEach((value, index) => {
    steps.push({
      array: values.map((entry, idx) => ({
        value: entry,
        status: idx === index ? (entry === target ? 'found' : 'active') : 'default',
      })),
      lineIndex: 1,
      description: `Checking index ${index}`,
    });
  });
  return steps;
}

function buildTreeFrames(tree: TreeNode): VisualizerStep[] {
  const steps: VisualizerStep[] = [];
  const visit = (node: TreeNode | null | undefined) => {
    if (!node) return;
    const mark = (root: TreeNode, activeId: string): TreeNode => ({
      ...root,
      status: root.id === activeId ? 'active' : 'default',
      left: root.left ? mark(root.left, activeId) : null,
      right: root.right ? mark(root.right, activeId) : null,
    });
    steps.push({ array: [], treeData: mark(tree, node.id), lineIndex: 1, description: `Visit node ${node.value}` });
    visit(node.left ?? null);
    visit(node.right ?? null);
  };

  steps.push({ array: [], treeData: tree, lineIndex: 0, description: 'Initial tree' });
  visit(tree);
  return steps;
}

export function generateVisualizationSteps(algorithmId: string, data: any): VisualizerStep[] {
  if (algorithmId.includes('sort')) return buildSortingFrames(data, algorithmId);
  if (algorithmId.includes('search')) return buildSearchFrames(data, algorithmId);

  if (algorithmId === 'bfs' || algorithmId === 'dfs' || algorithmId === 'dijkstra' || algorithmId === 'astar') {
    const graph = data as GraphData;
    if (algorithmId === 'bfs') return visualizeBFS(graph, graph.nodes[0]?.id ?? 'node-0');
    if (algorithmId === 'dfs') return visualizeDFS(graph, graph.nodes[0]?.id ?? 'node-0');
    return visualizeDijkstra(graph, graph.nodes[0]?.id ?? 'node-0');
  }

  if (algorithmId.includes('tree') && data) return buildTreeFrames(data as TreeNode);

  return [
    {
      array: Array.isArray(data)
        ? data.map((item: any) => ({ value: typeof item === 'object' ? item.value : item, status: 'default' }))
        : [],
      lineIndex: 0,
      description: `Algorithm: ${algorithmId}`,
    },
  ];
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
