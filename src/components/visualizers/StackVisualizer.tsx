
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { Plus, Minus, Eye, RotateCcw, ExternalLink, AlertTriangle, Gauge } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LearnMoreLink } from '../LearnMoreLink';

interface StackItem {
  id: string;
  value: number;
  status: 'default' | 'pushing' | 'popping' | 'peeking';
}

const StackVisualizer: React.FC = () => {
  const [stack, setStack] = useState<StackItem[]>([]);
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
    const newStack = randomExample.map(value => ({
      id: Date.now().toString() + Math.random(),
      value,
      status: 'default' as const
    }));
    setStack(newStack);
    setLastOperation('Generated example stack');
    resetError();
  };

  const eraseExample = () => {
    setStack([]);
    setLastOperation('Erased stack');
    resetError();
  };

  const push = () => {
    const value = parseInt(inputValue.trim());
    if (isNaN(value)) {
      setError('Please enter a valid number');
      return;
    }
    
    if (stack.length >= maxSize) {
      setError('Stack Overflow! Maximum size reached');
      return;
    }

    resetError();
    setIsAnimating(true);
    
    const newItem: StackItem = {
      id: Date.now().toString(),
      value,
      status: 'pushing'
    };

    setStack(prev => [newItem, ...prev]);
    setInputValue('');
    setLastOperation(`Pushed ${value}`);

    // Animation cleanup
    if (animationRef.current) clearTimeout(animationRef.current);
    animationRef.current = setTimeout(() => {
      setStack(prev => prev.map(item => ({ ...item, status: 'default' as const })));
      setIsAnimating(false);
    }, animationSpeed[0] * 1000);
  };

  const pop = () => {
    if (stack.length === 0) {
      setError('Stack Underflow! Stack is empty');
      return;
    }

    resetError();
    setIsAnimating(true);

    // Mark top item as popping
    setStack(prev => prev.map((item, index) => 
      index === 0 ? { ...item, status: 'popping' as const } : item
    ));

    const poppedValue = stack[0].value;
    setLastOperation(`Popped ${poppedValue}`);

    // Remove after animation
    if (animationRef.current) clearTimeout(animationRef.current);
    animationRef.current = setTimeout(() => {
      setStack(prev => prev.slice(1));
      setIsAnimating(false);
    }, animationSpeed[0] * 1000);
  };

  const peek = () => {
    if (stack.length === 0) {
      setError('Stack is empty! Nothing to peek');
      return;
    }

    resetError();
    setIsAnimating(true);
    
    const topValue = stack[0].value;
    setPeekedValue(topValue);
    setLastOperation(`Peeked ${topValue}`);

    // Highlight top item
    setStack(prev => prev.map((item, index) => 
      index === 0 ? { ...item, status: 'peeking' as const } : item
    ));

    // Reset highlight
    if (animationRef.current) clearTimeout(animationRef.current);
    animationRef.current = setTimeout(() => {
      setStack(prev => prev.map(item => ({ ...item, status: 'default' as const })));
      setIsAnimating(false);
    }, animationSpeed[0] * 1000);
  };

  const reset = () => {
    setStack([]);
    setInputValue('');
    setLastOperation('Stack reset');
    setIsAnimating(false);
    resetError();
    if (animationRef.current) clearTimeout(animationRef.current);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isAnimating) {
      push();
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, []);

  const getItemColor = (status: StackItem['status']) => {
    switch (status) {
      case 'pushing': return 'bg-green-500 scale-110';
      case 'popping': return 'bg-red-500 scale-110';
      case 'peeking': return 'bg-yellow-500 scale-105';
      default: return 'bg-primary';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stack Visualizer (LIFO - Last In First Out)</CardTitle>
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
              <label className="text-sm font-medium">Push Element</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Value" 
                  type="number" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isAnimating}
                />
                <Button size="sm" onClick={push} disabled={isAnimating || !inputValue.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Pop Element</label>
              <Button size="sm" variant="destructive" onClick={pop} disabled={isAnimating || stack.length === 0}>
                <Minus className="h-4 w-4 mr-2" />
                Pop
              </Button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Peek Top</label>
              <Button size="sm" variant="outline" onClick={peek} disabled={isAnimating || stack.length === 0}>
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
              <span className="text-sm">Top element: <strong>{peekedValue}</strong></span>
            </div>
          )}

          {/* Stack Visualization */}
          <div className="bg-muted/20 p-6 rounded-lg min-h-[300px] flex flex-col items-center justify-end relative">
            {stack.length === 0 ? (
              <div className="text-center text-muted-foreground">
                <p className="text-lg font-medium">Empty Stack</p>
                <p className="text-sm">Push elements to see visualization</p>
              </div>
            ) : (
              <>
                {/* TOP indicator */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-sm font-medium text-muted-foreground">
                  ← TOP
                </div>
                
                {/* Stack base */}
                <div className="w-24 h-3 bg-gray-600 rounded-b-lg mb-1" />
                
                {/* Stack items */}
                <div className="flex flex-col-reverse space-y-reverse space-y-1">
                  <AnimatePresence>
                    {stack.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: -20, scale: 0.8 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0, 
                          scale: item.status === 'pushing' || item.status === 'popping' ? 1.1 : 1,
                          rotate: item.status === 'popping' ? [0, 5, -5, 0] : 0
                        }}
                        exit={{ opacity: 0, y: -30, scale: 0.5 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`w-24 h-12 ${getItemColor(item.status)} text-white border border-gray-300 flex items-center justify-center font-bold text-sm transition-all duration-300`}
                        style={{ 
                          borderRadius: index === 0 ? '8px 8px 0 0' : '0',
                        }}
                      >
                        {item.value}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>

          {/* Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-medium">Size</div>
              <div className="text-lg font-bold">{stack.length}/{maxSize}</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-medium">Last Operation</div>
              <div className="text-sm">{lastOperation || 'None'}</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-medium">Top Element</div>
              <div className="text-lg font-bold">{stack.length > 0 ? stack[0].value : 'Empty'}</div>
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
                <h4 className="font-semibold mb-2">Stacks are used in:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Function call management (call stack)</li>
                  <li>• Undo operations in applications</li>
                  <li>• Browser history navigation</li>
                  <li>• Expression evaluation and parsing</li>
                  <li>• Backtracking algorithms</li>
                </ul>
              </div>
              <div className="flex gap-2 items-center">
              <a 
                  href="https://www.w3schools.com/dsa/dsa_data_stacks.php" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1 text-blue-500 hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  W3Schools Stack
                </a>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://www.geeksforgeeks.org/stack-data-structure/" target="_blank" rel="noopener noreferrer">
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
                    <span>Push:</span>
                    <span className="font-mono">O(1)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Pop:</span>
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
                  <li>• Simple LIFO operations</li>
                  <li>• Fast O(1) push and pop</li>
                  <li>• Memory efficient</li>
                  <li>• Easy to implement</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StackVisualizer;
