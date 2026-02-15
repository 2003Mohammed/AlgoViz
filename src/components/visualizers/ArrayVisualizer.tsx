import React from 'react';
import { useUnifiedAnimationController } from '../../hooks/useUnifiedAnimationController';
import { UnifiedDataStructureVisualizer } from './UnifiedDataStructureVisualizer';

const ArrayVisualizer: React.FC = () => {
  useUnifiedAnimationController({ steps: [0], onApplyStep: () => {} });

  return <UnifiedDataStructureVisualizer dataStructureId="array" />;
};

export default ArrayVisualizer;
