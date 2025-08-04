import React from 'react';
import { Plus, Search, Play, SkipForward, SkipBack } from 'lucide-react';
import { OperationButton } from './OperationButton';
import { Button } from '../../ui/button';

interface BinaryTreeOperationsProps {
  handleOperation: (operation: string) => void;
  currentStep?: number;
  totalSteps?: number;
  isPlaying?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  onTogglePlay?: () => void;
}

export const BinaryTreeOperations: React.FC<BinaryTreeOperationsProps> = ({ 
  handleOperation,
  currentStep = 0,
  totalSteps = 0,
  isPlaying = false,
  onNext,
  onPrevious,
  onTogglePlay
}) => {
  return (
    <div className="space-y-4">
      {/* Tree Operations */}
      <div className="flex flex-wrap gap-2 justify-center">
        <OperationButton 
          operation="generate"
          handleOperation={handleOperation}
          icon={<Plus className="h-4 w-4" />}
          label="Generate Tree"
        />
        <OperationButton 
          operation="inorder"
          handleOperation={handleOperation}
          icon={<Search className="h-4 w-4" />}
          label="Inorder"
        />
        <OperationButton 
          operation="preorder"
          handleOperation={handleOperation}
          icon={<Search className="h-4 w-4" />}
          label="Preorder"
        />
        <OperationButton 
          operation="postorder"
          handleOperation={handleOperation}
          icon={<Search className="h-4 w-4" />}
          label="Postorder"
        />
        <OperationButton 
          operation="bfs"
          handleOperation={handleOperation}
          icon={<Search className="h-4 w-4" />}
          label="BFS"
        />
      </div>

      {/* Traversal Controls */}
      {totalSteps > 0 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevious}
            disabled={currentStep <= 0}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onTogglePlay}
          >
            <Play className="h-4 w-4" />
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onNext}
            disabled={currentStep >= totalSteps - 1}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          
          <span className="text-sm text-muted-foreground ml-2">
            {currentStep + 1} / {totalSteps}
          </span>
        </div>
      )}

      {/* Learning Resources */}
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        <Button variant="ghost" size="sm" asChild>
          <a href="https://www.geeksforgeeks.org/binary-tree-data-structure/" target="_blank" rel="noopener noreferrer">
            📚 GeeksforGeeks
          </a>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <a href="https://www.w3schools.com/dsa/dsa_algo_binarytrees.asp" target="_blank" rel="noopener noreferrer">
            📖 W3Schools
          </a>
        </Button>
      </div>
    </div>
  );
};