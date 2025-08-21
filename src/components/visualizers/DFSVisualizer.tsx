
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Play, Pause, SkipForward, RotateCcw, Shuffle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface GraphNode {
  id: string;
  x: number;
  y: number;
  status: 'default' | 'visiting' | 'visited' | 'stacked';
}

interface GraphEdge {
  source: string;
  target: string;
  status: 'default' | 'active' | 'visited';
}

const DFSVisualizer: React.FC = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [startNode, setStartNode] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSteps, setAnimationSteps] = useState<{ visited: string[]; stack: string[]; current: string; description: string }[]>([]);
  const [currentDescription, setCurrentDescription] = useState('');
  const [stack, setStack] = useState<string[]>([]);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generateExample = () => {
    const exampleNodes: GraphNode[] = [
      { id: 'A', x: 150, y: 100, status: 'default' },
      { id: 'B', x: 300, y: 50, status: 'default' },
      { id: 'C', x: 300, y: 150, status: 'default' },
      { id: 'D', x: 450, y: 100, status: 'default' },
      { id: 'E', x: 600, y: 50, status: 'default' },
      { id: 'F', x: 600, y: 150, status: 'default' },
    ];
    
    const exampleEdges: GraphEdge[] = [
      { source: 'A', target: 'B', status: 'default' },
      { source: 'A', target: 'C', status: 'default' },
      { source: 'B', target: 'D', status: 'default' },
      { source: 'C', target: 'D', status: 'default' },
      { source: 'D', target: 'E', status: 'default' },
      { source: 'D', target: 'F', status: 'default' },
    ];
    
    setNodes(exampleNodes);
    setEdges(exampleEdges);
    setStartNode('A');
    reset();
  };

  const reset = () => {
    setNodes(prev => prev.map(node => ({ ...node, status: 'default' })));
    setEdges(prev => prev.map(edge => ({ ...edge, status: 'default' })));
    setAnimationSteps([]);
    setCurrentStep(0);
    setCurrentDescription('');
    setStack([]);
    setVisited(new Set());
    setIsAnimating(false);
    setIsPaused(false);
  };

  const generateDFSSteps = () => {
    if (!startNode || !nodes.find(n => n.id === startNode)) {
      alert('Please select a valid start node');
      return;
    }

    const steps: { visited: string[]; stack: string[]; current: string; description: string }[] = [];
    const visitedSet = new Set<string>();
    const stackArray = [startNode];
    
    steps.push({
      visited: [],
      stack: [startNode],
      current: '',
      description: `Starting DFS from node ${startNode}. Added to stack.`
    });

    while (stackArray.length > 0) {
      const current = stackArray.pop()!;
      
      if (!visitedSet.has(current)) {
        visitedSet.add(current);
        
        steps.push({
          visited: Array.from(visitedSet),
          stack: [...stackArray],
          current,
          description: `Visiting node ${current}. Marking as visited.`
        });

        const neighbors = edges
          .filter(edge => edge.source === current || edge.target === current)
          .map(edge => edge.source === current ? edge.target : edge.source)
          .filter(neighbor => !visitedSet.has(neighbor))
          .reverse(); // Reverse to maintain order when pushing to stack

        neighbors.forEach(neighbor => {
          if (!stackArray.includes(neighbor)) {
            stackArray.push(neighbor);
          }
        });
        
        if (neighbors.length > 0) {
          steps.push({
            visited: Array.from(visitedSet),
            stack: [...stackArray],
            current,
            description: `Added neighbors ${neighbors.join(', ')} to stack.`
          });
        }
      }
    }

    steps.push({
      visited: Array.from(visitedSet),
      stack: [],
      current: '',
      description: 'DFS traversal completed!'
    });

    setAnimationSteps(steps);
    setCurrentStep(0);
    setIsAnimating(true);
    setIsPaused(false);
  };

  const togglePlayPause = () => {
    if (animationSteps.length === 0) {
      generateDFSSteps();
    } else {
      setIsAnimating(!isAnimating);
      setIsPaused(!isPaused);
    }
  };

  const stepForward = () => {
    if (currentStep < animationSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  useEffect(() => {
    if (isAnimating && !isPaused && animationSteps.length > 0) {
      if (currentStep < animationSteps.length - 1) {
        animationRef.current = setTimeout(() => {
          setCurrentStep(currentStep + 1);
        }, 1500);
      } else {
        setIsAnimating(false);
      }
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isAnimating, isPaused, currentStep, animationSteps]);

  useEffect(() => {
    if (animationSteps.length > 0 && currentStep < animationSteps.length) {
      const step = animationSteps[currentStep];
      setCurrentDescription(step.description);
      setStack(step.stack);
      setVisited(new Set(step.visited));
      
      setNodes(prev => prev.map(node => ({
        ...node,
        status: step.visited.includes(node.id) ? 'visited' :
                step.current === node.id ? 'visiting' :
                step.stack.includes(node.id) ? 'stacked' : 'default'
      })));
    }
  }, [currentStep, animationSteps]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Depth-First Search (DFS)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="flex gap-4 items-center justify-center">
            <Button onClick={generateExample} variant="outline" size="sm">
              <Shuffle className="h-4 w-4 mr-2" />
              Generate Example
            </Button>
            <Button onClick={togglePlayPause} size="sm">
              {isAnimating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isAnimating ? 'Pause' : 'Play'}
            </Button>
            <Button onClick={stepForward} disabled={currentStep >= animationSteps.length - 1} size="sm">
              <SkipForward className="h-4 w-4 mr-2" />
              Step
            </Button>
            <Button onClick={reset} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Start Node Input */}
          <div className="flex gap-2 items-center justify-center">
            <Input
              placeholder="Start Node (e.g., A)"
              value={startNode}
              onChange={(e) => setStartNode(e.target.value.toUpperCase())}
              className="w-40"
            />
          </div>

          {/* Color Legend */}
          <div className="bg-muted/20 p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Color Legend:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span>Unvisited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <span>In Stack</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Visiting</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Visited</span>
              </div>
            </div>
          </div>

          {/* Step Description */}
          {currentDescription && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
              <strong>Step:</strong> {currentDescription}
            </div>
          )}

          {/* Stack Display */}
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <strong className="text-purple-700">Stack:</strong>
            <span className="ml-2 text-purple-600">
              {stack.length > 0 ? `[${stack.join(', ')}]` : 'Empty'}
            </span>
          </div>

          {/* Graph Visualization */}
          <div className="bg-muted/20 p-6 rounded-lg min-h-[300px] flex items-center justify-center">
            {nodes.length === 0 ? (
              <div className="text-center text-muted-foreground">
                <p className="text-lg font-medium">No Graph</p>
                <p className="text-sm">Generate an example to start</p>
              </div>
            ) : (
              <svg width="700" height="250" className="overflow-visible">
                {/* Render edges */}
                {edges.map((edge, index) => {
                  const sourceNode = nodes.find(n => n.id === edge.source);
                  const targetNode = nodes.find(n => n.id === edge.target);
                  if (!sourceNode || !targetNode) return null;
                  
                  return (
                    <line
                      key={index}
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke={edge.status === 'visited' ? '#10b981' : '#6b7280'}
                      strokeWidth="2"
                    />
                  );
                })}
                
                {/* Render nodes */}
                {nodes.map((node) => {
                  const nodeColor = node.status === 'visited' ? '#10b981' :
                                   node.status === 'visiting' ? '#ef4444' :
                                   node.status === 'stacked' ? '#a855f7' : '#6b7280';
                  
                  return (
                    <g key={node.id}>
                      <motion.circle
                        cx={node.x}
                        cy={node.y}
                        r="20"
                        fill={nodeColor}
                        stroke="#fff"
                        strokeWidth="2"
                        animate={{ scale: node.status === 'visiting' ? 1.2 : 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <text
                        x={node.x}
                        y={node.y + 5}
                        textAnchor="middle"
                        className="text-white text-sm font-bold"
                      >
                        {node.id}
                      </text>
                    </g>
                  );
                })}
              </svg>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Educational Content */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Algorithm Complexity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Time Complexity:</span>
                <span className="font-mono">O(V + E)</span>
              </div>
              <div className="flex justify-between">
                <span>Space Complexity:</span>
                <span className="font-mono">O(V)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              <li>• Path finding in mazes</li>
              <li>• Topological sorting</li>
              <li>• Detecting cycles in graphs</li>
              <li>• Backtracking algorithms</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Learn More Section */}
      <Card>
        <CardHeader>
          <CardTitle>Learn More</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
          <a 
                  href="https://www.tutorialspoint.com/data_structures_algorithms/depth_first_traversal.htm" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1 text-blue-500 hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  DFS
                </a>
            <a
              href="https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 hover:bg-green-100 transition-colors"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              GeeksforGeeks DFS Explanation
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DFSVisualizer;
