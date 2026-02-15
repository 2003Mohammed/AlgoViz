import React from 'react';
import { useUnifiedAnimationController } from '../../hooks/useUnifiedAnimationController';
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

export const UnifiedAlgorithmVisualizer: React.FC<UnifiedAlgorithmVisualizerProps> = ({
  algorithmId,
  name,
  category,
  description,
  pseudocode,
}) => {
  const algorithm = algorithms.find((item) => item.id === algorithmId) ?? {
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
    pseudocode: pseudocode ?? [
      `procedure ${name.replace(/\s+/g, '')}(input)`,
      '  initialize frame sequence',
      '  while not complete',
      '    apply operation and emit frame',
      '  return result',
    ],
  } satisfies Algorithm;

  return <VisualizerContainer algorithm={algorithm} />;
};
