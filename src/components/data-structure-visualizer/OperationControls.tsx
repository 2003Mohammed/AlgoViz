
import React from 'react';
import { Button } from '../ui/button';
import { PlusCircle, MinusCircle } from 'lucide-react';

interface OperationControlsProps {
  dataStructureId: string;
  handleOperation: (operation: string) => void;
}

export const OperationControls: React.FC<OperationControlsProps> = ({ 
  dataStructureId, 
  handleOperation 
}) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {dataStructureId === 'array' && (
        <>
          <Button 
            onClick={() => handleOperation('add')}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add
          </Button>
          <Button 
            onClick={() => handleOperation('remove')}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <MinusCircle className="h-4 w-4" />
            Remove
          </Button>
          <Button 
            onClick={() => handleOperation('search')}
            variant="outline"
            size="sm"
          >
            Search
          </Button>
        </>
      )}
      
      {dataStructureId === 'linked-list' && (
        <>
          <Button 
            onClick={() => handleOperation('add')}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add
          </Button>
          <Button 
            onClick={() => handleOperation('remove')}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <MinusCircle className="h-4 w-4" />
            Remove
          </Button>
          <Button 
            onClick={() => handleOperation('search')}
            variant="outline"
            size="sm"
          >
            Search
          </Button>
        </>
      )}
      
      {dataStructureId === 'stack' && (
        <>
          <Button 
            onClick={() => handleOperation('push')}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Push
          </Button>
          <Button 
            onClick={() => handleOperation('pop')}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <MinusCircle className="h-4 w-4" />
            Pop
          </Button>
          <Button 
            onClick={() => handleOperation('peek')}
            variant="outline"
            size="sm"
          >
            Peek
          </Button>
        </>
      )}
    </div>
  );
};
