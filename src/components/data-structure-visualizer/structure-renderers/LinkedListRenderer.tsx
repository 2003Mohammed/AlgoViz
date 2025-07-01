
import React from 'react';
import { motion } from 'framer-motion';

interface LinkedListNode {
  value: any;
  next: number | null;
  prev?: number | null;
}

interface LinkedListStructure {
  nodes: LinkedListNode[];
  head: number | null;
  tail?: number | null;
  type?: 'singly' | 'doubly' | 'circular' | 'circular-doubly';
}

interface LinkedListRendererProps {
  structure: LinkedListStructure;
}

export const LinkedListRenderer: React.FC<LinkedListRendererProps> = ({ structure }) => {
  const { nodes, head, type = 'singly' } = structure;

  if (nodes.length === 0 || head === null) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">Empty Linked List</p>
          <p className="text-sm">Insert nodes to see visualization</p>
        </div>
      </div>
    );
  }

  const renderNode = (nodeIndex: number, position: number) => {
    const node = nodes[nodeIndex];
    if (!node) return null;

    const isHead = nodeIndex === head;
    const hasNext = node.next !== null;
    const hasPrev = type.includes('doubly') && node.prev !== null;

    return (
      <motion.div
        key={`node-${nodeIndex}-${position}`}
        className="flex items-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: position * 0.1 }}
      >
        {/* Previous pointer for doubly linked lists */}
        {hasPrev && (
          <div className="flex items-center mr-2">
            <div className="w-6 h-0.5 bg-blue-400"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          </div>
        )}

        {/* Node */}
        <div className={`flex items-center ${isHead ? 'ring-2 ring-yellow-400' : ''}`}>
          <div className="bg-primary text-primary-foreground w-12 h-12 rounded-lg flex items-center justify-center font-bold text-sm shadow-lg">
            {node.value}
          </div>
          
          {/* Next pointer */}
          {hasNext && (
            <div className="flex items-center ml-2">
              <div className="w-6 h-0.5 bg-green-400"></div>
              <div className="w-0 h-0 border-l-4 border-l-green-400 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
            </div>
          )}
        </div>

        {/* Circular connection indicator */}
        {type.includes('circular') && !hasNext && nodes.length > 1 && (
          <div className="ml-4 text-xs text-muted-foreground">
            ↻ to head
          </div>
        )}
      </motion.div>
    );
  };

  const renderLinkedList = () => {
    const renderedNodes = [];
    let current = head;
    let position = 0;
    const visited = new Set<number>();

    while (current !== null && !visited.has(current) && position < nodes.length) {
      visited.add(current);
      renderedNodes.push(renderNode(current, position));
      current = nodes[current]?.next || null;
      position++;
    }

    return renderedNodes;
  };

  return (
    <div className="flex items-center justify-center min-h-64 p-8">
      <div className="space-y-4">
        <div className="text-center text-sm text-muted-foreground">
          {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')} Linked List
        </div>
        
        <div className="flex items-center space-x-4 overflow-x-auto">
          {head !== null && (
            <div className="text-xs text-yellow-600 mr-2">
              HEAD →
            </div>
          )}
          {renderLinkedList()}
        </div>
        
        {/* Legend */}
        <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center">
            <div className="w-3 h-0.5 bg-green-400 mr-1"></div>
            <span>Next</span>
          </div>
          {type.includes('doubly') && (
            <div className="flex items-center">
              <div className="w-3 h-0.5 bg-blue-400 mr-1"></div>
              <span>Prev</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
