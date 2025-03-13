
import React from 'react';

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
  const { nodes, head } = structure;
  
  return (
    <div className="flex flex-wrap gap-1 justify-center items-center">
      {head !== null && nodes.length > 0 ? (
        <>
          <div className="px-2 py-1 text-xs font-medium bg-primary/20 rounded-md mb-2">
            Head
          </div>
          <div className="flex flex-wrap gap-1 justify-center items-center">
            {(() => {
              const renderedNodes = [];
              let currentIndex = head;
              
              while (currentIndex !== null) {
                const node = nodes[currentIndex];
                const isLast = node.next === null;
                
                renderedNodes.push(
                  <React.Fragment key={currentIndex}>
                    <div className="w-12 h-12 flex items-center justify-center border border-primary/50 rounded-md bg-primary/10">
                      {node.value}
                    </div>
                    {!isLast && (
                      <div className="w-6 flex items-center justify-center">
                        →
                      </div>
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
