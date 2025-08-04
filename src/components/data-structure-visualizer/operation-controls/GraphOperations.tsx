import React from 'react';
import { Network, Play, SkipForward, SkipBack, Shuffle } from 'lucide-react';
import { OperationButton } from './OperationButton';
import { Button } from '../../ui/button';

interface GraphOperationsProps {
  handleOperation: (operation: string) => void;
  currentStep?: number;
  totalSteps?: number;
  isPlaying?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  onTogglePlay?: () => void;
}

export const GraphOperations: React.FC<GraphOperationsProps> = ({ 
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
      {/* Graph Operations */}
      <div className="flex flex-wrap gap-2 justify-center">
        <OperationButton 
          operation="generate"
          handleOperation={handleOperation}
          icon={<Shuffle className="h-4 w-4" />}
          label="Generate Graph"
        />
        <OperationButton 
          operation="bfs"
          handleOperation={handleOperation}
          icon={<Network className="h-4 w-4" />}
          label="BFS Traversal"
        />
        <OperationButton 
          operation="dfs"
          handleOperation={handleOperation}
          icon={<Network className="h-4 w-4" />}
          label="DFS Traversal"
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
          <a href="https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/" target="_blank" rel="noopener noreferrer">
            📚 GeeksforGeeks
          </a>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <a href="https://www.w3schools.com/dsa/dsa_algo_graphs.asp" target="_blank" rel="noopener noreferrer">
            📖 W3Schools
          </a>
        </Button>
      </div>
    </div>
  );
};