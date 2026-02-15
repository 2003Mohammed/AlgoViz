import React from 'react';
import { useUnifiedAnimationController } from '../../hooks/useUnifiedAnimationController';
import { UnifiedDataStructureVisualizer } from './UnifiedDataStructureVisualizer';

const LinkedListVisualizer: React.FC = () => {
  useUnifiedAnimationController({ steps: [0], onApplyStep: () => {} });

  return <UnifiedDataStructureVisualizer dataStructureId="linked-list" />;
};

export default LinkedListVisualizer;
