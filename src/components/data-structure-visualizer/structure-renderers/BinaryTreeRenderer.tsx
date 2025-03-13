
import React from 'react';

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
      <g key={`node-${nodeIndex}`}>
        <circle
          cx={x}
          cy={y}
          r={20}
          className="fill-primary/20 stroke-primary"
        />
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dy=".3em"
          className="text-xs fill-foreground"
        >
          {node.value}
        </text>
      </g>
    );
    
    // Draw left child
    if (node.left !== null) {
      const leftX = x - width / 2;
      const leftY = y + 60;
      
      // Draw edge to left child
      elements.push(
        <line
          key={`edge-${nodeIndex}-${node.left}`}
          x1={x}
          y1={y + 20}
          x2={leftX}
          y2={leftY - 20}
          className="stroke-primary/60 stroke-1"
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
        <line
          key={`edge-${nodeIndex}-${node.right}`}
          x1={x}
          y1={y + 20}
          x2={rightX}
          y2={rightY - 20}
          className="stroke-primary/60 stroke-1"
        />
      );
      
      // Recursively render right subtree
      const rightElements = renderTreeNode(node.right, rightX, rightY, level + 1, width / 2);
      if (rightElements) elements.push(...rightElements);
    }
    
    return elements;
  };
  
  return (
    <div className="flex justify-center items-center h-64">
      <svg width="600" height="240" className="overflow-visible">
        {renderTreeNode(root, 300, 40, 0, 240)}
      </svg>
    </div>
  );
};
