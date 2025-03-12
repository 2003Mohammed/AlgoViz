
import React from 'react';
import { VisualizerProps } from '../types/visualizer';
import { VisualizerContainer } from './visualizer/VisualizerContainer';

export const Visualizer: React.FC<VisualizerProps> = ({ algorithm }) => {
  return <VisualizerContainer algorithm={algorithm} />;
};
