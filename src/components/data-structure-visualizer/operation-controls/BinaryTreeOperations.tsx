import React from 'react';
import { Plus, Search } from 'lucide-react';
import { OperationButton } from './OperationButton';

interface BinaryTreeOperationsProps {
  handleOperation: (operation: string) => void;
}

export const BinaryTreeOperations: React.FC<BinaryTreeOperationsProps> = ({ handleOperation }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-center">
        <OperationButton
          operation="generate"
          handleOperation={handleOperation}
          icon={<Plus className="h-4 w-4" />}
          label="Generate Tree"
        />
        <OperationButton operation="inorder" handleOperation={handleOperation} icon={<Search className="h-4 w-4" />} label="Inorder" />
        <OperationButton operation="preorder" handleOperation={handleOperation} icon={<Search className="h-4 w-4" />} label="Preorder" />
        <OperationButton operation="postorder" handleOperation={handleOperation} icon={<Search className="h-4 w-4" />} label="Postorder" />
        <OperationButton operation="levelorder" handleOperation={handleOperation} icon={<Search className="h-4 w-4" />} label="Level Order" />
      </div>
    </div>
  );
};
