import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Play, Pause, SkipForward, RotateCcw, Shuffle, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface GraphNode {
  id: string;
  value: string;
  x: number;
  y: number;
  status: 'default' | 'visiting' | 'visited' | 'current' | 'path';
}

interface GraphEdge {
  source: string;
  target: string;
  status: 'default' | 'active' | 'path';
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
  const [deleteNodeValue, setDeleteNodeValue] = useState('');
  const [sourceNode, setSourceNode] = useState('');
  const [targetNode, setTargetNode] = useState('');
  const [startNode, setStartNode] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [traversalSteps, setTraversalSteps] = useState<TraversalStep[]>([]);
  const [currentDescription, setCurrentDescription] = useState('');
  const [algorithm, setAlgorithm] = useState<'bfs' | 'dfs' | 'dijkstra'>('bfs');
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addNode = () => {
    if (!newNodeValue.trim()) return;
    
    const nodeExists = nodes.some(node => node.value === newNodeValue.trim());
    if (nodeExists) return;
    
    // Auto-position nodes in a circle with some randomization
    const angle = (nodes.length * 2 * Math.PI) / Math.max(6, nodes.length + 1) + (Math.random() - 0.5) * 0.5;
    const radius = 120 + Math.random() * 40;
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

  const deleteNode = () => {
    if (!deleteNodeValue.trim()) {
      // Delete last added node if no specific value provided
      if (nodes.length > 0) {
        const lastNode = nodes[nodes.length - 1];
        const updatedNodes = nodes.slice(0, -1);
        const updatedEdges = edges.filter(edge => 
          edge.source !== lastNode.value && edge.target !== lastNode.value
        );
        setNodes(updatedNodes);
        setEdges(updatedEdges);
      }
      return;
    }
    
    const nodeToDelete = nodes.find(node => node.value === deleteNodeValue.trim());
    if (!nodeToDelete) return;
    
    const updatedNodes = nodes.filter(node => node.value !== deleteNodeValue.trim());
    const updatedEdges = edges.filter(edge => 
      edge.source !== deleteNodeValue.trim() && edge.target !== deleteNodeValue.trim()
    );
    
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    setDeleteNodeValue('');
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
    // Generate truly random graph each time
    const nodeLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const numNodes = 4 + Math.floor(Math.random() * 3); // 4-6 nodes
    const selectedLabels = nodeLabels.slice(0, numNodes);
    
    const exampleNodes: GraphNode[] = selectedLabels.map((label, index) => {
      const angle = (index * 2 * Math.PI) / numNodes + Math.random() * 0.3;
      const radius = 100 + Math.random() * 60;
      const centerX = 250;
      const centerY = 150;
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        value: label,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        status: 'default'
      };
    });
    
    // Generate random edges
    const exampleEdges: GraphEdge[] = [];
    for (let i = 0; i < selectedLabels.length; i++) {
      for (let j = i + 1; j < selectedLabels.length; j++) {
        if (Math.random() < 0.4) { // 40% chance for each possible edge
          exampleEdges.push({
            source: selectedLabels[i],
            target: selectedLabels[j],
            status: 'default'
          });
        }
      }
    }
    
    // Ensure connectivity by adding at least one edge per node
    selectedLabels.forEach((label, index) => {
      const hasEdge = exampleEdges.some(edge => 
        edge.source === label || edge.target === label
      );
      if (!hasEdge && index < selectedLabels.length - 1) {
        exampleEdges.push({
          source: label,
          target: selectedLabels[index + 1],
          status: 'default'
        });
      }
    });
    
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

  const performDijkstra = () => {
    if (!startNode) return;
    
    const steps: TraversalStep[] = [];
    const distances: { [key: string]: number } = {};
    const visited = new Set<string>();
    
    // Initialize distances
    nodes.forEach(node => {
      distances[node.id] = node.value === startNode ? 0 : Infinity;
    });
    
    steps.push({
      nodes: nodes.map(node => ({ ...node, status: 'default' })),
      edges: edges.map(edge => ({ ...edge, status: 'default' })),
      description: `Starting Dijkstra from node ${startNode}`,
      currentNode: startNode
    });
    
    setTraversalSteps(steps);
    setCurrentStep(0);
    setIsAnimating(true);
  };

  const startTraversal = () => {
    if (algorithm === 'bfs') {
      performBFS();
    } else if (algorithm === 'dfs') {
      performDFS();
    } else {
      performDijkstra();
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
      case 'path': return 'fill-purple-500';
      default: return 'fill-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Graph Visualizer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Controls */}
          <div className="flex gap-2 sm:gap-4 items-center justify-center flex-wrap">
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
              <h4 className="font-medium text-sm sm:text-base">Add/Delete Node</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Node value (e.g., A)"
                  value={newNodeValue}
                  onChange={(e) => setNewNodeValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addNode()}
                  className="text-sm"
                />
                <Button onClick={addNode} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Delete node (empty = last)"
                  value={deleteNodeValue}
                  onChange={(e) => setDeleteNodeValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && deleteNode()}
                  className="text-sm"
                />
                <Button onClick={deleteNode} size="sm" variant="destructive">
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm sm:text-base">Add Edge</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="From"
                  value={sourceNode}
                  onChange={(e) => setSourceNode(e.target.value)}
                  className="text-sm"
                />
                <Input
                  placeholder="To"
                  value={targetNode}
                  onChange={(e) => setTargetNode(e.target.value)}
                  className="text-sm"
                />
                <Button onClick={addEdge} size="sm">Add</Button>
              </div>
            </div>
          </div>

          {/* Traversal Controls */}
          <div className="space-y-4">
            <div className="flex gap-2 items-center justify-center flex-wrap">
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
              <Button 
                variant={algorithm === 'dijkstra' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setAlgorithm('dijkstra')}
              >
                Dijkstra
              </Button>
            </div>
            
            <div className="flex gap-2 items-center justify-center">
              <Input
                placeholder="Start node"
                value={startNode}
                onChange={(e) => setStartNode(e.target.value)}
                className="max-w-32 text-sm"
              />
              <Button onClick={startTraversal} size="sm">
                Start {algorithm.toUpperCase()}
              </Button>
            </div>
          </div>

          {/* Animation Controls */}
          {traversalSteps.length > 0 && (
            <div className="flex gap-2 justify-center items-center p-2 sm:p-4 bg-muted/20 rounded-lg flex-wrap">
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
              <span className="text-xs sm:text-sm text-muted-foreground">
                Step {currentStep + 1} of {traversalSteps.length}
              </span>
            </div>
          )}

          {/* Color Legend */}
          <div className="bg-muted/20 p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Color Legend:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>🔵 Default/Unvisited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>🟡 Visiting</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>🟢 Visited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>🟣 Path</span>
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
          <div className="bg-muted/20 p-4 sm:p-6 rounded-lg min-h-[300px] flex items-center justify-center overflow-auto">
            {nodes.length > 0 ? (
              <svg width="500" height="300" className="overflow-visible max-w-full">
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
