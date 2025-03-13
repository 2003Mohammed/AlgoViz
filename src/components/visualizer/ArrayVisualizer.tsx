
import React from 'react';
import { ArrayItem, GraphData, TreeNode } from '../../types/visualizer';
import { getStatusColor } from '../../utils/visualizerUtils';
import { motion } from 'framer-motion';

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

// Bar chart visualization for sorting algorithms with height constraint
const renderBarChart = (array: ArrayItem[]) => {
  // Find max value for proper scaling
  const maxValue = Math.max(...array.map(item => item.value), 100);
  
  return (
    <div className="relative h-64 flex items-end justify-center gap-1 mb-6 overflow-hidden">
      {array.map((item, index) => {
        // Scale height to percentage of container height (max 80%)
        const heightPercentage = Math.min((item.value / maxValue) * 80, 80);
        
        return (
          <motion.div
            key={index}
            className={`w-8 rounded-t-md ${getStatusColor(item.status)} transition-all duration-300 relative group`}
            style={{ height: `${heightPercentage}%` }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-xs text-center absolute bottom-0 w-full transform translate-y-full pt-1">{item.value}</div>
            <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 transition-opacity duration-300">
              {item.value}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Horizontal array visualization for search algorithms
const renderSearchArray = (array: ArrayItem[]) => {
  return (
    <div className="relative h-32 flex items-center justify-center gap-1 mb-6">
      {array.map((item, index) => (
        <motion.div
          key={index}
          className={`h-16 w-12 flex items-center justify-center border border-1 rounded-md ${getStatusColor(item.status)} transition-all duration-300`}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
          }}
        >
          <div className="text-sm text-center">{item.value}</div>
        </motion.div>
      ))}
    </div>
  );
};

// Enhanced Graph visualization for graph algorithms with 3D-like effects
const renderGraphVisualization = (graphData: GraphData) => {
  const width = 600;
  const height = 400;
  
  return (
    <div className="relative h-96 w-full mb-6 border-2 border-dashed border-secondary/30 rounded-lg flex items-center justify-center perspective-1000">
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
              <motion.line
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                className={`${edgeClassName} transition-all duration-300`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.05 }}
              />
              {edge.weight !== undefined && (
                <motion.text
                  x={(source.x + target.x) / 2}
                  y={(source.y + target.y) / 2}
                  dy={-5}
                  className="text-xs fill-current text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.05 }}
                >
                  {edge.weight}
                </motion.text>
              )}
            </g>
          );
        })}
        
        {/* Render nodes */}
        {graphData.nodes.map((node, idx) => {
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
            <motion.g 
              key={node.id} 
              className="transition-all duration-300"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring", 
                duration: 0.5, 
                delay: idx * 0.1,
                bounce: 0.5 
              }}
              whileHover={{ scale: 1.15 }}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={20}
                className={`${nodeClassName} stroke-2 stroke-gray-700 transition-all duration-300 shadow-lg`}
                filter="drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.3))"
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
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
};

// Enhanced Tree visualization with 3D-like effects
const renderTreeVisualization = (root: TreeNode) => {
  const width = 600;
  const height = 400;
  
  // Calculate tree layout (simplified)
  const renderTreeNodes = (node: TreeNode, x: number, y: number, level: number, maxWidth: number, index: number = 0) => {
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
    
    // Add current node with 3D-like effect
    elements.push(
      <motion.g 
        key={`node-${x}-${y}`} 
        className="transition-all duration-300"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 15, 
          delay: level * 0.2 + index * 0.1 
        }}
        whileHover={{ scale: 1.1 }}
      >
        <circle
          cx={x}
          cy={y}
          r={nodeRadius}
          className={`${nodeClassName} stroke-2 stroke-gray-700 transition-all duration-300`}
          filter="drop-shadow(3px 3px 4px rgba(0, 0, 0, 0.3))"
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
      </motion.g>
    );
    
    // Calculate positions for children
    const nextLevelWidth = maxWidth / 2;
    
    // Draw left child if exists
    if (node.left) {
      const leftX = x - nextLevelWidth;
      const leftY = y + levelHeight;
      
      // Draw edge to left child
      elements.push(
        <motion.line
          key={`edge-${x}-${leftX}`}
          x1={x}
          y1={y + nodeRadius}
          x2={leftX}
          y2={leftY - nodeRadius}
          className="stroke-gray-400 stroke-[2px]"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: level * 0.2 + 0.3 }}
        />
      );
      
      // Recursively draw left subtree
      elements.push(...renderTreeNodes(node.left, leftX, leftY, level + 1, nextLevelWidth, index * 2));
    }
    
    // Draw right child if exists
    if (node.right) {
      const rightX = x + nextLevelWidth;
      const rightY = y + levelHeight;
      
      // Draw edge to right child
      elements.push(
        <motion.line
          key={`edge-${x}-${rightX}`}
          x1={x}
          y1={y + nodeRadius}
          x2={rightX}
          y2={rightY - nodeRadius}
          className="stroke-gray-400 stroke-[2px]"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: level * 0.2 + 0.3 }}
        />
      );
      
      // Recursively draw right subtree
      elements.push(...renderTreeNodes(node.right, rightX, rightY, level + 1, nextLevelWidth, index * 2 + 1));
    }
    
    return elements;
  };
  
  return (
    <div className="relative h-96 w-full mb-6 border-2 border-dashed border-secondary/30 rounded-lg flex items-center justify-center perspective-1000">
      <svg width={width} height={height} className="overflow-visible">
        {renderTreeNodes(root, width / 2, 60, 0, width / 3)}
      </svg>
    </div>
  );
};
