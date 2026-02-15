import React from 'react';
import { useUnifiedAnimationController } from '../../hooks/useUnifiedAnimationController';
import { UnifiedAlgorithmVisualizer } from './UnifiedAlgorithmVisualizer';

const MergeSortVisualizer: React.FC = () => {
  useUnifiedAnimationController({ steps: [0], onApplyStep: () => {} });

  return <UnifiedAlgorithmVisualizer algorithmId="merge-sort" name="Merge Sort" category="sorting" />;
};

export default MergeSortVisualizer;
