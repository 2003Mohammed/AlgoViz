
import React from 'react';
import { motion } from 'framer-motion';

interface GraphNode {
  id: string;
  x: number;
  y: number;
  status?: 'default' | 'visited' | 'processing' | 'path' | 'found';
}

interface GraphEdge {
  source: string;
  target: string;
  weight?: number;
  status?: 'default' | 'visited' | 'path';
}

interface GraphStructure {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

interface GraphRendererProps {
  graph: GraphStructure;
  animationStep?: any;
  currentStep?: number;
}

export const GraphRenderer: React.FC<GraphRendererProps> = ({ graph, animationStep, currentStep }) => {
  const { nodes = [], edges = [] } = graph;

  const getNodeColorFromStep = (nodeId: string) => {
    if (animationStep?.nodes) {
      const stepNode = animationStep.nodes.find((n: any) => n.id === nodeId);
      if (stepNode?.status) {
        switch (stepNode.status) {
          case 'processing': return 'fill-yellow-500 stroke-yellow-600';
          case 'visited': return 'fill-orange-500 stroke-orange-600';
          case 'path': return 'fill-blue-500 stroke-blue-600';
          case 'found': return 'fill-purple-500 stroke-purple-600';
          case 'current': return 'fill-red-500 stroke-red-600';
          default: return 'fill-primary stroke-primary-foreground';
        }
      }
    }
    return null;
  };

  const getEdgeColorFromStep = (sourceId: string, targetId: string) => {
    if (animationStep?.edges) {
      const stepEdge = animationStep.edges.find((e: any) => 
        (e.source === sourceId && e.target === targetId) ||
        (e.source === targetId && e.target === sourceId)
      );
      if (stepEdge?.status) {
        switch (stepEdge.status) {
          case 'visited': return 'stroke-orange-500';
          case 'path': return 'stroke-blue-500';
          case 'highlighted': return 'stroke-yellow-500';
          default: return 'stroke-muted-foreground';
        }
      }
    }
    return null;
  };

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">Empty Graph</p>
          <p className="text-sm">Add vertices and edges to see visualization</p>
        </div>
      </div>
    );
  }

  const getNodeColor = (status: GraphNode['status'], nodeId: string) => {
    const stepColor = getNodeColorFromStep(nodeId);
    if (stepColor) return stepColor;
    
    switch (status) {
      case 'visited':
        return 'fill-green-500 stroke-green-600';
      case 'processing':
        return 'fill-yellow-500 stroke-yellow-600';
      case 'path':
        return 'fill-blue-500 stroke-blue-600';
      case 'found':
        return 'fill-purple-500 stroke-purple-600';
      default:
        return 'fill-primary stroke-primary-foreground';
    }
  };

  const getEdgeColor = (status: GraphEdge['status'], sourceId: string, targetId: string) => {
    const stepColor = getEdgeColorFromStep(sourceId, targetId);
    if (stepColor) return stepColor;
    
    switch (status) {
      case 'visited':
        return 'stroke-green-500';
      case 'path':
        return 'stroke-blue-500';
      default:
        return 'stroke-muted-foreground';
    }
  };

  return (
    <div className="flex items-center justify-center min-h-64 p-8">
      <svg width="400" height="300" className="border rounded-lg bg-background">
        {/* Render edges */}
        {edges.map((edge, index) => {
          const sourceNode = nodes.find(n => n.id === edge.source);
          const targetNode = nodes.find(n => n.id === edge.target);
          
          if (!sourceNode || !targetNode) return null;

          return (
            <g key={`edge-${index}`}>
              <motion.line
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                strokeWidth="2"
                className={getEdgeColor(edge.status, edge.source, edge.target)}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
              
              {/* Edge weight */}
              {edge.weight && (
                <text
                  x={(sourceNode.x + targetNode.x) / 2}
                  y={(sourceNode.y + targetNode.y) / 2 - 5}
                  textAnchor="middle"
                  className="text-xs fill-foreground"
                >
                  {edge.weight}
                </text>
              )}
            </g>
          );
        })}

        {/* Render nodes */}
        {nodes.map((node, index) => (
          <g key={node.id}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="20"
              className={`${getNodeColor(node.status, node.id)} stroke-2`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            />
            
            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              className="text-sm font-bold fill-primary-foreground"
            >
              {node.id}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};
