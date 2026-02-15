import React from 'react';
import { useUnifiedAnimationController } from '../../hooks/useUnifiedAnimationController';
import { UnifiedDataStructureVisualizer } from './UnifiedDataStructureVisualizer';

const QueueVisualizer: React.FC = () => {
  useUnifiedAnimationController({ steps: [0], onApplyStep: () => {} });

  return <UnifiedDataStructureVisualizer dataStructureId="queue" />;
};

export default QueueVisualizer;
