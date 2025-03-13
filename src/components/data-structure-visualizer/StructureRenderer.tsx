
import React from 'react';
import { 
  ArrayRenderer, 
  LinkedListRenderer, 
  StackRenderer, 
  QueueRenderer, 
  BinaryTreeRenderer, 
  HashTableRenderer, 
  GraphRenderer 
} from './structure-renderers';

interface StructureRendererProps {
  structure: any;
  dataStructureId: string;
}

export const StructureRenderer: React.FC<StructureRendererProps> = ({ 
  structure, 
  dataStructureId 
}) => {
  switch (dataStructureId) {
    case 'array':
      return <ArrayRenderer array={structure} />;
      
    case 'linked-list':
      return <LinkedListRenderer structure={structure} />;
      
    case 'stack':
      return <StackRenderer stack={structure} />;
      
    case 'queue':
      return <QueueRenderer queue={structure} />;
      
    case 'binary-tree':
      return <BinaryTreeRenderer tree={structure} />;
      
    case 'hash-table':
      return <HashTableRenderer table={structure} />;
      
    case 'graph':
      return <GraphRenderer graph={structure} />;
      
    default:
      return (
        <div className="text-center text-muted-foreground">
          Visualization for this data structure is not available yet.
        </div>
      );
  }
};
