
import React, { useState } from 'react';
import { CodeHighlighter } from './CodeHighlighter';
import { DataStructure } from '../utils/dataStructureData';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Info, PlusCircle, MinusCircle, RotateCcw } from 'lucide-react';

interface DataStructureVisualizerProps {
  dataStructure: DataStructure;
}

export const DataStructureVisualizer: React.FC<DataStructureVisualizerProps> = ({ dataStructure }) => {
  const [customInput, setCustomInput] = useState<string>('');
  const [structure, setStructure] = useState(dataStructure.defaultExample);
  const [operationResult, setOperationResult] = useState<any>(null);
  const [operationLog, setOperationLog] = useState<string[]>([]);
  
  const resetToDefault = () => {
    setStructure(dataStructure.defaultExample);
    setOperationResult(null);
    setOperationLog([]);
  };
  
  const addLogEntry = (message: string) => {
    setOperationLog(prev => [...prev, message]);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomInput(e.target.value);
  };
  
  const handleOperation = (operation: string) => {
    try {
      let result;
      let newStructure = { ...structure };
      
      switch (dataStructure.id) {
        case 'array':
          if (operation === 'add') {
            if (!customInput) {
              addLogEntry("Please enter a value to add");
              return;
            }
            const value = Number(customInput) || customInput;
            newStructure = [...(structure as any[]), value];
            addLogEntry(`Added ${value} to the array`);
          } else if (operation === 'remove') {
            if ((structure as any[]).length === 0) {
              addLogEntry("Array is empty");
              return;
            }
            newStructure = [...(structure as any[])];
            result = (newStructure as any[]).pop();
            addLogEntry(`Removed ${result} from the array`);
          } else if (operation === 'search') {
            if (!customInput) {
              addLogEntry("Please enter a value to search");
              return;
            }
            const value = Number(customInput) || customInput;
            result = (structure as any[]).indexOf(value);
            addLogEntry(`Search result: ${result === -1 ? 'Not found' : `Found at index ${result}`}`);
          }
          break;
          
        case 'linked-list':
          if (operation === 'add') {
            if (!customInput) {
              addLogEntry("Please enter a value to add");
              return;
            }
            const value = Number(customInput) || customInput;
            const newNode = { value, next: null };
            const newNodes = [...(structure as any).nodes];
            
            if (newNodes.length === 0) {
              newNodes.push(newNode);
              newStructure = { nodes: newNodes, head: 0 };
            } else {
              const lastNodeIndex = newNodes.length - 1;
              newNodes[lastNodeIndex].next = newNodes.length;
              newNodes.push(newNode);
              newStructure = { ...structure, nodes: newNodes };
            }
            addLogEntry(`Added ${value} to the linked list`);
          } else if (operation === 'remove') {
            const { nodes, head } = structure as any;
            if (nodes.length === 0 || head === null) {
              addLogEntry("Linked list is empty");
              return;
            }
            
            const newNodes = [...nodes];
            result = newNodes[head].value;
            
            if (newNodes[head].next === null) {
              newStructure = { nodes: [], head: null };
            } else {
              newStructure = { nodes: newNodes, head: newNodes[head].next };
            }
            addLogEntry(`Removed ${result} from the linked list`);
          } else if (operation === 'search') {
            if (!customInput) {
              addLogEntry("Please enter a value to search");
              return;
            }
            const value = Number(customInput) || customInput;
            const { nodes, head } = structure as any;
            let found = false;
            let current = head;
            let index = 0;
            
            while (current !== null) {
              if (nodes[current].value === value) {
                found = true;
                break;
              }
              current = nodes[current].next;
              index++;
            }
            
            addLogEntry(`Search result: ${found ? `Found at position ${index}` : 'Not found'}`);
          }
          break;
          
        case 'stack':
          if (operation === 'push') {
            if (!customInput) {
              addLogEntry("Please enter a value to push");
              return;
            }
            const value = Number(customInput) || customInput;
            newStructure = [(value), ...(structure as any[])];
            addLogEntry(`Pushed ${value} onto the stack`);
          } else if (operation === 'pop') {
            if ((structure as any[]).length === 0) {
              addLogEntry("Stack is empty");
              return;
            }
            newStructure = [...(structure as any[])];
            result = (newStructure as any[]).shift();
            addLogEntry(`Popped ${result} from the stack`);
          } else if (operation === 'peek') {
            if ((structure as any[]).length === 0) {
              addLogEntry("Stack is empty");
              return;
            }
            result = (structure as any[])[0];
            addLogEntry(`Top element: ${result}`);
          }
          break;
          
        // Additional cases for other data structures would go here
        
        default:
          addLogEntry("Operation not supported for this data structure yet");
      }
      
      setStructure(newStructure);
      setOperationResult(result);
      setCustomInput('');
    } catch (error) {
      console.error(error);
      addLogEntry(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  // Function to render the current state of the data structure
  const renderDataStructure = () => {
    switch (dataStructure.id) {
      case 'array':
        return (
          <div className="flex flex-wrap gap-2 justify-center">
            {(structure as any[]).map((item, index) => (
              <div 
                key={index} 
                className="w-12 h-12 flex items-center justify-center border border-primary/50 rounded-md bg-primary/10"
              >
                {item}
              </div>
            ))}
            {(structure as any[]).length === 0 && (
              <div className="text-muted-foreground">Array is empty</div>
            )}
          </div>
        );
        
      case 'linked-list':
        const { nodes, head } = structure as any;
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
        
      case 'stack':
        return (
          <div className="flex flex-col gap-1 items-center">
            {(structure as any[]).length > 0 ? (
              <>
                <div className="px-2 py-1 text-xs font-medium bg-primary/20 rounded-md mb-2">
                  Top
                </div>
                {(structure as any[]).map((item, index) => (
                  <div 
                    key={index} 
                    className={`w-24 h-12 flex items-center justify-center border border-primary/50 rounded-md ${
                      index === 0 ? 'bg-primary/20' : 'bg-primary/10'
                    }`}
                  >
                    {item}
                  </div>
                ))}
                <div className="border-b-2 border-primary/50 w-32 mt-1"></div>
              </>
            ) : (
              <div className="text-muted-foreground">Stack is empty</div>
            )}
          </div>
        );
        
      // Additional cases for other data structures would go here
      
      default:
        return (
          <div className="text-center text-muted-foreground">
            Visualization for this data structure is not available yet.
          </div>
        );
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">{dataStructure.name} Visualization</h3>
          <Button 
            onClick={resetToDefault}
            variant="secondary"
            size="sm"
            className="flex items-center gap-1"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
        
        <div className="relative min-h-64 flex flex-col items-center justify-center gap-6 mb-6">
          {renderDataStructure()}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <div className="w-full sm:w-auto">
            <Input
              placeholder="Enter a value..."
              value={customInput}
              onChange={handleInputChange}
              className="min-w-[200px]"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {dataStructure.id === 'array' && (
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
            
            {dataStructure.id === 'linked-list' && (
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
            
            {dataStructure.id === 'stack' && (
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
        </div>
        
        {operationLog.length > 0 && (
          <div className="mt-6 p-4 bg-secondary/30 rounded-md max-h-40 overflow-y-auto">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
              <Info className="h-4 w-4" />
              Operation Log
            </h4>
            <div className="space-y-1">
              {operationLog.map((log, index) => (
                <div 
                  key={index} 
                  className="text-sm text-muted-foreground"
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold mb-4">Operations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dataStructure.operations.map((operation, index) => (
            <div key={index} className="border border-border/50 rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{operation.name}</h4>
                <span className="text-xs px-2 py-1 bg-secondary/30 rounded-full font-mono">
                  {operation.timeComplexity}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{operation.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {dataStructure.implementation && (
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-4">Implementation</h3>
          <CodeHighlighter 
            code={dataStructure.implementation.split('\n')} 
          />
        </div>
      )}
    </div>
  );
};
