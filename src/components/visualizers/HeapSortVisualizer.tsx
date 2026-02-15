import React from 'react';
import { useUnifiedAnimationController } from '../../hooks/useUnifiedAnimationController';
import { UnifiedAlgorithmVisualizer } from './UnifiedAlgorithmVisualizer';

const HeapSortVisualizer: React.FC = () => {
  useUnifiedAnimationController({ steps: [0], onApplyStep: () => {} });

  return <UnifiedAlgorithmVisualizer algorithmId="heap-sort" name="Heap Sort" category="sorting" />;
};

export default HeapSortVisualizer;
