
import React from 'react';
import { motion } from 'framer-motion';

interface TreeNode {
  value: any;
  left: number | null;
  right: number | null;
  status?: 'default' | 'current' | 'visited' | 'completed' | 'root' | 'final';
}

interface BinaryTreeStructure {
  nodes: TreeNode[];
  root: number | null;
}

interface BinaryTreeRendererProps {
  tree: BinaryTreeStructure;
  animationStep?: any;
  currentStep?: number;
}

export const BinaryTreeRenderer: React.FC<BinaryTreeRendererProps> = ({ tree, animationStep, currentStep }) => {
  const { nodes, root } = tree;

  const getNodeColor = (node: TreeNode, nodeIndex: number) => {
    const status = animationStep?.nodes?.[nodeIndex]?.status || node.status || 'default';
    switch (status) {
      case 'current': return 'fill-yellow-500 stroke-yellow-600';
      case 'visited': return 'fill-orange-500 stroke-orange-600';
      case 'completed': return 'fill-green-500 stroke-green-600';
      case 'root': return 'fill-purple-500 stroke-purple-600';
      case 'final': return 'fill-blue-500 stroke-blue-600';
      default: return 'fill-primary stroke-primary-foreground';
    }
  };

  const getTextColor = (node: TreeNode, nodeIndex: number) => {
    const status = animationStep?.nodes?.[nodeIndex]?.status || node.status || 'default';
    return status === 'default' ? 'fill-primary-foreground' : 'fill-white';
  };

  if (nodes.length === 0 || root === null) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">Empty Binary Tree</p>
          <p className="text-sm">Insert nodes to see visualization</p>
        </div>
      </div>
    );
  }

  const renderNode = (nodeIndex: number | null, x: number, y: number, level: number): JSX.Element | null => {
    if (nodeIndex === null || !nodes[nodeIndex]) return null;

    const node = nodes[nodeIndex];
    const nodeSize = 40;
    const horizontalSpacing = Math.max(80, 200 / (level + 1));

    return (
      <g key={`node-${nodeIndex}-${x}-${y}`}>
        {/* Lines to children */}
        {node.left !== null && (
          <line
            x1={x}
            y1={y + nodeSize / 2}
            x2={x - horizontalSpacing}
            y2={y + 80}
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground"
          />
        )}
        {node.right !== null && (
          <line
            x1={x}
            y1={y + nodeSize / 2}
            x2={x + horizontalSpacing}
            y2={y + 80}
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground"
          />
        )}

        {/* Node circle */}
        <motion.circle
          cx={x}
          cy={y}
          r={nodeSize / 2}
          className={`${getNodeColor(node, nodeIndex)} stroke-2`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: level * 0.1 }}
        />

        {/* Node value */}
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          className={`${getTextColor(node, nodeIndex)} text-sm font-bold`}
        >
          {node.value}
        </text>

        {/* Render children */}
        {renderNode(node.left, x - horizontalSpacing, y + 80, level + 1)}
        {renderNode(node.right, x + horizontalSpacing, y + 80, level + 1)}
      </g>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-64 p-8">
      <svg width="600" height="400" className="overflow-visible">
        {renderNode(root, 300, 50, 0)}
      </svg>
    </div>
  );
};
