import React from 'react';
import { useUnifiedAnimationController } from '../../hooks/useUnifiedAnimationController';
import { UnifiedAlgorithmVisualizer } from './UnifiedAlgorithmVisualizer';

const AStarVisualizer: React.FC = () => {
  useUnifiedAnimationController({ steps: [0], onApplyStep: () => {} });

  return <UnifiedAlgorithmVisualizer algorithmId="a-star" name="A* Search" category="graph" />;
};

export default AStarVisualizer;
