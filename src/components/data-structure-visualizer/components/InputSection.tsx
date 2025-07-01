
import React from 'react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { ArrayOperations } from '../operation-controls/ArrayOperations';
import { LinkedListOperations } from '../operation-controls/LinkedListOperations';
import { StackOperations } from '../operation-controls/StackOperations';
import { QueueOperations } from '../operation-controls/QueueOperations';
import { BinaryTreeOperations } from '../operation-controls/BinaryTreeOperations';
import { HashTableOperations } from '../operation-controls/HashTableOperations';
import { GraphOperations } from '../operation-controls/GraphOperations';

interface InputSectionProps {
  dataStructureId: string;
  customInput: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOperation: (operation: string) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  dataStructureId,
  customInput,
  handleInputChange,
  handleOperation
}) => {
  const getPlaceholderText = () => {
    switch (dataStructureId) {
      case 'array':
        return 'Enter value or index:value for update';
      case 'linked-list':
        return 'Enter value to insert/search';
      case 'stack':
        return 'Enter value to push';
      case 'queue':
        return 'Enter value to enqueue';
      case 'binary-tree':
        return 'Enter value to insert/search';
      case 'hash-table':
        return 'Enter key:value for set, key for get';
      case 'graph':
        return 'Enter vertex name or edge (A-B)';
      default:
        return 'Enter value';
    }
  };

  const renderOperationControls = () => {
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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Input Value</label>
        <Input
          type="text"
          value={customInput}
          onChange={handleInputChange}
          placeholder={getPlaceholderText()}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Operations</label>
        {renderOperationControls()}
      </div>
    </div>
  );
};
