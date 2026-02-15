import React from 'react';
import { useUnifiedAnimationController } from '../../hooks/useUnifiedAnimationController';
import { UnifiedDataStructureVisualizer } from './UnifiedDataStructureVisualizer';

const TreeVisualizer: React.FC = () => {
  useUnifiedAnimationController({ steps: [0], onApplyStep: () => {} });

  return <UnifiedDataStructureVisualizer dataStructureId="binary-tree" />;
};

export default TreeVisualizer;
