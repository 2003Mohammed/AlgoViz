
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
        return renderArrayStructure();
        
      case 'linked-list':
        return renderLinkedListStructure();
        
      case 'stack':
        return renderStackStructure();
        
      case 'queue':
        return renderQueueStructure();
        
      case 'binary-tree':
        return renderBinaryTreeStructure();
        
      case 'hash-table':
        return renderHashTableStructure();
        
      case 'graph':
        return renderGraphStructure();
        
      default:
        return (
          <div className="text-center text-muted-foreground">
            Visualization for this data structure is not available yet.
          </div>
        );
    }
  };
  
  // Array visualization
  const renderArrayStructure = () => {
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
  };
  
  // Linked List visualization
  const renderLinkedListStructure = () => {
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
  };
  
  // Stack visualization
  const renderStackStructure = () => {
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
  };
  
  // Queue visualization
  const renderQueueStructure = () => {
    return (
      <div className="flex flex-col items-center">
        {(structure as any[]).length > 0 ? (
          <>
            <div className="flex justify-between w-full max-w-md mb-2">
              <div className="px-2 py-1 text-xs font-medium bg-primary/20 rounded-md">
                Front
              </div>
              <div className="px-2 py-1 text-xs font-medium bg-secondary/50 rounded-md">
                Rear
              </div>
            </div>
            <div className="flex flex-row-reverse items-center justify-center">
              {(structure as any[]).map((item, index) => (
                <div 
                  key={index} 
                  className={`w-16 h-12 flex items-center justify-center border border-primary/50 rounded-md mx-1 ${
                    index === 0 ? 'bg-primary/20' : 
                    index === (structure as any[]).length - 1 ? 'bg-secondary/30' : 
                    'bg-primary/10'
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-muted-foreground">Queue is empty</div>
        )}
      </div>
    );
  };
  
  // Binary Tree visualization
  const renderBinaryTreeStructure = () => {
    const { nodes, root } = structure as any;
    
    if (!nodes || nodes.length === 0 || root === null) {
      return <div className="text-muted-foreground">Binary tree is empty</div>;
    }
    
    // Helper function to recursively render tree nodes
    const renderTreeNode = (nodeIndex: number, x: number, y: number, level: number, width: number) => {
      if (nodeIndex === null || nodeIndex >= nodes.length) return null;
      
      const node = nodes[nodeIndex];
      const elements = [];
      
      // Draw current node
      elements.push(
        <g key={`node-${nodeIndex}`}>
          <circle
            cx={x}
            cy={y}
            r={20}
            className="fill-primary/20 stroke-primary"
          />
          <text
            x={x}
            y={y}
            textAnchor="middle"
            dy=".3em"
            className="text-xs fill-foreground"
          >
            {node.value}
          </text>
        </g>
      );
      
      // Draw left child
      if (node.left !== null) {
        const leftX = x - width / 2;
        const leftY = y + 60;
        
        // Draw edge to left child
        elements.push(
          <line
            key={`edge-${nodeIndex}-${node.left}`}
            x1={x}
            y1={y + 20}
            x2={leftX}
            y2={leftY - 20}
            className="stroke-primary/60 stroke-1"
          />
        );
        
        // Recursively render left subtree
        const leftElements = renderTreeNode(node.left, leftX, leftY, level + 1, width / 2);
        if (leftElements) elements.push(...leftElements);
      }
      
      // Draw right child
      if (node.right !== null) {
        const rightX = x + width / 2;
        const rightY = y + 60;
        
        // Draw edge to right child
        elements.push(
          <line
            key={`edge-${nodeIndex}-${node.right}`}
            x1={x}
            y1={y + 20}
            x2={rightX}
            y2={rightY - 20}
            className="stroke-primary/60 stroke-1"
          />
        );
        
        // Recursively render right subtree
        const rightElements = renderTreeNode(node.right, rightX, rightY, level + 1, width / 2);
        if (rightElements) elements.push(...rightElements);
      }
      
      return elements;
    };
    
    return (
      <div className="flex justify-center items-center h-64">
        <svg width="600" height="240" className="overflow-visible">
          {renderTreeNode(root, 300, 40, 0, 240)}
        </svg>
      </div>
    );
  };
  
  // Hash Table visualization
  const renderHashTableStructure = () => {
    const buckets = structure as any;
    
    return (
      <div className="flex flex-col items-center max-w-lg mx-auto">
        {buckets.map((bucket: any, index: number) => (
          <div 
            key={index}
            className="w-full border border-primary/30 rounded-md mb-2 overflow-hidden"
          >
            <div className="bg-secondary/20 px-3 py-1 border-b border-primary/20">
              <span className="text-xs font-mono">Bucket {index}</span>
            </div>
            <div className="p-2">
              {bucket.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {bucket.map((item: any, itemIndex: number) => (
                    <div 
                      key={itemIndex}
                      className="flex items-center px-2 py-1 bg-primary/5 rounded"
                    >
                      <span className="text-sm font-medium mr-2">{item.key}:</span>
                      <span className="text-sm text-muted-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground italic">Empty</div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Graph visualization
  const renderGraphStructure = () => {
    const { nodes, edges } = structure as any;
    
    if (!nodes || nodes.length === 0) {
      return <div className="text-muted-foreground">Graph is empty</div>;
    }
    
    return (
      <div className="flex justify-center items-center h-64">
        <svg width="400" height="240" className="overflow-visible">
          {/* Draw edges */}
          {edges.map((edge: any, index: number) => {
            const source = nodes.find((n: any) => n.id === edge.source);
            const target = nodes.find((n: any) => n.id === edge.target);
            
            return (
              <line
                key={`edge-${index}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                className="stroke-primary/60 stroke-1"
              />
            );
          })}
          
          {/* Draw nodes */}
          {nodes.map((node: any) => (
            <g key={`node-${node.id}`}>
              <circle
                cx={node.x}
                cy={node.y}
                r={20}
                className="fill-primary/20 stroke-primary"
              />
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dy=".3em"
                className="text-xs fill-foreground"
              >
                {node.id}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
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
