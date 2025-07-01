
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BinaryTreeNode {
  value: any;
  left: number | null;
  right: number | null;
  status?: string;
}

interface BinaryTreeStructure {
  nodes: BinaryTreeNode[];
  root: number | null;
}

interface BinaryTreeRendererProps {
  tree: BinaryTreeStructure;
}

export const BinaryTreeRenderer: React.FC<BinaryTreeRendererProps> = ({ tree }) => {
  const { nodes, root } = tree;
  
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'comparing':
      case 'active':
        return 'fill-yellow-400 stroke-yellow-500';
      case 'removing':
        return 'fill-red-400 stroke-red-500';
      case 'added':
        return 'fill-emerald-400 stroke-emerald-500';
      case 'found':
        return 'fill-green-400 stroke-green-500';
      default:
        return 'fill-orange-200 dark:fill-orange-800 stroke-orange-400 dark:stroke-orange-600';
    }
  };

  if (!nodes || nodes.length === 0 || root === null) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div 
          className="text-center p-8 border-2 border-dashed border-muted-foreground/30 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-muted-foreground text-lg mb-2">Empty Binary Tree</div>
          <div className="text-sm text-muted-foreground">Insert nodes to build the tree structure</div>
        </motion.div>
      </div>
    );
  }
  
  const renderTreeNode = (nodeIndex: number, x: number, y: number, level: number, width: number): JSX.Element[] => {
    if (nodeIndex === null || nodeIndex >= nodes.length) return [];
    
    const node = nodes[nodeIndex];
    const elements: JSX.Element[] = [];
    
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
          delay: level * 0.3 
        }}
      >
        <motion.circle
          cx={x}
          cy={y}
          r={25}
          className={getStatusColor(node.status)}
          strokeWidth={2}
          whileHover={{ scale: 1.1 }}
          filter="drop-shadow(2px 3px 4px rgba(0, 0, 0, 0.2))"
        />
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dy=".35em"
          className="text-sm font-bold fill-gray-800 dark:fill-gray-200"
          style={{ pointerEvents: 'none' }}
        >
          {node.value}
        </text>
      </motion.g>
    );
    
    // Draw edges and child nodes
    if (node.left !== null && node.left < nodes.length) {
      const leftX = x - width / 2;
      const leftY = y + 80;
      
      // Edge to left child
      elements.push(
        <motion.line
          key={`edge-left-${nodeIndex}`}
          x1={x - 20}
          y1={y + 20}
          x2={leftX + 20}
          y2={leftY - 20}
          className="stroke-primary stroke-2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 0.5, delay: level * 0.3 + 0.2 }}
        />
      );
      
      // Recursively render left subtree
      elements.push(...renderTreeNode(node.left, leftX, leftY, level + 1, width / 2));
    }
    
    if (node.right !== null && node.right < nodes.length) {
      const rightX = x + width / 2;
      const rightY = y + 80;
      
      // Edge to right child
      elements.push(
        <motion.line
          key={`edge-right-${nodeIndex}`}
          x1={x + 20}
          y1={y + 20}
          x2={rightX - 20}
          y2={rightY - 20}
          className="stroke-primary stroke-2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 0.5, delay: level * 0.3 + 0.2 }}
        />
      );
      
      // Recursively render right subtree
      elements.push(...renderTreeNode(node.right, rightX, rightY, level + 1, width / 2));
    }
    
    return elements;
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <div className="w-full max-w-6xl">
        <svg width="100%" height="400" viewBox="0 0 800 400" className="overflow-visible">
          {/* Background */}
          <motion.rect
            x="0"
            y="0"
            width="800"
            height="400"
            rx="12"
            className="fill-muted/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Tree nodes and edges */}
          <AnimatePresence>
            {renderTreeNode(root, 400, 60, 0, 300)}
          </AnimatePresence>
        </svg>
      </div>
      
      {/* Tree Info */}
      <motion.div 
        className="mt-6 flex items-center gap-4 text-sm bg-muted/50 rounded-full px-6 py-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <span>Nodes: <strong>{nodes.length}</strong></span>
        <span className="text-muted-foreground">•</span>
        <span>Root: <strong>{root !== null && nodes[root] ? nodes[root].value : 'None'}</strong></span>
        <span className="text-muted-foreground">•</span>
        <span className="text-xs text-muted-foreground">Hierarchical structure with parent-child relationships</span>
      </motion.div>
    </div>
  );
};
