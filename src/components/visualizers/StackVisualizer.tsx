import React from 'react';
import { useUnifiedAnimationController } from '../../hooks/useUnifiedAnimationController';
import { UnifiedDataStructureVisualizer } from './UnifiedDataStructureVisualizer';

const StackVisualizer: React.FC = () => {
  useUnifiedAnimationController({ steps: [0], onApplyStep: () => {} });

  return <UnifiedDataStructureVisualizer dataStructureId="stack" />;
};

export default StackVisualizer;
