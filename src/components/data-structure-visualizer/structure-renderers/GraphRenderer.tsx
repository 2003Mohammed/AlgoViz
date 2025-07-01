
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GraphNode {
  id: string;
  x: number;
  y: number;
  status?: string;
  distance?: number;
  value?: any;
}

interface GraphEdge {
  source: string;
  target: string;
  weight?: number;
  status?: string;
  directed?: boolean;
}

interface GraphStructure {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

interface GraphRendererProps {
  graph: GraphStructure;
}

export const GraphRenderer: React.FC<GraphRendererProps> = ({ graph }) => {
  const { nodes = [], edges = [] } = graph;
  
  const getNodeColor = (status?: string) => {
    switch (status) {
      case 'visited':
        return 'fill-yellow-400 stroke-yellow-500';
      case 'processing':
      case 'active':
        return 'fill-purple-400 stroke-purple-500';
      case 'path':
      case 'found':
        return 'fill-green-400 stroke-green-500';
      case 'target':
        return 'fill-red-400 stroke-red-500';
      case 'source':
        return 'fill-blue-400 stroke-blue-500';
      default:
        return 'fill-gray-200 dark:fill-gray-700 stroke-gray-400 dark:stroke-gray-500';
    }
  };

  const getEdgeColor = (status?: string) => {
    switch (status) {
      case 'visited':
        return 'stroke-yellow-400';
      case 'path':
        return 'stroke-green-400';
      case 'exploring':
        return 'stroke-purple-400';
      default:
        return 'stroke-gray-400 dark:stroke-gray-600';
    }
  };

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div 
          className="text-center p-8 border-2 border-dashed border-muted-foreground/30 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-muted-foreground text-lg mb-2">Empty Graph</div>
          <div className="text-sm text-muted-foreground">Add nodes and edges to visualize graph algorithms</div>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <div className="w-full max-w-4xl">
        <svg width="100%" height="400" viewBox="0 0 600 400" className="overflow-visible border border-muted rounded-lg bg-background">
          {/* Background */}
          <motion.rect
            x="0"
            y="0"
            width="600"
            height="400"
            rx="8"
            className="fill-muted/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Draw edges */}
          <AnimatePresence>
            {edges.map((edge, index) => {
              const source = nodes.find((n) => n.id === edge.source);
              const target = nodes.find((n) => n.id === edge.target);
              
              if (!source || !target) return null;
              
              const midX = (source.x + target.x) / 2;
              const midY = (source.y + target.y) / 2;
              
              return (
                <motion.g key={`edge-${index}`}>
                  <motion.line
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    className={`${getEdgeColor(edge.status)} stroke-2`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.8 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.1,
                      ease: "easeInOut"
                    }}
                    strokeDasharray={edge.status === 'path' ? "none" : "4,4"}
                  />
                  
                  {/* Edge weight */}
                  {edge.weight && (
                    <motion.text
                      x={midX}
                      y={midY - 8}
                      className="text-xs fill-foreground font-medium"
                      textAnchor="middle"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      {edge.weight}
                    </motion.text>
                  )}
                  
                  {/* Arrow for directed edges */}
                  {edge.directed && (
                    <motion.polygon
                      points={`${target.x - 10},${target.y - 5} ${target.x},${target.y} ${target.x - 10},${target.y + 5}`}
                      className={getEdgeColor(edge.status)}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                    />
                  )}
                </motion.g>
              );
            })}
          </AnimatePresence>
          
          {/* Draw nodes */}
          <AnimatePresence>
            {nodes.map((node, index) => (
              <motion.g key={`node-${node.id}`}>
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={20}
                  className={`${getNodeColor(node.status)} stroke-2`}
                  initial={{ 
                    opacity: 0, 
                    scale: 0,
                    rotate: -180
                  }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    rotate: 0
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0,
                    rotate: 180
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20, 
                    delay: index * 0.1 
                  }}
                  whileHover={{ 
                    scale: 1.2,
                    boxShadow: "0px 0px 20px rgba(59, 130, 246, 0.6)"
                  }}
                  filter="drop-shadow(2px 3px 4px rgba(0, 0, 0, 0.2))"
                />
                
                {/* Node label */}
                <motion.text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dy=".35em"
                  className="text-sm font-bold fill-gray-800 dark:fill-gray-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  style={{ pointerEvents: 'none' }}
                >
                  {node.value || node.id}
                </motion.text>
                
                {/* Distance label for algorithms like Dijkstra */}
                {node.distance !== undefined && node.distance !== Infinity && (
                  <motion.text
                    x={node.x}
                    y={node.y - 30}
                    textAnchor="middle"
                    className="text-xs fill-primary font-bold"
                    initial={{ opacity: 0, y: node.y - 20 }}
                    animate={{ opacity: 1, y: node.y - 30 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                  >
                    d: {node.distance}
                  </motion.text>
                )}
              </motion.g>
            ))}
          </AnimatePresence>
        </svg>
      </div>
      
      {/* Graph Info */}
      <motion.div 
        className="mt-6 flex items-center gap-4 text-sm bg-muted/50 rounded-full px-6 py-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <span>Nodes: <strong>{nodes.length}</strong></span>
        <span className="text-muted-foreground">•</span>
        <span>Edges: <strong>{edges.length}</strong></span>
        <span className="text-muted-foreground">•</span>
        <span className="text-xs text-muted-foreground">
          {edges.some(e => e.directed) ? 'Directed' : 'Undirected'} Graph
        </span>
      </motion.div>
    </div>
  );
};
