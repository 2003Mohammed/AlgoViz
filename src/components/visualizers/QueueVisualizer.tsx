
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { Plus, Minus, Eye, RotateCcw, ExternalLink, AlertTriangle, Gauge } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QueueItem {
  id: string;
  value: number;
  status: 'default' | 'enqueuing' | 'dequeuing' | 'peeking';
}

const QueueVisualizer: React.FC = () => {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [lastOperation, setLastOperation] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [peekedValue, setPeekedValue] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [animationSpeed, setAnimationSpeed] = useState([0.5]); // Default: 0.5 seconds
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxSize = 8;

  const resetError = () => {
    setError('');
    setPeekedValue(null);
  };

  const generateExample = () => {
    const examples = [
      [10, 20, 30, 40],
      [5, 15, 25, 35],
      [100, 200, 300]
    ];
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    const newQueue = randomExample.map(value => ({
      id: Date.now().toString() + Math.random(),
      value,
      status: 'default' as const
    }));
    setQueue(newQueue);
    setLastOperation('Generated example queue');
    resetError();
  };

  const eraseExample = () => {
    setQueue([]);
    setLastOperation('Erased queue');
    resetError();
  };

  const enqueue = () => {
    const value = parseInt(inputValue.trim());
    if (isNaN(value)) {
      setError('Please enter a valid number');
      return;
    }
    
    if (queue.length >= maxSize) {
      setError('Queue Overflow! Maximum size reached');
      return;
    }

    resetError();
    setIsAnimating(true);
    
    const newItem: QueueItem = {
      id: Date.now().toString(),
      value,
      status: 'enqueuing'
    };

    setQueue(prev => [...prev, newItem]);
    setInputValue('');
    setLastOperation(`Enqueued ${value}`);

    // Animation cleanup
    if (animationRef.current) clearTimeout(animationRef.current);
    animationRef.current = setTimeout(() => {
      setQueue(prev => prev.map(item => ({ ...item, status: 'default' as const })));
      setIsAnimating(false);
    }, animationSpeed[0] * 1000);
  };

  const dequeue = () => {
    if (queue.length === 0) {
      setError('Queue Underflow! Queue is empty');
      return;
    }

    resetError();
    setIsAnimating(true);

    // Mark front item as dequeuing
    setQueue(prev => prev.map((item, index) => 
      index === 0 ? { ...item, status: 'dequeuing' as const } : item
    ));

    const dequeuedValue = queue[0].value;
    setLastOperation(`Dequeued ${dequeuedValue}`);

    // Remove after animation
    if (animationRef.current) clearTimeout(animationRef.current);
    animationRef.current = setTimeout(() => {
      setQueue(prev => prev.slice(1));
      setIsAnimating(false);
    }, animationSpeed[0] * 1000);
  };

  const peek = () => {
    if (queue.length === 0) {
      setError('Queue is empty! Nothing to peek');
      return;
    }

    resetError();
    setIsAnimating(true);
    
    const frontValue = queue[0].value;
    setPeekedValue(frontValue);
    setLastOperation(`Peeked ${frontValue}`);

    // Highlight front item
    setQueue(prev => prev.map((item, index) => 
      index === 0 ? { ...item, status: 'peeking' as const } : item
    ));

    // Reset highlight
    if (animationRef.current) clearTimeout(animationRef.current);
    animationRef.current = setTimeout(() => {
      setQueue(prev => prev.map(item => ({ ...item, status: 'default' as const })));
      setIsAnimating(false);
    }, animationSpeed[0] * 1000);
  };

  const reset = () => {
    setQueue([]);
    setInputValue('');
    setLastOperation('Queue reset');
    setIsAnimating(false);
    resetError();
    if (animationRef.current) clearTimeout(animationRef.current);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isAnimating) {
      enqueue();
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, []);

  const getItemColor = (status: QueueItem['status']) => {
    switch (status) {
      case 'enqueuing': return 'bg-green-500 scale-110';
      case 'dequeuing': return 'bg-red-500 scale-110';
      case 'peeking': return 'bg-yellow-500 scale-105';
      default: return 'bg-primary';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Queue Visualizer (FIFO - First In First Out)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Example Generation */}
          <div className="flex gap-2 justify-center">
            <Button onClick={generateExample} variant="outline" size="sm">
              Generate Example
            </Button>
            <Button onClick={eraseExample} variant="outline" size="sm">
              Erase Example
            </Button>
          </div>

          {/* Speed Controller */}
          <div className="space-y-3 p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Animation Speed</span>
            </div>
            <div className="flex items-center gap-4">
              <Slider
                value={animationSpeed}
                onValueChange={setAnimationSpeed}
                max={2}
                min={0.1}
                step={0.1}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground min-w-[60px]">
                {animationSpeed[0]}s
              </span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Fast</span>
              <span>Medium</span>
              <span>Slow</span>
            </div>
          </div>

          {/* Operations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Enqueue Element</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Value" 
                  type="number" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isAnimating}
                />
                <Button size="sm" onClick={enqueue} disabled={isAnimating || !inputValue.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Dequeue Element</label>
              <Button size="sm" variant="destructive" onClick={dequeue} disabled={isAnimating || queue.length === 0}>
                <Minus className="h-4 w-4 mr-2" />
                Dequeue
              </Button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Peek Front</label>
              <Button size="sm" variant="outline" onClick={peek} disabled={isAnimating || queue.length === 0}>
                <Eye className="h-4 w-4 mr-2" />
                Peek
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Peek Result */}
          {peekedValue !== null && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
              <Eye className="h-4 w-4" />
              <span className="text-sm">Front element: <strong>{peekedValue}</strong></span>
            </div>
          )}

          {/* Queue Visualization */}
          <div className="bg-muted/20 p-6 rounded-lg min-h-[200px] flex items-center justify-center relative">
            {queue.length === 0 ? (
              <div className="text-center text-muted-foreground">
                <p className="text-lg font-medium">Empty Queue</p>
                <p className="text-sm">Enqueue elements to see visualization</p>
              </div>
            ) : (
              <div className="relative">
                {/* Front and Rear indicators */}
                <div className="absolute -top-8 left-0 text-xs text-muted-foreground">
                  FRONT →
                </div>
                <div className="absolute -bottom-8 right-0 text-xs text-muted-foreground">
                  ← REAR
                </div>
                
                {/* Queue items */}
                <div className="flex items-center gap-1 overflow-x-auto">
                  <AnimatePresence>
                    {queue.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20, scale: 0.8 }}
                        animate={{ 
                          opacity: 1, 
                          x: 0, 
                          scale: item.status === 'enqueuing' || item.status === 'dequeuing' ? 1.1 : 1,
                          rotate: item.status === 'dequeuing' ? [0, 5, -5, 0] : 0
                        }}
                        exit={{ opacity: 0, x: -100, scale: 0.5 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`w-16 h-16 ${getItemColor(item.status)} text-white border border-gray-300 flex items-center justify-center font-bold text-sm rounded-md transition-all duration-300`}
                      >
                        {item.value}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-medium">Size</div>
              <div className="text-lg font-bold">{queue.length}/{maxSize}</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-medium">Last Operation</div>
              <div className="text-sm">{lastOperation || 'None'}</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-medium">Front Element</div>
              <div className="text-lg font-bold">{queue.length > 0 ? queue[0].value : 'Empty'}</div>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Real-world Applications */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Real-world Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Queues are used in:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Task scheduling in operating systems</li>
                  <li>• Print queue management</li>
                  <li>• Breadth-first search algorithms</li>
                  <li>• Request handling in web servers</li>
                  <li>• Buffer for data streams</li>
                </ul>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://www.w3schools.com/dsa/dsa_theory_queue.php" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    W3Schools
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://www.geeksforgeeks.org/queue-data-structure/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    GeeksforGeeks
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Complexity & Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Time Complexity:</h4>
                <ul className="text-sm space-y-1">
                  <li className="flex justify-between">
                    <span>Enqueue:</span>
                    <span className="font-mono">O(1)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Dequeue:</span>
                    <span className="font-mono">O(1)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Peek:</span>
                    <span className="font-mono">O(1)</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Advantages:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Fair FIFO ordering</li>
                  <li>• Fast O(1) enqueue and dequeue</li>
                  <li>• Predictable behavior</li>
                  <li>• Great for buffering</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QueueVisualizer;
