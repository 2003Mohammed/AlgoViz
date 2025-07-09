import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Play, Pause, SkipForward, RotateCcw, Shuffle, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface GraphNode {
  id: string;
  value: string;
  x: number;
  y: number;
  status: 'default' | 'visiting' | 'visited' | 'current';
}

interface GraphEdge {
  source: string;
  target: string;
  status: 'default' | 'active';
}

interface TraversalStep {
  nodes: GraphNode[];
  edges: GraphEdge[];
  description: string;
  currentNode?: string;
}

const GraphVisualizer: React.FC = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [newNodeValue, setNewNodeValue] = useState('');
  const [sourceNode, setSourceNode] = useState('');
  const [targetNode, setTargetNode] = useState('');
  const [startNode, setStartNode] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [traversalSteps, setTraversalSteps] = useState<TraversalStep[]>([]);
  const [currentDescription, setCurrentDescription] = useState('');
  const [algorithm, setAlgorithm] = useState<'bfs' | 'dfs'>('bfs');
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addNode = () => {
    if (!newNodeValue.trim()) return;
    
    const nodeExists = nodes.some(node => node.value === newNodeValue.trim());
    if (nodeExists) return;
    
    // Auto-position nodes in a circle
    const angle = (nodes.length * 2 * Math.PI) / Math.max(6, nodes.length + 1);
    const radius = 120;
    const centerX = 250;
    const centerY = 150;
    
    const newNode: GraphNode = {
      id: Math.random().toString(36).substr(2, 9),
      value: newNodeValue.trim(),
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      status: 'default'
    };
    
    setNodes([...nodes, newNode]);
    setNewNodeValue('');
  };

  const addEdge = () => {
    if (!sourceNode || !targetNode || sourceNode === targetNode) return;
    
    const sourceExists = nodes.some(node => node.value === sourceNode);
    const targetExists = nodes.some(node => node.value === targetNode);
    
    if (!sourceExists || !targetExists) return;
    
    const edgeExists = edges.some(edge => 
      (edge.source === sourceNode && edge.target === targetNode) ||
      (edge.source === targetNode && edge.target === sourceNode)
    );
    
    if (edgeExists) return;
    
    const newEdge: GraphEdge = {
      source: sourceNode,
      target: targetNode,
      status: 'default'
    };
    
    setEdges([...edges, newEdge]);
    setSourceNode('');
    setTargetNode('');
  };

  const generateExample = () => {
    const exampleNodes: GraphNode[] = [
      { id: '1', value: 'A', x: 150, y: 100, status: 'default' },
      { id: '2', value: 'B', x: 350, y: 100, status: 'default' },
      { id: '3', value: 'C', x: 100, y: 200, status: 'default' },
      { id: '4', value: 'D', x: 250, y: 200, status: 'default' },
      { id: '5', value: 'E', x: 400, y: 200, status: 'default' }
    ];
    
    const exampleEdges: GraphEdge[] = [
      { source: 'A', target: 'B', status: 'default' },
      { source: 'A', target: 'C', status: 'default' },
      { source: 'B', target: 'D', status: 'default' },
      { source: 'C', target: 'D', status: 'default' },
      { source: 'D', target: 'E', status: 'default' }
    ];
    
    setNodes(exampleNodes);
    setEdges(exampleEdges);
  };

  const eraseGraph = () => {
    setNodes([]);
    setEdges([]);
    setTraversalSteps([]);
    setCurrentStep(0);
    setCurrentDescription('');
    setIsAnimating(false);
  };

  const performBFS = () => {
    if (!startNode) return;
    
    const startNodeObj = nodes.find(node => node.value === startNode);
    if (!startNodeObj) return;
    
    const steps: TraversalStep[] = [];
    const visited = new Set<string>();
    const queue: string[] = [startNode];
    
    // Initial state
    steps.push({
      nodes: nodes.map(node => ({ ...node, status: 'default' })),
      edges: edges.map(edge => ({ ...edge, status: 'default' })),
      description: `Starting BFS from node ${startNode}`,
      currentNode: startNode
    });
    
    while (queue.length > 0) {
      const currentNodeValue = queue.shift()!;
      
      if (visited.has(currentNodeValue)) continue;
      
      visited.add(currentNodeValue);
      
      // Mark current node as visiting
      steps.push({
        nodes: nodes.map(node => ({
          ...node,
          status: node.value === currentNodeValue ? 'visiting' : 
                 visited.has(node.value) ? 'visited' : 'default'
        })),
        edges: edges.map(edge => ({ ...edge, status: 'default' })),
        description: `Visiting node ${currentNodeValue}`,
        currentNode: currentNodeValue
      });
      
      // Find neighbors
      const neighbors = edges
        .filter(edge => edge.source === currentNodeValue || edge.target === currentNodeValue)
        .map(edge => edge.source === currentNodeValue ? edge.target : edge.source)
        .filter(neighbor => !visited.has(neighbor));
      
      // Add neighbors to queue
      neighbors.forEach(neighbor => {
        if (!queue.includes(neighbor)) {
          queue.push(neighbor);
        }
      });
      
      // Mark node as visited
      steps.push({
        nodes: nodes.map(node => ({
          ...node,
          status: visited.has(node.value) ? 'visited' : 'default'
        })),
        edges: edges.map(edge => ({ ...edge, status: 'default' })),
        description: `Node ${currentNodeValue} visited. Added neighbors to queue: ${neighbors.join(', ')}`,
        currentNode: currentNodeValue
      });
    }
    
    setTraversalSteps(steps);
    setCurrentStep(0);
    setIsAnimating(true);
  };

  const performDFS = () => {
    if (!startNode) return;
    
    const startNodeObj = nodes.find(node => node.value === startNode);
    if (!startNodeObj) return;
    
    const steps: TraversalStep[] = [];
    const visited = new Set<string>();
    
    const dfsRecursive = (nodeValue: string) => {
      visited.add(nodeValue);
      
      // Mark current node as visiting
      steps.push({
        nodes: nodes.map(node => ({
          ...node,
          status: node.value === nodeValue ? 'visiting' : 
                 visited.has(node.value) ? 'visited' : 'default'
        })),
        edges: edges.map(edge => ({ ...edge, status: 'default' })),
        description: `Visiting node ${nodeValue} (DFS)`,
        currentNode: nodeValue
      });
      
      // Find unvisited neighbors
      const neighbors = edges
        .filter(edge => edge.source === nodeValue || edge.target === nodeValue)
        .map(edge => edge.source === nodeValue ? edge.target : edge.source)
        .filter(neighbor => !visited.has(neighbor));
      
      // Visit each unvisited neighbor
      neighbors.forEach(neighbor => {
        if (!visited.has(neighbor)) {
          dfsRecursive(neighbor);
        }
      });
      
      // Mark node as fully processed
      steps.push({
        nodes: nodes.map(node => ({
          ...node,
          status: visited.has(node.value) ? 'visited' : 'default'
        })),
        edges: edges.map(edge => ({ ...edge, status: 'default' })),
        description: `Finished processing node ${nodeValue}`,
        currentNode: nodeValue
      });
    };
    
    // Initial state
    steps.push({
      nodes: nodes.map(node => ({ ...node, status: 'default' })),
      edges: edges.map(edge => ({ ...edge, status: 'default' })),
      description: `Starting DFS from node ${startNode}`,
      currentNode: startNode
    });
    
    dfsRecursive(startNode);
    
    setTraversalSteps(steps);
    setCurrentStep(0);
    setIsAnimating(true);
  };

  const startTraversal = () => {
    if (algorithm === 'bfs') {
      performBFS();
    } else {
      performDFS();
    }
  };

  const stepForward = () => {
    if (currentStep < traversalSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const resetAnimation = () => {
    setCurrentStep(0);
    setIsAnimating(false);
    setCurrentDescription('');
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    
    // Reset all statuses
    setNodes(nodes.map(node => ({ ...node, status: 'default' })));
    setEdges(edges.map(edge => ({ ...edge, status: 'default' })));
  };

  useEffect(() => {
    if (isAnimating && traversalSteps.length > 0) {
      if (currentStep < traversalSteps.length) {
        const step = traversalSteps[currentStep];
        setCurrentDescription(step.description);
        setNodes(step.nodes);
        setEdges(step.edges);
        
        animationRef.current = setTimeout(() => {
          if (currentStep < traversalSteps.length - 1) {
            setCurrentStep(currentStep + 1);
          } else {
            setIsAnimating(false);
          }
        }, 1500);
      }
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isAnimating, currentStep, traversalSteps]);

  const getNodeColor = (status: string) => {
    switch (status) {
      case 'visiting': return 'fill-yellow-500';
      case 'visited': return 'fill-green-500';
      case 'current': return 'fill-blue-500';
      default: return 'fill-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Graph Visualizer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="flex gap-4 items-center justify-center flex-wrap">
            <Button onClick={generateExample} variant="outline" size="sm">
              <Shuffle className="h-4 w-4 mr-2" />
              Generate Example
            </Button>
            <Button onClick={eraseGraph} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Erase Graph
            </Button>
          </div>

          {/* Node and Edge Creation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Add Node</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Node value (e.g., A)"
                  value={newNodeValue}
                  onChange={(e) => setNewNodeValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addNode()}
                />
                <Button onClick={addNode} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Add Edge</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="From"
                  value={sourceNode}
                  onChange={(e) => setSourceNode(e.target.value)}
                />
                <Input
                  placeholder="To"
                  value={targetNode}
                  onChange={(e) => setTargetNode(e.target.value)}
                />
                <Button onClick={addEdge} size="sm">Add</Button>
              </div>
            </div>
          </div>

          {/* Traversal Controls */}
          <div className="space-y-4">
            <div className="flex gap-2 items-center justify-center">
              <Button 
                variant={algorithm === 'bfs' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setAlgorithm('bfs')}
              >
                BFS
              </Button>
              <Button 
                variant={algorithm === 'dfs' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setAlgorithm('dfs')}
              >
                DFS
              </Button>
            </div>
            
            <div className="flex gap-2 items-center justify-center">
              <Input
                placeholder="Start node"
                value={startNode}
                onChange={(e) => setStartNode(e.target.value)}
                className="max-w-32"
              />
              <Button onClick={startTraversal} size="sm">
                Start {algorithm.toUpperCase()}
              </Button>
            </div>
          </div>

          {/* Animation Controls */}
          {traversalSteps.length > 0 && (
            <div className="flex gap-2 justify-center items-center p-4 bg-muted/20 rounded-lg">
              <Button 
                onClick={() => setIsAnimating(!isAnimating)} 
                size="sm"
                disabled={currentStep >= traversalSteps.length - 1}
              >
                {isAnimating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isAnimating ? 'Pause' : 'Play'}
              </Button>
              <Button onClick={stepForward} size="sm" disabled={currentStep >= traversalSteps.length - 1}>
                <SkipForward className="h-4 w-4 mr-2" />
                Step
              </Button>
              <Button onClick={resetAnimation} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {traversalSteps.length}
              </span>
            </div>
          )}

          {/* Color Legend */}
          <div className="bg-muted/20 p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Color Legend:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>🔵 Default / Unvisited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>🟡 Visiting</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>🟢 Visited / Found</span>
              </div>
            </div>
          </div>

          {/* Step Description */}
          {currentDescription && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
              <strong>Step:</strong> {currentDescription}
            </div>
          )}

          {/* Graph Visualization */}
          <div className="bg-muted/20 p-6 rounded-lg min-h-[300px] flex items-center justify-center">
            {nodes.length > 0 ? (
              <svg width="500" height="300" className="overflow-visible">
                {/* Render edges */}
                {edges.map((edge, idx) => {
                  const sourceNode = nodes.find(n => n.value === edge.source);
                  const targetNode = nodes.find(n => n.value === edge.target);
                  
                  if (!sourceNode || !targetNode) return null;
                  
                  return (
                    <line
                      key={`edge-${idx}`}
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-muted-foreground"
                    />
                  );
                })}
                
                {/* Render nodes */}
                {nodes.map((node) => (
                  <g key={node.id}>
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r="20"
                      className={`${getNodeColor(node.status)} stroke-foreground stroke-2`}
                      animate={{ scale: node.status === 'visiting' ? 1.2 : 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <text
                      x={node.x}
                      y={node.y + 5}
                      textAnchor="middle"
                      className="text-sm font-bold fill-white"
                    >
                      {node.value}
                    </text>
                  </g>
                ))}
              </svg>
            ) : (
              <div className="text-center text-muted-foreground">
                <p className="text-lg font-medium">Empty Graph</p>
                <p className="text-sm">Generate an example or add nodes to start</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GraphVisualizer;
