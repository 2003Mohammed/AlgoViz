import React from 'react';
import { useUnifiedAnimationController } from '../../hooks/useUnifiedAnimationController';
import { UnifiedAlgorithmVisualizer } from './UnifiedAlgorithmVisualizer';

const InsertionSortVisualizer: React.FC = () => {
  useUnifiedAnimationController({ steps: [0], onApplyStep: () => {} });

  return <UnifiedAlgorithmVisualizer algorithmId="insertion-sort" name="Insertion Sort" category="sorting" />;
};

export default InsertionSortVisualizer;
