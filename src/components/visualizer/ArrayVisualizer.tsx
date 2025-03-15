
import React from 'react';
import { ArrayItem, GraphData, TreeNode } from '../../types/visualizer';
import { motion, AnimatePresence } from 'framer-motion';

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
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'comparing':
        return 'bg-yellow-500';
      case 'swapping':
        return 'bg-blue-500';
      case 'sorted':
        return 'bg-green-500';
      case 'visited':
        return 'bg-gray-400';
      case 'found':
        return 'bg-green-500';
      case 'removing':
        return 'bg-red-500';
      case 'added':
        return 'bg-green-500';
      case 'current':
      case 'active':
        return 'bg-blue-500';
      case 'pivot':
        return 'bg-purple-500';
      case 'target':
        return 'bg-orange-500';
      default:
        return 'bg-muted-foreground/30';
    }
  };

  const renderArrayVisualization = () => {
    const maxValue = Math.max(...array.map(item => item.value));
    
    return (
      <div className="flex justify-center items-end gap-2 min-h-[200px] p-6">
        <AnimatePresence>
          {array.map((item, idx) => {
            // Calculate height based on value
            const heightPercent = (item.value / maxValue) * 100;
            const height = Math.max(20, heightPercent * 1.5);
            
            return (
              <motion.div
                key={`${idx}-${item.value}`}
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: idx * 0.02 }}
              >
                <motion.div
                  className={`${getStatusColor(item.status)} text-white flex items-center justify-center text-center text-sm w-12 min-w-10 rounded-md transition-all duration-300`}
                  style={{ height: `${height}px` }}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}px` }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {item.value}
                </motion.div>
                <div className="text-xs text-muted-foreground">{idx}</div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    );
  };

  const renderGraphVisualization = () => {
    return (
      <div className="h-96 bg-muted rounded-lg p-4 flex items-center justify-center">
        {graphData ? (
          <svg width="100%" height="100%" viewBox="0 0 600 400">
            {/* Draw edges */}
            {graphData.edges.map((edge, idx) => {
              const source = graphData.nodes.find(n => n.id === edge.source);
              const target = graphData.nodes.find(n => n.id === edge.target);
              
              if (!source || !target) return null;
              
              const edgeColor = edge.status === 'visited' ? 'stroke-yellow-500' : 
                               edge.status === 'path' ? 'stroke-green-500' : 
                               'stroke-muted-foreground/50';
              
              return (
                <g key={`edge-${idx}`}>
                  <line
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    className={`${edgeColor} stroke-2`}
                  />
                  {edge.weight && (
                    <text
                      x={(source.x + target.x) / 2}
                      y={(source.y + target.y) / 2}
                      dy="-5"
                      className="text-xs fill-muted-foreground"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {edge.weight}
                    </text>
                  )}
                </g>
              );
            })}
            
            {/* Draw nodes */}
            {graphData.nodes.map((node) => {
              let nodeColor;
              
              if (node.status === 'visited') nodeColor = 'fill-yellow-500';
              else if (node.status === 'processing') nodeColor = 'fill-purple-500';
              else if (node.status === 'path') nodeColor = 'fill-green-500';
              else if (node.status === 'active' || node.status === 'target') nodeColor = 'fill-blue-500';
              else nodeColor = 'fill-foreground/80';
              
              return (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="20"
                    className={`${nodeColor} transition-colors duration-300`}
                  />
                  <text
                    x={node.x}
                    y={node.y}
                    dy="0.3em"
                    className="text-white font-medium text-sm"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {node.value || node.id}
                  </text>
                </g>
              );
            })}
          </svg>
        ) : (
          <div className="text-muted-foreground">Graph data not available</div>
        )}
      </div>
    );
  };

  const renderTreeVisualization = () => {
    return (
      <div className="h-96 bg-muted rounded-lg p-4 flex items-center justify-center">
        {treeData ? (
          <div>Tree visualization coming soon</div>
        ) : (
          <div className="text-muted-foreground">Tree data not available</div>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full overflow-x-auto">
      <div className="absolute top-2 right-2 z-10">
        <div className="flex flex-wrap gap-2 text-xs bg-background/80 backdrop-blur-sm p-2 rounded-md shadow">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Comparing</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Sorted/Found</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Current</span>
          </div>
          {algorithmId.includes('quick') && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span>Pivot</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8">
        {type === 'array' && renderArrayVisualization()}
        {type === 'graph' && renderGraphVisualization()}
        {type === 'tree' && renderTreeVisualization()}
      </div>
    </div>
  );
};
