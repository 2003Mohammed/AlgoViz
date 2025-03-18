
import React from 'react';
import { GraphData } from '../../../types/visualizer';

interface GraphVisualizationProps {
  graphData: GraphData | null;
}

export const GraphVisualization: React.FC<GraphVisualizationProps> = ({ graphData }) => {
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
