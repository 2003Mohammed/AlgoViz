
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface LinkedListNode {
  value: any;
  next: number | null;
  status?: string;
}

interface LinkedListStructure {
  nodes: LinkedListNode[];
  head: number | null;
}

interface LinkedListRendererProps {
  structure: LinkedListStructure;
}

export const LinkedListRenderer: React.FC<LinkedListRendererProps> = ({ structure }) => {
  const nodes = structure?.nodes || [];
  const head = structure?.head ?? null;
  
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'comparing':
      case 'active':
        return 'bg-yellow-400 border-yellow-500 text-yellow-900';
      case 'removing':
        return 'bg-red-400 border-red-500 text-red-900';
      case 'added':
        return 'bg-emerald-400 border-emerald-500 text-emerald-900';
      case 'found':
        return 'bg-green-400 border-green-500 text-green-900';
      default:
        return 'bg-cyan-100 dark:bg-cyan-900 border-cyan-300 dark:border-cyan-700 text-cyan-900 dark:text-cyan-100';
    }
  };

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div 
          className="text-center p-8 border-2 border-dashed border-muted-foreground/30 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-muted-foreground text-lg mb-2">Empty Linked List</div>
          <div className="text-sm text-muted-foreground">Add nodes to see the connections</div>
        </motion.div>
      </div>
    );
  }

  const renderLinkedList = () => {
    const renderedNodes = [];
    let current = head;
    let index = 0;

    while (current !== null && index < nodes.length) {
      const node = nodes[current];
      if (!node) break;
      
      renderedNodes.push(
        <motion.div
          key={`node-${current}-${index}`}
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ 
            delay: index * 0.2,
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
        >
          {/* Node */}
          <motion.div 
            className={`
              flex items-center justify-center w-16 h-16 border-2 rounded-lg font-mono font-bold text-sm
              shadow-lg transition-all duration-300 ${getStatusColor(node.status)}
            `}
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)"
            }}
          >
            {node.value}
          </motion.div>
          
          {/* Arrow to next node */}
          {node.next !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 + 0.1 }}
              className="flex items-center gap-1"
            >
              <div className="w-8 h-0.5 bg-primary"></div>
              <ArrowRight className="h-4 w-4 text-primary" />
            </motion.div>
          )}
          
          {/* NULL pointer */}
          {node.next === null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.2 + 0.2 }}
              className="flex items-center gap-1 text-muted-foreground"
            >
              <div className="w-8 h-0.5 bg-muted-foreground"></div>
              <div className="text-xs bg-muted px-2 py-1 rounded">NULL</div>
            </motion.div>
          )}
        </motion.div>
      );
      
      current = node.next;
      index++;
      
      if (index > 20) break; // Prevent infinite loops
    }

    return renderedNodes;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      {/* Head Pointer */}
      <motion.div 
        className="mb-6 flex items-center gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm font-medium">
          HEAD
        </div>
        <div className="w-4 h-0.5 bg-primary"></div>
        <ArrowRight className="h-4 w-4 text-primary" />
      </motion.div>
      
      {/* Linked List Chain */}
      <div className="flex items-center flex-wrap gap-3 justify-center max-w-4xl">
        {renderLinkedList()}
      </div>
      
      {/* Info Panel */}
      <motion.div 
        className="mt-8 flex items-center gap-4 text-sm bg-muted/50 rounded-full px-6 py-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span>Nodes: <strong>{nodes.length}</strong></span>
        <span className="text-muted-foreground">•</span>
        <span>Head: <strong>{head !== null && nodes[head] ? nodes[head].value : 'None'}</strong></span>
        <span className="text-muted-foreground">•</span>
        <span className="text-xs text-muted-foreground">Dynamic size, pointer-based structure</span>
      </motion.div>
    </div>
  );
};
