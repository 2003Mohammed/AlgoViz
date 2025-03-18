
import React from 'react';
import { ArrayOperations } from './ArrayOperations';
import { LinkedListOperations } from './LinkedListOperations';
import { StackOperations } from './StackOperations';
import { QueueOperations } from './QueueOperations';
import { BinaryTreeOperations } from './BinaryTreeOperations';
import { HashTableOperations } from './HashTableOperations';
import { GraphOperations } from './GraphOperations';

interface OperationControlsProps {
  dataStructureId: string;
  handleOperation: (operation: string) => void;
}

export const OperationControls: React.FC<OperationControlsProps> = ({ 
  dataStructureId, 
  handleOperation 
}) => {
  switch (dataStructureId) {
    case 'array':
      return <ArrayOperations handleOperation={handleOperation} />;
    case 'linked-list':
      return <LinkedListOperations handleOperation={handleOperation} />;
    case 'stack':
      return <StackOperations handleOperation={handleOperation} />;
    case 'queue':
      return <QueueOperations handleOperation={handleOperation} />;
    case 'binary-tree':
      return <BinaryTreeOperations handleOperation={handleOperation} />;
    case 'hash-table':
      return <HashTableOperations handleOperation={handleOperation} />;
    case 'graph':
      return <GraphOperations handleOperation={handleOperation} />;
    default:
      return null;
  }
};
