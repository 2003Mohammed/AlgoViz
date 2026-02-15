import React from 'react';
import { dataStructures } from '../../utils/dataStructureData';
import { DataStructureVisualizer } from '../data-structure-visualizer/DataStructureVisualizer';

interface UnifiedDataStructureVisualizerProps {
  dataStructureId: string;
}

export const UnifiedDataStructureVisualizer: React.FC<UnifiedDataStructureVisualizerProps> = ({ dataStructureId }) => {
  const dataStructure = dataStructures.find((item) => item.id === dataStructureId);

  if (!dataStructure) {
    return <div className="text-sm text-muted-foreground">Data structure definition not found for {dataStructureId}.</div>;
  }

  return <DataStructureVisualizer dataStructure={dataStructure} />;
};
