
import React from 'react';
import { Button } from '../ui/button';
import { PlusCircle, MinusCircle, Search, Eye, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

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
            className="flex items-center gap-1"
          >
            <Search className="h-4 w-4" />
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
            className="flex items-center gap-1"
          >
            <Search className="h-4 w-4" />
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
            <ArrowDownToLine className="h-4 w-4" />
            Push
          </Button>
          <Button 
            onClick={() => handleOperation('pop')}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <ArrowUpFromLine className="h-4 w-4" />
            Pop
          </Button>
          <Button 
            onClick={() => handleOperation('peek')}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Eye className="h-4 w-4" />
            Peek
          </Button>
        </>
      )}
      
      {dataStructureId === 'queue' && (
        <>
          <Button 
            onClick={() => handleOperation('enqueue')}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <ArrowDownToLine className="h-4 w-4" />
            Enqueue
          </Button>
          <Button 
            onClick={() => handleOperation('dequeue')}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <ArrowUpFromLine className="h-4 w-4" />
            Dequeue
          </Button>
        </>
      )}
      
      {dataStructureId === 'binary-tree' && (
        <>
          <Button 
            onClick={() => handleOperation('insert')}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Insert
          </Button>
          <Button 
            onClick={() => handleOperation('delete')}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <MinusCircle className="h-4 w-4" />
            Delete
          </Button>
          <Button 
            onClick={() => handleOperation('search')}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Search className="h-4 w-4" />
            Search
          </Button>
        </>
      )}
      
      {dataStructureId === 'hash-table' && (
        <>
          <Button 
            onClick={() => handleOperation('set')}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Set
          </Button>
          <Button 
            onClick={() => handleOperation('delete')}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <MinusCircle className="h-4 w-4" />
            Delete
          </Button>
          <Button 
            onClick={() => handleOperation('get')}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Search className="h-4 w-4" />
            Get
          </Button>
        </>
      )}
      
      {dataStructureId === 'graph' && (
        <>
          <Button 
            onClick={() => handleOperation('addVertex')}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add Vertex
          </Button>
          <Button 
            onClick={() => handleOperation('addEdge')}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add Edge
          </Button>
          <Button 
            onClick={() => handleOperation('removeVertex')}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <MinusCircle className="h-4 w-4" />
            Remove Vertex
          </Button>
        </>
      )}
    </div>
  );
};
