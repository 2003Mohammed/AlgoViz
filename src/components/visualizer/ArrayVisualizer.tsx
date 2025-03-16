import React, { useEffect, useRef } from 'react';
import { ArrayItem, GraphData, TreeNode } from '../../types/visualizer';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

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
  const containerControls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const sequence = async () => {
      await containerControls.start({
        scale: [1, 1.02, 1],
        transition: { duration: 0.4 }
      });
    };
    
    sequence();
  }, [array, containerControls]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'comparing':
        return 'bg-yellow-500 dark:bg-yellow-600';
      case 'swapping':
        return 'bg-blue-500 dark:bg-blue-600';
      case 'sorted':
        return 'bg-green-500 dark:bg-green-600';
      case 'visited':
        return 'bg-gray-400 dark:bg-gray-600';
      case 'found':
        return 'bg-green-500 dark:bg-green-600';
      case 'removing':
        return 'bg-red-500 dark:bg-red-600';
      case 'added':
        return 'bg-green-500 dark:bg-green-600';
      case 'current':
      case 'active':
        return 'bg-blue-500 dark:bg-blue-600';
      case 'pivot':
        return 'bg-purple-500 dark:bg-purple-600';
      case 'target':
        return 'bg-orange-500 dark:bg-orange-600';
      default:
        return 'bg-primary/80 dark:bg-primary-600/80';
    }
  };

  const getStatusBorderStyle = (status?: string) => {
    if (status === 'comparing' || status === 'swapping' || status === 'current' || status === 'active') {
      return 'border-2 border-white dark:border-white/70';
    }
    return '';
  };

  const getStatusAnimation = (status?: string) => {
    switch (status) {
      case 'comparing':
        return {
          scale: [1, 1.1, 1],
          borderColor: ['rgba(255,255,255,0.7)', 'rgba(255,255,255,1)', 'rgba(255,255,255,0.7)'],
          transition: { 
            repeat: Infinity, 
            duration: 1.5,
            ease: "easeInOut" 
          }
        };
      case 'swapping':
        return {
          rotate: [0, 5, 0, -5, 0],
          transition: { 
            repeat: Infinity, 
            duration: 1.2 
          }
        };
      default:
        return {};
    }
  };

  const renderArrayVisualization = () => {
    const maxValue = Math.max(...array.map(item => typeof item.value === 'number' ? item.value : 0));
    
    return (
      <motion.div 
        className="flex justify-center items-end gap-2 min-h-[220px] py-6 px-4 overflow-x-auto circuit-pattern rounded-lg"
        animate={containerControls}
        ref={containerRef}
      >
        <AnimatePresence mode="sync">
          {array.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-muted-foreground text-center"
            >
              No data to visualize
            </motion.div>
          ) : (
            array.map((item, idx) => {
              // Calculate height based on value
              const heightPercent = (typeof item.value === 'number' ? item.value / maxValue : 0.3) * 100;
              const height = Math.max(30, heightPercent * 1.8);
              
              return (
                <motion.div
                  key={`${idx}-${item.value}`}
                  className="flex flex-col items-center gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: idx * 0.02,
                    type: "spring", 
                    stiffness: 300, 
                    damping: 25
                  }}
                  layout
                >
                  <motion.div
                    className={`${getStatusColor(item.status)} ${getStatusBorderStyle(item.status)} text-white flex items-center justify-center text-center text-sm w-14 min-w-12 rounded-md shadow-[0_0_8px_rgba(0,100,255,0.3)] backdrop-blur-sm transition-all`}
                    style={{ height: `${height}px` }}
                    initial={{ height: 0 }}
                    animate={{
                      height: `${height}px`,
                      ...getStatusAnimation(item.status)
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 20 
                    }}
                    whileHover={{ 
                      scale: 1.1, 
                      boxShadow: "0px 0px 15px rgba(80, 160, 255, 0.8)",
                      zIndex: 10 
                    }}
                    layoutId={`item-${idx}`}
                  >
                    <div className="relative z-10 font-mono font-semibold">
                      {item.value}
                    </div>
                    {item.status === 'comparing' && (
                      <motion.div 
                        className="absolute inset-0 bg-white/20 rounded-md" 
                        animate={{ 
                          opacity: [0.1, 0.3, 0.1] 
                        }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                      />
                    )}
                  </motion.div>
                  <motion.div 
                    className="text-xs font-mono text-blue-300 bg-blue-950/50 px-2 py-0.5 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {idx}
                  </motion.div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const renderGraphVisualization = () => {
    return (
      <div className="h-96 rounded-lg p-4 flex items-center justify-center">
        {graphData ? (
          <svg width="100%" height="100%" viewBox="0 0 600 400" className="circuit-pattern rounded-lg">
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
                    strokeDasharray={edge.status === 'path' ? "none" : "5,5"}
                    marker-end={edge.directed ? "url(#arrowhead)" : undefined}
                  />
                  {edge.weight && (
                    <text
                      x={(source.x + target.x) / 2}
                      y={(source.y + target.y) / 2}
                      dy="-5"
                      className="text-xs fill-yellow-300 font-medium"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {edge.weight}
                    </text>
                  )}
                </g>
              );
            })}
            
            {/* Define arrow marker for directed edges */}
            <defs>
              <marker
                id="arrowhead"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255, 255, 255, 0.5)" />
              </marker>
            </defs>
            
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
                    filter="url(#glow)"
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
            
            {/* Glow filter for nodes */}
            <defs>
              <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
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
    <div className="relative w-full overflow-hidden">
      <motion.div 
        className="absolute top-2 right-2 z-10"
        initial={{ opacity: 0, scale: 0.9, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <div className="flex flex-wrap gap-2 text-xs bg-background/90 backdrop-blur-sm p-2 rounded-md shadow-lg border border-primary/30 pixel-border">
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
      </motion.div>
      
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
        {type === 'array' && renderArrayVisualization()}
        {type === 'graph' && renderGraphVisualization()}
        {type === 'tree' && renderTreeVisualization()}
      </motion.div>
    </div>
  );
};
