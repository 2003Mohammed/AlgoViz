
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Play, Pause, SkipForward, RotateCcw, Shuffle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Slider } from '../ui/slider';
import { useTutorContext } from '../../context/TutorContext';

interface GraphNode {
  id: string;
  x: number;
  y: number;
  status: 'default' | 'visiting' | 'visited' | 'queued';
}

interface GraphEdge {
  source: string;
  target: string;
  status: 'default' | 'active' | 'visited';
}

interface GraphExample {
  key: 'small' | 'medium' | 'large';
  label: string;
  startNode: string;
  nodes: Array<Omit<GraphNode, 'status'>>;
  edges: Array<Omit<GraphEdge, 'status'>>;
}

const BFSVisualizer: React.FC = () => {
  const { updateVisualizationState } = useTutorContext();
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [startNode, setStartNode] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSteps, setAnimationSteps] = useState<{ visited: string[]; queue: string[]; current: string; description: string }[]>([]);
  const [currentDescription, setCurrentDescription] = useState('');
  const [queue, setQueue] = useState<string[]>([]);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [animationSpeed, setAnimationSpeed] = useState([1.5]);
  const [selectedExample, setSelectedExample] = useState<GraphExample['key']>('small');
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const examples: GraphExample[] = [
    {
      key: 'small',
      label: 'Small',
      startNode: 'A',
      nodes: [
        { id: 'A', x: 150, y: 100 },
        { id: 'B', x: 300, y: 50 },
        { id: 'C', x: 300, y: 150 },
        { id: 'D', x: 450, y: 100 },
        { id: 'E', x: 600, y: 50 },
        { id: 'F', x: 600, y: 150 }
      ],
      edges: [
        { source: 'A', target: 'B' },
        { source: 'A', target: 'C' },
        { source: 'B', target: 'D' },
        { source: 'C', target: 'D' },
        { source: 'D', target: 'E' },
        { source: 'D', target: 'F' }
      ]
    },
    {
      key: 'medium',
      label: 'Medium',
      startNode: 'A',
      nodes: [
        { id: 'A', x: 130, y: 120 },
        { id: 'B', x: 260, y: 40 },
        { id: 'C', x: 260, y: 200 },
        { id: 'D', x: 390, y: 120 },
        { id: 'E', x: 520, y: 40 },
        { id: 'F', x: 520, y: 200 },
        { id: 'G', x: 650, y: 120 },
        { id: 'H', x: 390, y: 220 }
      ],
      edges: [
        { source: 'A', target: 'B' },
        { source: 'A', target: 'C' },
        { source: 'B', target: 'D' },
        { source: 'C', target: 'D' },
        { source: 'D', target: 'E' },
        { source: 'D', target: 'F' },
        { source: 'E', target: 'G' },
        { source: 'F', target: 'G' },
        { source: 'C', target: 'H' },
        { source: 'H', target: 'F' }
      ]
    },
    {
      key: 'large',
      label: 'Large',
      startNode: 'A',
      nodes: [
        { id: 'A', x: 100, y: 120 },
        { id: 'B', x: 220, y: 40 },
        { id: 'C', x: 220, y: 200 },
        { id: 'D', x: 340, y: 120 },
        { id: 'E', x: 460, y: 40 },
        { id: 'F', x: 460, y: 200 },
        { id: 'G', x: 580, y: 120 },
        { id: 'H', x: 700, y: 40 },
        { id: 'I', x: 700, y: 200 },
        { id: 'J', x: 340, y: 220 }
      ],
      edges: [
        { source: 'A', target: 'B' },
        { source: 'A', target: 'C' },
        { source: 'B', target: 'D' },
        { source: 'C', target: 'D' },
        { source: 'D', target: 'E' },
        { source: 'D', target: 'F' },
        { source: 'E', target: 'G' },
        { source: 'F', target: 'G' },
        { source: 'G', target: 'H' },
        { source: 'G', target: 'I' },
        { source: 'C', target: 'J' },
        { source: 'J', target: 'F' }
      ]
    }
  ];

  const applyExample = (example: GraphExample) => {
    setNodes(example.nodes.map((node) => ({ ...node, status: 'default' })));
    setEdges(example.edges.map((edge) => ({ ...edge, status: 'default' })));
    setStartNode(example.startNode);
    setAnimationSteps([]);
    setCurrentStep(0);
    setCurrentDescription('');
    setQueue([]);
    setVisited(new Set());
    setIsAnimating(false);
    setIsPaused(false);
    updateVisualizationState({
      algorithmId: 'bfs',
      algorithmName: 'BFS',
      stepIndex: 0,
      totalSteps: 0,
      stepDescription: 'Loaded a new BFS example.',
      queue: [],
      visited: []
    });
  };

  const generateRandomExample = () => {
    const nodeCount = selectedExample === 'large' ? 10 : selectedExample === 'medium' ? 8 : 6;
    const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').slice(0, nodeCount);
    const centerX = 360;
    const centerY = 130;
    const radius = selectedExample === 'large' ? 170 : selectedExample === 'medium' ? 150 : 120;
    const randomNodes = labels.map((label, index) => {
      const angle = (index / labels.length) * 2 * Math.PI;
      return {
        id: label,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        status: 'default' as const
      };
    });

    const randomEdges: GraphEdge[] = [];
    for (let i = 1; i < labels.length; i++) {
      const source = labels[Math.floor(Math.random() * i)];
      const target = labels[i];
      randomEdges.push({ source, target, status: 'default' });
    }

    const extraEdges = Math.max(2, Math.floor(nodeCount / 2));
    for (let i = 0; i < extraEdges; i++) {
      const source = labels[Math.floor(Math.random() * labels.length)];
      const target = labels[Math.floor(Math.random() * labels.length)];
      if (source === target) continue;
      const exists = randomEdges.some(
        (edge) =>
          (edge.source === source && edge.target === target) ||
          (edge.source === target && edge.target === source)
      );
      if (!exists) {
        randomEdges.push({ source, target, status: 'default' });
      }
    }

    setNodes(randomNodes);
    setEdges(randomEdges);
    setStartNode(labels[0]);
    setAnimationSteps([]);
    setCurrentStep(0);
    setCurrentDescription('Random example generated.');
    setQueue([]);
    setVisited(new Set());
    setIsAnimating(false);
    setIsPaused(false);
    updateVisualizationState({
      algorithmId: 'bfs',
      algorithmName: 'BFS',
      stepIndex: 0,
      totalSteps: 0,
      stepDescription: 'Random BFS example generated.',
      queue: [],
      visited: []
    });
  };

  useEffect(() => {
    applyExample(examples[0]);
  }, []);

  const reset = () => {
    setNodes(prev => prev.map(node => ({ ...node, status: 'default' })));
    setEdges(prev => prev.map(edge => ({ ...edge, status: 'default' })));
    setAnimationSteps([]);
    setCurrentStep(0);
    setCurrentDescription('');
    setQueue([]);
    setVisited(new Set());
    setIsAnimating(false);
    setIsPaused(false);
    updateVisualizationState({
      algorithmId: 'bfs',
      algorithmName: 'BFS',
      stepIndex: 0,
      totalSteps: 0,
      stepDescription: 'BFS state reset.',
      queue: [],
      visited: []
    });
  };

  const generateBFSSteps = () => {
    if (!startNode || !nodes.find(n => n.id === startNode)) {
      alert('Please select a valid start node');
      return;
    }

    const steps: { visited: string[]; queue: string[]; current: string; description: string }[] = [];
    const visitedSet = new Set<string>();
    const queueArray = [startNode];
    
    steps.push({
      visited: [],
      queue: [startNode],
      current: '',
      description: `Starting BFS from node ${startNode}. Added to queue.`
    });

    while (queueArray.length > 0) {
      const current = queueArray.shift()!;
      
      if (!visitedSet.has(current)) {
        visitedSet.add(current);
        
        steps.push({
          visited: Array.from(visitedSet),
          queue: [...queueArray],
          current,
          description: `Visiting node ${current}. Marking as visited.`
        });

        const neighbors = edges
          .filter(edge => edge.source === current || edge.target === current)
          .map(edge => edge.source === current ? edge.target : edge.source)
          .filter(neighbor => !visitedSet.has(neighbor) && !queueArray.includes(neighbor));

        neighbors.forEach(neighbor => queueArray.push(neighbor));
        
        if (neighbors.length > 0) {
          steps.push({
            visited: Array.from(visitedSet),
            queue: [...queueArray],
            current,
            description: `Added neighbors ${neighbors.join(', ')} to queue.`
          });
        }
      }
    }

    steps.push({
      visited: Array.from(visitedSet),
      queue: [],
      current: '',
      description: 'BFS traversal completed!'
    });

    setAnimationSteps(steps);
    setCurrentStep(0);
    setIsAnimating(true);
    setIsPaused(false);
    updateVisualizationState({
      algorithmId: 'bfs',
      algorithmName: 'BFS',
      stepIndex: 0,
      totalSteps: steps.length,
      stepDescription: steps[0]?.description,
      queue: steps[0]?.queue ?? [],
      visited: steps[0]?.visited ?? []
    });
  };

  const togglePlayPause = () => {
    if (animationSteps.length === 0) {
      generateBFSSteps();
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
        }, animationSpeed[0] * 1000);
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
  }, [isAnimating, isPaused, currentStep, animationSteps, animationSpeed]);

  useEffect(() => {
    if (animationSteps.length > 0 && currentStep < animationSteps.length) {
      const step = animationSteps[currentStep];
      setCurrentDescription(step.description);
      setQueue(step.queue);
      setVisited(new Set(step.visited));
      
      setNodes(prev => prev.map(node => ({
        ...node,
        status: step.visited.includes(node.id) ? 'visited' :
                step.current === node.id ? 'visiting' :
                step.queue.includes(node.id) ? 'queued' : 'default'
      })));
      updateVisualizationState({
        algorithmId: 'bfs',
        algorithmName: 'BFS',
        stepIndex: currentStep,
        totalSteps: animationSteps.length,
        stepDescription: step.description,
        currentNode: step.current,
        queue: step.queue,
        visited: step.visited
      });
    }
  }, [currentStep, animationSteps]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Breadth-First Search (BFS)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border rounded-lg p-3">
            <div className="flex flex-wrap gap-4 items-center justify-center">
            <Button
              onClick={() => {
                const example = examples.find((item) => item.key === selectedExample) ?? examples[0];
                applyExample(example);
              }}
              variant="outline"
              size="sm"
            >
              <Shuffle className="h-4 w-4 mr-2" />
              Load Example
            </Button>
            <Button onClick={generateRandomExample} variant="outline" size="sm">
              Random Example
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

            <div className="flex flex-wrap gap-2 items-center justify-center">
            <span className="text-xs text-muted-foreground">Presets:</span>
            {examples.map((example) => (
              <Button
                key={example.key}
                size="sm"
                variant={selectedExample === example.key ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedExample(example.key);
                  applyExample(example);
                }}
              >
                {example.label}
              </Button>
            ))}
          </div>

            <div className="space-y-3 p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Animation Speed</span>
              <span className="text-xs text-muted-foreground">{animationSpeed[0].toFixed(1)}s</span>
            </div>
            <Slider
              value={animationSpeed}
              onValueChange={setAnimationSpeed}
              max={4}
              min={0.5}
              step={0.1}
              className="flex-1"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Fast</span>
              <span>Medium</span>
              <span>Slow</span>
            </div>
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
                <div className="w-3 h-3 bg-viz-node-queued rounded-full"></div>
                <span>In Queue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-viz-node-active rounded-full"></div>
                <span>Visiting</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-viz-node-visited rounded-full"></div>
                <span>Visited</span>
              </div>
            </div>
          </div>

            {/* Step Description */}
          {currentDescription && (
            <div className="p-3 bg-viz-panel border border-border rounded-lg text-foreground text-sm">
              <strong>Step:</strong> {currentDescription}
            </div>
          )}

            {/* Queue Display */}
          <div className="p-3 bg-viz-panel border border-border rounded-lg">
            <strong className="text-foreground">Queue:</strong>
            <span className="ml-2 text-muted-foreground">
              {queue.length > 0 ? `[${queue.join(', ')}]` : 'Empty'}
            </span>
          </div>

          </div>

          {/* Graph Visualization */}
          <div className="max-w-full overflow-x-auto rounded-lg">
            <div className="bg-muted/20 p-6 rounded-lg min-h-[300px] min-w-[720px] flex items-center justify-center">
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
                      stroke={edge.status === 'visited' ? 'hsl(var(--viz-edge-visited))' : 'hsl(var(--viz-edge-default))'}
                      strokeWidth="2"
                    />
                  );
                })}
                
                {/* Render nodes */}
                {nodes.map((node) => {
                  const nodeColor = node.status === 'visited'
                    ? 'hsl(var(--viz-node-visited))'
                    : node.status === 'visiting'
                    ? 'hsl(var(--viz-node-active))'
                    : node.status === 'queued'
                    ? 'hsl(var(--viz-node-queued))'
                    : 'hsl(var(--viz-node-default))';
                  
                  return (
                    <g key={node.id}>
                      <motion.circle
                        cx={node.x}
                        cy={node.y}
                        r="20"
                        fill={nodeColor}
                        stroke="hsl(var(--background))"
                        strokeWidth="2"
                        animate={{ scale: node.status === 'visiting' ? 1.2 : 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <text
                        x={node.x}
                        y={node.y + 5}
                        textAnchor="middle"
                        className="fill-primary-foreground text-sm font-bold"
                      >
                        {node.id}
                      </text>
                    </g>
                  );
                })}
              </svg>
            )}
            </div>
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
              <li>• Shortest path in unweighted graphs</li>
              <li>• Level-order traversal</li>
              <li>• Social networking connections</li>
              <li>• Web crawling</li>
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
          <ul className="text-sm space-y-2">
            <li>
            <a 
                  href="https://www.tutorialspoint.com/data_structures_algorithms/breadth_first_traversal.htm" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1 text-blue-500 hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                   BFS
                </a>
            </li>
            <li>
              <ExternalLink className="h-4 w-4 inline-block mr-1" />
              <a href="https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/" target="_blank" rel="noopener noreferrer" className="underline">
                GeeksforGeeks - Breadth-First Search
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default BFSVisualizer;
