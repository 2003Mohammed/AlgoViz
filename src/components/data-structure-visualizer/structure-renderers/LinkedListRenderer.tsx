
import React from 'react';
import { motion } from 'framer-motion';

interface LinkedListStructure {
  nodes: Array<{
    value: any;
    next: number | null;
  }>;
  head: number | null;
}

interface LinkedListRendererProps {
  structure: LinkedListStructure;
}

export const LinkedListRenderer: React.FC<LinkedListRendererProps> = ({ structure }) => {
  // Add safety checks and default values
  const nodes = structure?.nodes || [];
  const head = structure?.head ?? null;
  
  console.log('LinkedListRenderer - structure:', structure);
  console.log('LinkedListRenderer - nodes:', nodes);
  console.log('LinkedListRenderer - head:', head);
  
  return (
    <div className="flex flex-wrap gap-1 justify-center items-center">
      {head !== null && nodes.length > 0 ? (
        <>
          <motion.div 
            className="px-2 py-1 text-xs font-medium bg-primary/20 rounded-md mb-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Head
          </motion.div>
          <div className="flex flex-wrap gap-1 justify-center items-center">
            {(() => {
              const renderedNodes = [];
              let currentIndex = head;
              
              while (currentIndex !== null && currentIndex < nodes.length) {
                const node = nodes[currentIndex];
                if (!node) break; // Safety check for undefined node
                
                const isLast = node.next === null;
                
                renderedNodes.push(
                  <React.Fragment key={currentIndex}>
                    <motion.div 
                      className="w-12 h-12 flex items-center justify-center border border-primary/50 rounded-md bg-primary/10"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring", 
                        stiffness: 260, 
                        damping: 20,
                        delay: currentIndex * 0.1
                      }}
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(var(--primary), 0.2)" }}
                    >
                      {node.value}
                    </motion.div>
                    {!isLast && (
                      <motion.div 
                        className="w-6 flex items-center justify-center"
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 24, opacity: 1 }}
                        transition={{ duration: 0.3, delay: currentIndex * 0.1 + 0.1 }}
                      >
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.3, delay: currentIndex * 0.1 + 0.2 }}
                          style={{ originX: 0 }}
                        >
                          →
                        </motion.div>
                      </motion.div>
                    )}
                  </React.Fragment>
                );
                
                currentIndex = node.next;
              }
              
              return renderedNodes;
            })()}
          </div>
        </>
      ) : (
        <div className="text-muted-foreground">Linked list is empty</div>
      )}
    </div>
  );
};
