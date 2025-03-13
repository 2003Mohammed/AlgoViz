
import React from 'react';
import { motion } from 'framer-motion';

interface GraphStructure {
  nodes: Array<{
    id: string;
    x: number;
    y: number;
  }>;
  edges: Array<{
    source: string;
    target: string;
  }>;
}

interface GraphRendererProps {
  graph: GraphStructure;
}

export const GraphRenderer: React.FC<GraphRendererProps> = ({ graph }) => {
  const { nodes, edges } = graph;
  
  if (!nodes || nodes.length === 0) {
    return <div className="text-muted-foreground">Graph is empty</div>;
  }
  
  return (
    <div className="flex justify-center items-center h-64 perspective-1000">
      <div className="relative w-full h-full max-w-[400px] max-h-[240px] rounded-xl border border-primary/20 bg-gradient-to-br from-muted/50 to-background overflow-hidden">
        <svg width="400" height="240" className="overflow-visible">
          {/* Draw edges */}
          {edges.map((edge, index) => {
            const source = nodes.find((n) => n.id === edge.source);
            const target = nodes.find((n) => n.id === edge.target);
            
            return (
              <motion.line
                key={`edge-${index}`}
                x1={source?.x || 0}
                y1={source?.y || 0}
                x2={target?.x || 0}
                y2={target?.y || 0}
                className="stroke-primary/60 stroke-1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.8 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              />
            );
          })}
          
          {/* Draw nodes */}
          {nodes.map((node, idx) => (
            <motion.g 
              key={`node-${node.id}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20, 
                delay: 0.3 + idx * 0.1 
              }}
              whileHover={{ scale: 1.2 }}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={20}
                className="fill-primary/20 stroke-primary"
                filter="drop-shadow(1px 2px 2px rgba(0, 0, 0, 0.25))"
              />
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dy=".3em"
                className="text-xs fill-foreground font-medium"
              >
                {node.id}
              </text>
            </motion.g>
          ))}
        </svg>
      </div>
    </div>
  );
};
