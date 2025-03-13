
import React from 'react';
import { motion } from 'framer-motion';

interface BinaryTreeStructure {
  nodes: Array<{
    value: any;
    left: number | null;
    right: number | null;
  }>;
  root: number | null;
}

interface BinaryTreeRendererProps {
  tree: BinaryTreeStructure;
}

export const BinaryTreeRenderer: React.FC<BinaryTreeRendererProps> = ({ tree }) => {
  const { nodes, root } = tree;
  
  if (!nodes || nodes.length === 0 || root === null) {
    return <div className="text-muted-foreground">Binary tree is empty</div>;
  }
  
  // Helper function to recursively render tree nodes
  const renderTreeNode = (nodeIndex: number, x: number, y: number, level: number, width: number) => {
    if (nodeIndex === null || nodeIndex >= nodes.length) return null;
    
    const node = nodes[nodeIndex];
    const elements = [];
    
    // Draw current node
    elements.push(
      <motion.g 
        key={`node-${nodeIndex}`}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20, 
          delay: level * 0.2 
        }}
        whileHover={{ scale: 1.1 }}
      >
        <circle
          cx={x}
          cy={y}
          r={20}
          className="fill-primary/20 stroke-primary"
          filter="drop-shadow(2px 3px 2px rgba(0, 0, 0, 0.2))"
        />
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dy=".3em"
          className="text-xs fill-foreground font-medium"
        >
          {node.value}
        </text>
      </motion.g>
    );
    
    // Draw left child
    if (node.left !== null) {
      const leftX = x - width / 2;
      const leftY = y + 60;
      
      // Draw edge to left child
      elements.push(
        <motion.line
          key={`edge-${nodeIndex}-${node.left}`}
          x1={x}
          y1={y + 20}
          x2={leftX}
          y2={leftY - 20}
          className="stroke-primary/60 stroke-1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: level * 0.2 + 0.2 }}
        />
      );
      
      // Recursively render left subtree
      const leftElements = renderTreeNode(node.left, leftX, leftY, level + 1, width / 2);
      if (leftElements) elements.push(...leftElements);
    }
    
    // Draw right child
    if (node.right !== null) {
      const rightX = x + width / 2;
      const rightY = y + 60;
      
      // Draw edge to right child
      elements.push(
        <motion.line
          key={`edge-${nodeIndex}-${node.right}`}
          x1={x}
          y1={y + 20}
          x2={rightX}
          y2={rightY - 20}
          className="stroke-primary/60 stroke-1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: level * 0.2 + 0.2 }}
        />
      );
      
      // Recursively render right subtree
      const rightElements = renderTreeNode(node.right, rightX, rightY, level + 1, width / 2);
      if (rightElements) elements.push(...rightElements);
    }
    
    return elements;
  };
  
  return (
    <div className="flex justify-center items-center h-64 perspective-1000">
      <svg width="600" height="240" className="overflow-visible">
        <motion.rect
          x="0"
          y="0"
          width="600"
          height="240"
          rx="8"
          className="fill-muted/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.5 }}
        />
        {renderTreeNode(root, 300, 40, 0, 240)}
      </svg>
    </div>
  );
};
