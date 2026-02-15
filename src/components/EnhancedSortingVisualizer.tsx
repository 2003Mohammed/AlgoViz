import React from 'react';
import { useUnifiedAnimationController } from '../hooks/useUnifiedAnimationController';
import { UnifiedAlgorithmVisualizer } from './visualizers/UnifiedAlgorithmVisualizer';

const EnhancedSortingVisualizer: React.FC = () => {
  useUnifiedAnimationController({ steps: [0], onApplyStep: () => {} });

  return <UnifiedAlgorithmVisualizer algorithmId="bubble-sort" name="Enhanced Sorting" category="sorting" />;
};

export default EnhancedSortingVisualizer;
