
import React from 'react';
import { motion } from 'framer-motion';
import { ArrayItem, GraphData, TreeNode } from '../../../types/visualizer';
import { ArrayVisualization } from './ArrayVisualization';
import { GraphVisualization } from './GraphVisualization';
import { TreeVisualization } from './TreeVisualization';
import { VisualizationLegend } from './VisualizationLegend';

interface ArrayVisualizerProps {
  array: ArrayItem[];
  graphData: GraphData | null;
  treeData: TreeNode | null;
  type: 'array' | 'graph' | 'tree';
  algorithmId: string;
}

export const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({
  array,
  graphData,
  treeData,
  type,
  algorithmId
}) => {
  const renderVisualization = () => {
    switch (type) {
      case 'array':
        return <ArrayVisualization array={array} />;
      case 'graph':
        return <GraphVisualization graphData={graphData} />;
      case 'tree':
        return <TreeVisualization treeData={treeData} />;
      default:
        return <div>Unsupported visualization type</div>;
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      <VisualizationLegend algorithmId={algorithmId} />
      
      <motion.div 
        className="mt-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5,
          delay: 0.3,
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
      >
        {renderVisualization()}
      </motion.div>
    </div>
  );
};
