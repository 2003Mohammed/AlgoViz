
import React from 'react';

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
    <div className="flex justify-center items-center h-64">
      <svg width="400" height="240" className="overflow-visible">
        {/* Draw edges */}
        {edges.map((edge, index) => {
          const source = nodes.find((n) => n.id === edge.source);
          const target = nodes.find((n) => n.id === edge.target);
          
          return (
            <line
              key={`edge-${index}`}
              x1={source?.x || 0}
              y1={source?.y || 0}
              x2={target?.x || 0}
              y2={target?.y || 0}
              className="stroke-primary/60 stroke-1"
            />
          );
        })}
        
        {/* Draw nodes */}
        {nodes.map((node) => (
          <g key={`node-${node.id}`}>
            <circle
              cx={node.x}
              cy={node.y}
              r={20}
              className="fill-primary/20 stroke-primary"
            />
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dy=".3em"
              className="text-xs fill-foreground"
            >
              {node.id}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};
