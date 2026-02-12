import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { LearnMoreLink } from '../LearnMoreLink';
import { Input } from '../ui/input';
import { Play, Pause, SkipForward, RotateCcw, Shuffle, Plus, Minus, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Slider } from '../ui/slider';

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
  visitOrder: string[];
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
  const [algorithm, setAlgorithm] = useState<'bfs' | 'dfs'>('bfs');
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [visitOrder, setVisitOrder] = useState<string[]>([]);
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

  // Generate connected graph with minimum 5 nodes for BFS/DFS
  const generateExample = () => {
    const nodeLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const numNodes = 5 + Math.floor(Math.random() * 3); // 5-7 nodes minimum
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
    
    // Generate logical edges for BFS/DFS traversal
    const exampleEdges: GraphEdge[] = [];
    
    // Create a connected graph structure
    for (let i = 0; i < selectedLabels.length - 1; i++) {
      // Connect each node to the next one
      exampleEdges.push({
        source: selectedLabels[i],
        target: selectedLabels[i + 1],
        status: 'default'
      });
      
      // Add some cross connections for more interesting traversal
      if (i < selectedLabels.length - 2 && Math.random() < 0.6) {
        exampleEdges.push({
          source: selectedLabels[i],
          target: selectedLabels[i + 2],
          status: 'default'
        });
      }
    }
    
    // Ensure the last node connects back to create cycles
    if (selectedLabels.length > 2) {
      exampleEdges.push({
        source: selectedLabels[selectedLabels.length - 1],
        target: selectedLabels[0],
        status: 'default'
      });
    }
    
    setNodes(exampleNodes);
    setEdges(exampleEdges);
  };

  const eraseGraph = () => {
    setNodes([]);
    setEdges([]);
    setTraversalSteps([]);
    setCurrentStep(0);
    setCurrentDescription('');
    setVisitOrder([]);
    setIsAnimating(false);
  };

  const performBFS = () => {
    if (!startNode) return;
    
    const startNodeObj = nodes.find(node => node.value === startNode);
    if (!startNodeObj) return;
    
    const steps: TraversalStep[] = [];
    const visited = new Set<string>();
    const queue: string[] = [startNode];
    const visitOrder: string[] = [];
    
    // Initial state
    steps.push({
      nodes: nodes.map(node => ({ ...node, status: 'default' })),
      edges: edges.map(edge => ({ ...edge, status: 'default' })),
      description: `Starting BFS from node ${startNode}`,
      currentNode: startNode,
      visitOrder: []
    });
    
    while (queue.length > 0) {
      const currentNodeValue = queue.shift()!;
      
      if (visited.has(currentNodeValue)) continue;
      
      visited.add(currentNodeValue);
      visitOrder.push(currentNodeValue);
      
      // Mark current node as visiting
      steps.push({
        nodes: nodes.map(node => ({
          ...node,
          status: node.value === currentNodeValue ? 'visiting' : 
                 visited.has(node.value) ? 'visited' : 'default'
        })),
        edges: edges.map(edge => ({ ...edge, status: 'default' })),
        description: `Visiting node ${currentNodeValue}`,
        currentNode: currentNodeValue,
        visitOrder: [...visitOrder]
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
        currentNode: currentNodeValue,
        visitOrder: [...visitOrder]
      });
    }
    
    setVisitOrder(visitOrder);
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
    const visitOrder: string[] = [];
    
    const dfsRecursive = (nodeValue: string) => {
      visited.add(nodeValue);
      visitOrder.push(nodeValue);
      
      // Mark current node as visiting
      steps.push({
        nodes: nodes.map(node => ({
          ...node,
          status: node.value === nodeValue ? 'visiting' : 
                 visited.has(node.value) ? 'visited' : 'default'
        })),
        edges: edges.map(edge => ({ ...edge, status: 'default' })),
        description: `Visiting node ${nodeValue} (DFS)`,
        currentNode: nodeValue,
        visitOrder: [...visitOrder]
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
        currentNode: nodeValue,
        visitOrder: [...visitOrder]
      });
    };
    
    // Initial state
    steps.push({
      nodes: nodes.map(node => ({ ...node, status: 'default' })),
      edges: edges.map(edge => ({ ...edge, status: 'default' })),
      description: `Starting DFS from node ${startNode}`,
      currentNode: startNode,
      visitOrder: []
    });
    
    dfsRecursive(startNode);
    
    setVisitOrder(visitOrder);
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
    setVisitOrder([]);
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
        setVisitOrder(step.visitOrder);
        
        animationRef.current = setTimeout(() => {
          if (currentStep < traversalSteps.length - 1) {
            setCurrentStep(currentStep + 1);
          } else {
            setIsAnimating(false);
          }
        }, animationSpeed);
      }
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isAnimating, currentStep, traversalSteps, animationSpeed]);

  const getNodeColor = (status: string) => {
    switch (status) {
      case 'visiting': return 'fill-viz-node-active';
      case 'visited': return 'fill-viz-node-visited';
      case 'current': return 'fill-viz-node-default';
      case 'path': return 'fill-viz-node-queued';
      default: return 'fill-viz-node-default';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Graph Data Structure - BFS & DFS Visualizer</CardTitle>
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
                BFS (Breadth-First Search)
              </Button>
              <Button 
                variant={algorithm === 'dfs' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setAlgorithm('dfs')}
              >
                DFS (Depth-First Search)
              </Button>
            </div>
            
            <div className="flex gap-2 items-center justify-center">
              <Input
                placeholder="Start node"
                value={startNode}
                onChange={(e) => setStartNode(e.target.value)}
                className="w-32 text-sm"
              />
              <Button 
                onClick={startTraversal} 
                size="sm"
                disabled={!startNode || nodes.length < 5 || isAnimating}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                ▶️ Play {algorithm.toUpperCase()}
              </Button>
            </div>

            {/* Speed Control */}
            <div className="flex flex-col items-center space-y-2">
              <label className="text-sm font-medium">Animation Speed</label>
              <div className="w-64 flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">Slow</span>
                <Slider
                  value={[animationSpeed]}
                  onValueChange={(value) => setAnimationSpeed(value[0])}
                  min={500}
                  max={3000}
                  step={100}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground">Fast</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {animationSpeed}ms per step
              </span>
            </div>

            {/* Final Result Display */}
            {visitOrder.length > 0 && !isAnimating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-muted/50 rounded-lg p-4 text-center"
              >
                <h4 className="font-semibold text-lg mb-2 text-primary">
                  {algorithm.toUpperCase()} Traversal Complete!
                </h4>
                <p className="text-xl font-mono font-bold tracking-wider mb-1">
                  Visit Order: {visitOrder.join(' → ')}
                </p>
                <p className="text-lg text-muted-foreground">
                  Total Nodes Visited: <span className="font-bold text-primary">{visitOrder.length}</span>
                </p>
              </motion.div>
            )}
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
                <div className="w-3 h-3 bg-viz-node-default rounded-full"></div>
                <span>🔵 Default/Unvisited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-viz-node-active rounded-full"></div>
                <span>🟡 Currently Visiting</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-viz-node-visited rounded-full"></div>
                <span>🟢 Visited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-viz-node-queued rounded-full"></div>
                <span>🟣 Path</span>
              </div>
            </div>
          </div>

          {/* Step Description */}
          {currentDescription && (
            <div className="p-3 bg-viz-panel border border-border rounded-lg text-foreground text-sm">
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
                      className="text-sm font-bold fill-primary-foreground"
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

      {/* Educational Content */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Real-world Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Real-world Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              <li>• Social network connections</li>
              <li>• GPS navigation systems</li>
              <li>• Computer network topology</li>
              <li>• Game level design</li>
              <li>• Dependency management</li>
              <li>• Circuit design</li>
            </ul>
          </CardContent>
        </Card>

        {/* Complexity & Properties */}
        <Card>
          <CardHeader>
            <CardTitle>Complexity & Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">Time Complexity:</div>
                  <div className="font-mono">O(V + E)</div>
                  <div className="text-xs text-muted-foreground">V = vertices, E = edges</div>
                </div>
                <div>
                  <div className="font-medium">Space Complexity:</div>
                  <div className="font-mono">O(V)</div>
                  <div className="text-xs text-muted-foreground">For visited array</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium">Properties:</div>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Can represent complex relationships</li>
                  <li>• Directed or undirected</li>
                  <li>• Weighted or unweighted</li>
                  <li>• Cyclic or acyclic</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learn More */}
        <Card>
          <CardHeader>
            <CardTitle>Learn More</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              <li>
              <a 
                  href="https://www.w3schools.com/dsa/dsa_theory_graphs.php" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1 text-blue-500 hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  W3Schools Graph
                </a>
              </li>
              <li>
                <ExternalLink className="h-4 w-4 inline-block mr-1" />
                <a href="https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/" target="_blank" rel="noopener noreferrer" className="underline">
                  GeeksforGeeks Graph Algorithms
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GraphVisualizer;
