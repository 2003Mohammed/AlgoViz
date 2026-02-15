import React from 'react';
import { useUnifiedAnimationController } from '../../hooks/useUnifiedAnimationController';
import { UnifiedAlgorithmVisualizer } from './UnifiedAlgorithmVisualizer';

const SelectionSortVisualizer: React.FC = () => {
  useUnifiedAnimationController({ steps: [0], onApplyStep: () => {} });

  return <UnifiedAlgorithmVisualizer algorithmId="selection-sort" name="Selection Sort" category="sorting" />;
};

export default SelectionSortVisualizer;
