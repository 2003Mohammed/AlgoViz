
import React from 'react';
import { ArrayItem, GraphData, TreeNode } from '../../types/visualizer';
import { getStatusColor } from '../../utils/visualizerUtils';
import { ChartContainer, BarChart, Bar, XAxis, YAxis } from '../ui/chart';

interface VisualizationProps {
  array?: ArrayItem[];
  graphData?: GraphData | null;
  treeData?: TreeNode | null;
  type: 'array' | 'graph' | 'tree';
  algorithmId: string;
}

export const ArrayVisualizer: React.FC<VisualizationProps> = ({ 
  array = [], 
  graphData,
  treeData,
  type,
  algorithmId
}) => {
  // Render appropriate visualization based on type
  if (type === 'array') {
    return renderArrayVisualization(array, algorithmId);
  } else if (type === 'graph' && graphData) {
    return renderGraphVisualization(graphData);
  } else if (type === 'tree' && treeData) {
    return renderTreeVisualization(treeData);
  }
  
  // Fallback to array visualization
  return renderArrayVisualization(array, algorithmId);
};

// Render array based on algorithm type
const renderArrayVisualization = (array: ArrayItem[], algorithmId: string) => {
  if (algorithmId.includes('sort')) {
    return renderBarChart(array);
  } else if (algorithmId.includes('search')) {
    return renderSearchArray(array);
  } else {
    return renderBarChart(array);
  }
};

// Bar chart visualization for sorting algorithms
const renderBarChart = (array: ArrayItem[]) => {
  return (
    <div className="relative h-64 flex items-end justify-center gap-1 mb-6">
      {array.map((item, index) => (
        <div
          key={index}
          className={`w-8 rounded-t-md ${getStatusColor(item.status)} transition-all duration-300`}
          style={{ height: `${(item.value / 100) * 80}%` }}
        >
          <div className="text-xs mt-2 text-center">{item.value}</div>
        </div>
      ))}
    </div>
  );
};

// Horizontal array visualization for search algorithms
const renderSearchArray = (array: ArrayItem[]) => {
  return (
    <div className="relative h-32 flex items-center justify-center gap-1 mb-6">
      {array.map((item, index) => (
        <div
          key={index}
          className={`h-16 w-12 flex items-center justify-center border border-1 rounded-md ${getStatusColor(item.status)} transition-all duration-300`}
        >
          <div className="text-sm text-center">{item.value}</div>
        </div>
      ))}
    </div>
  );
};

// Graph visualization for graph algorithms
const renderGraphVisualization = (graphData: GraphData) => {
  const width = 600;
  const height = 400;
  
  return (
    <div className="relative h-96 w-full mb-6 border-2 border-dashed border-secondary/30 rounded-lg flex items-center justify-center">
      <svg width={width} height={height} className="overflow-visible">
        {/* Render edges */}
        {graphData.edges.map((edge, index) => {
          const source = graphData.nodes.find(n => n.id === edge.source);
          const target = graphData.nodes.find(n => n.id === edge.target);
          
          if (!source || !target || !source.x || !source.y || !target.x || !target.y) {
            return null;
          }
          
          const edgeClassName = edge.status === 'path' 
            ? 'stroke-primary stroke-[3px]' 
            : edge.status === 'active' 
              ? 'stroke-orange-500 stroke-[2px]' 
              : 'stroke-gray-400';
          
          return (
            <g key={`edge-${index}`}>
              <line
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                className={`${edgeClassName} transition-all duration-300`}
              />
              {edge.weight !== undefined && (
                <text
                  x={(source.x + target.x) / 2}
                  y={(source.y + target.y) / 2}
                  dy={-5}
                  className="text-xs fill-current text-muted-foreground"
                >
                  {edge.weight}
                </text>
              )}
            </g>
          );
        })}
        
        {/* Render nodes */}
        {graphData.nodes.map((node) => {
          if (!node.x || !node.y) return null;
          
          const nodeClassName = node.status === 'active' 
            ? 'fill-orange-500' 
            : node.status === 'visited'
              ? 'fill-blue-400'
              : node.status === 'path'
                ? 'fill-primary'
                : node.status === 'target'
                  ? 'fill-green-500'
                  : 'fill-gray-200';
          
          return (
            <g key={node.id} className="transition-all duration-300">
              <circle
                cx={node.x}
                cy={node.y}
                r={20}
                className={`${nodeClassName} stroke-2 stroke-gray-700 transition-all duration-300`}
              />
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dy=".3em"
                className="text-xs font-medium fill-current text-foreground"
              >
                {node.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Tree visualization for tree algorithms
const renderTreeVisualization = (root: TreeNode) => {
  const width = 600;
  const height = 400;
  
  // Calculate tree layout (simplified)
  const renderTreeNodes = (node: TreeNode, x: number, y: number, level: number, maxWidth: number) => {
    const nodeRadius = 25;
    const levelHeight = 80;
    const elements: JSX.Element[] = [];
    
    // Calculate node status class
    const nodeClassName = node.status === 'active' 
      ? 'fill-orange-500' 
      : node.status === 'comparing'
        ? 'fill-yellow-400'
        : node.status === 'sorted'
          ? 'fill-green-500'
          : 'fill-gray-200';
    
    // Add current node
    elements.push(
      <g key={`node-${x}-${y}`} className="transition-all duration-300">
        <circle
          cx={x}
          cy={y}
          r={nodeRadius}
          className={`${nodeClassName} stroke-2 stroke-gray-700 transition-all duration-300`}
        />
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dy=".3em"
          className="text-sm font-medium fill-current text-foreground"
        >
          {node.value}
        </text>
      </g>
    );
    
    // Calculate positions for children
    const nextLevelWidth = maxWidth / 2;
    
    // Draw left child if exists
    if (node.left) {
      const leftX = x - nextLevelWidth;
      const leftY = y + levelHeight;
      
      // Draw edge to left child
      elements.push(
        <line
          key={`edge-${x}-${leftX}`}
          x1={x}
          y1={y + nodeRadius}
          x2={leftX}
          y2={leftY - nodeRadius}
          className="stroke-gray-400 stroke-[2px]"
        />
      );
      
      // Recursively draw left subtree
      elements.push(...renderTreeNodes(node.left, leftX, leftY, level + 1, nextLevelWidth));
    }
    
    // Draw right child if exists
    if (node.right) {
      const rightX = x + nextLevelWidth;
      const rightY = y + levelHeight;
      
      // Draw edge to right child
      elements.push(
        <line
          key={`edge-${x}-${rightX}`}
          x1={x}
          y1={y + nodeRadius}
          x2={rightX}
          y2={rightY - nodeRadius}
          className="stroke-gray-400 stroke-[2px]"
        />
      );
      
      // Recursively draw right subtree
      elements.push(...renderTreeNodes(node.right, rightX, rightY, level + 1, nextLevelWidth));
    }
    
    return elements;
  };
  
  return (
    <div className="relative h-96 w-full mb-6 border-2 border-dashed border-secondary/30 rounded-lg flex items-center justify-center">
      <svg width={width} height={height} className="overflow-visible">
        {renderTreeNodes(root, width / 2, 60, 0, width / 3)}
      </svg>
    </div>
  );
};
