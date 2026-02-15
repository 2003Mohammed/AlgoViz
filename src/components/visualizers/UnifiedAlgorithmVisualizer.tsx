import React from 'react';
import { algorithms } from '../../utils/algorithms';
import { Algorithm } from '../../utils/algorithms/types';
import { Brain } from 'lucide-react';
import { VisualizerContainer } from '../visualizer/VisualizerContainer';

interface UnifiedAlgorithmVisualizerProps {
  algorithmId: string;
  name: string;
  category: string;
  description?: string;
  pseudocode?: string[];
}

const SortingRenderer: React.FC<{ algorithm: Algorithm }> = ({ algorithm }) => <VisualizerContainer algorithm={algorithm} />;
const GraphRenderer: React.FC<{ algorithm: Algorithm }> = ({ algorithm }) => <VisualizerContainer algorithm={algorithm} />;
const TreeRenderer: React.FC<{ algorithm: Algorithm }> = ({ algorithm }) => <VisualizerContainer algorithm={algorithm} />;
const DataStructureRenderer: React.FC<{ algorithm: Algorithm }> = ({ algorithm }) => <VisualizerContainer algorithm={algorithm} />;

export const UnifiedAlgorithmVisualizer: React.FC<UnifiedAlgorithmVisualizerProps> = ({
  algorithmId,
  name,
  category,
  description,
  pseudocode,
}) => {
  const algorithm =
    algorithms.find((item) => item.id === algorithmId) ??
    ({
      id: algorithmId,
      name,
      category,
      description: description ?? `${name} visualization with unified playback controls and synchronized pseudocode.`,
      icon: Brain,
      timeComplexity: {
        best: 'O(n)',
        average: 'O(n log n)',
        worst: 'O(n²)',
      },
      spaceComplexity: 'O(n)',
      pseudocode:
        pseudocode ??
        [
          `procedure ${name.replace(/\s+/g, '')}(input)`,
          '  initialize frame sequence',
          '  while not complete',
          '    apply operation and emit frame',
          '  return result',
        ],
    } satisfies Algorithm);

  const normalizedCategory = (algorithm.category || category).toLowerCase();

  if (normalizedCategory.includes('graph') || ['bfs', 'dfs', 'dijkstra', 'astar'].includes(algorithm.id)) {
    return <GraphRenderer algorithm={algorithm} />;
  }

  if (normalizedCategory.includes('tree')) {
    return <TreeRenderer algorithm={algorithm} />;
  }

  if (normalizedCategory.includes('data-structure')) {
    return <DataStructureRenderer algorithm={algorithm} />;
  }

  return <SortingRenderer algorithm={algorithm} />;
};
