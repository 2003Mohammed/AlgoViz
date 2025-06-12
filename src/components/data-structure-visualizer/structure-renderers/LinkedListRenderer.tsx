
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface LinkedListNode {
  value: any;
  next: number | null;
}

interface LinkedListStructure {
  nodes: LinkedListNode[];
  head: number | null;
}

interface LinkedListRendererProps {
  structure: LinkedListStructure;
}

export const LinkedListRenderer: React.FC<LinkedListRendererProps> = ({ structure }) => {
  console.log('LinkedListRenderer received structure:', structure);
  
  // Safety checks and default values
  const nodes = structure?.nodes || [];
  const head = structure?.head ?? null;
  
  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 cyber-panel">
        <p className="text-muted-foreground text-sm">Empty Linked List</p>
      </div>
    );
  }

  const renderNode = (node: LinkedListNode, index: number, isHead: boolean) => (
    <motion.div
      key={`node-${index}`}
      className="flex items-center gap-2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className={`
        cyber-card min-w-[60px] h-12 flex items-center justify-center text-sm font-mono
        ${isHead ? 'border-cyber-primary shadow-[0_0_15px_rgba(0,243,255,0.7)]' : 'border-cyber-primary/50'}
      `}>
        {node.value}
      </div>
      {node.next !== null && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.2 }}
        >
          <ArrowRight className="h-4 w-4 text-cyber-primary" />
        </motion.div>
      )}
    </motion.div>
  );

  const renderLinkedList = () => {
    const renderedNodes = [];
    let current = head;
    let index = 0;

    while (current !== null && index < nodes.length) {
      const node = nodes[current];
      if (!node) break;
      
      renderedNodes.push(renderNode(node, index, index === 0));
      current = node.next;
      index++;
      
      // Prevent infinite loops
      if (index > 20) break;
    }

    return renderedNodes;
  };

  return (
    <div className="cyber-panel p-6">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-cyber-primary mb-2">Linked List Visualization</h3>
        <div className="flex items-center gap-1 flex-wrap">
          {renderLinkedList()}
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground space-y-1">
        <p>Nodes: {nodes.length}</p>
        <p>Head: {head !== null ? nodes[head]?.value : 'null'}</p>
      </div>
    </div>
  );
};
