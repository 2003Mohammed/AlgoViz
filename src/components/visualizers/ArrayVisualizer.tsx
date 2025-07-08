
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Play, Pause, SkipForward, RotateCcw, Shuffle, Plus, Minus, Search, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ArrayItem {
  value: number;
  status: 'default' | 'comparing' | 'swapping' | 'sorted' | 'found' | 'searching';
}

const ArrayVisualizer: React.FC = () => {
  const [array, setArray] = useState<ArrayItem[]>([
    { value: 64, status: 'default' },
    { value: 34, status: 'default' },
    { value: 25, status: 'default' },
    { value: 12, status: 'default' },
    { value: 22, status: 'default' }
  ]);
  const [customInput, setCustomInput] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [insertIndex, setInsertIndex] = useState('');
  const [deleteIndex, setDeleteIndex] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState('');
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetError = () => setError('');

  const generateExample = () => {
    const examples = [
      [64, 34, 25, 12, 22, 11, 90],
      [45, 23, 78, 12, 56, 89, 34],
      [10, 30, 20, 50, 40, 60, 80],
      [100, 75, 50, 25, 15, 5, 85]
    ];
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setArray(randomExample.map(value => ({ value, status: 'default' as const })));
    resetError();
  };

  const eraseExample = () => {
    setArray([]);
    resetError();
  };

  const handleInsert = () => {
    const value = parseInt(customInput.trim());
    const index = insertIndex.trim() === '' ? array.length : parseInt(insertIndex.trim());
    
    if (isNaN(value)) {
      setError('Please enter a valid number');
      return;
    }
    
    if (index < 0 || index > array.length) {
      setError(`Index must be between 0 and ${array.length}`);
      return;
    }

    resetError();
    const newArray = [...array];
    newArray.splice(index, 0, { value, status: 'default' });
    setArray(newArray);
    setCustomInput('');
    setInsertIndex('');
  };

  const handleDelete = () => {
    const index = parseInt(deleteIndex.trim());
    
    if (array.length === 0) {
      setError('Array is empty');
      return;
    }
    
    if (isNaN(index) || index < 0 || index >= array.length) {
      setError(`Index must be between 0 and ${array.length - 1}`);
      return;
    }

    resetError();
    const newArray = [...array];
    newArray.splice(index, 1);
    setArray(newArray);
    setDeleteIndex('');
  };

  const handleSearch = () => {
    const value = parseInt(searchValue.trim());
    
    if (isNaN(value)) {
      setError('Please enter a valid number to search');
      return;
    }

    resetError();
    setIsAnimating(true);
    
    // Animate search
    let currentIndex = 0;
    const searchAnimation = () => {
      if (currentIndex < array.length) {
        setArray(prev => prev.map((item, index) => ({
          ...item,
          status: index === currentIndex ? 'searching' as const :
                 item.value === value && index < currentIndex ? 'found' as const :
                 'default' as const
        })));
        
        if (array[currentIndex].value === value) {
          setTimeout(() => {
            setArray(prev => prev.map((item, index) => ({
              ...item,
              status: index === currentIndex ? 'found' as const : 'default' as const
            })));
            setIsAnimating(false);
          }, 500);
          return;
        }
        
        currentIndex++;
        setTimeout(searchAnimation, 500);
      } else {
        setArray(prev => prev.map(item => ({ ...item, status: 'default' as const })));
        setError('Element not found');
        setIsAnimating(false);
      }
    };
    
    searchAnimation();
    setSearchValue('');
  };

  const shuffleArray = () => {
    resetError();
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    setArray(newArray.map(item => ({ ...item, status: 'default' })));
  };

  const resetArray = () => {
    setArray(prev => prev.map(item => ({ ...item, status: 'default' })));
    setCustomInput('');
    setSearchValue('');
    setInsertIndex('');
    setDeleteIndex('');
    resetError();
    setIsAnimating(false);
  };

  const getItemColor = (status: ArrayItem['status']) => {
    switch (status) {
      case 'comparing': return 'bg-yellow-500';
      case 'swapping': return 'bg-red-500';
      case 'sorted': return 'bg-green-500';
      case 'found': return 'bg-blue-500';
      case 'searching': return 'bg-orange-500';
      default: return 'bg-primary';
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Array Visualizer</CardTitle>
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

          {/* Operations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Insert Element</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Value" 
                  type="number" 
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  disabled={isAnimating}
                  className="flex-1"
                />
                <Input 
                  placeholder="Index" 
                  type="number" 
                  value={insertIndex}
                  onChange={(e) => setInsertIndex(e.target.value)}
                  disabled={isAnimating}
                  className="w-20"
                />
                <Button size="sm" onClick={handleInsert} disabled={isAnimating || !customInput.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Delete Element</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Index" 
                  type="number" 
                  value={deleteIndex}
                  onChange={(e) => setDeleteIndex(e.target.value)}
                  disabled={isAnimating}
                />
                <Button size="sm" variant="destructive" onClick={handleDelete} disabled={isAnimating || !deleteIndex.trim()}>
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Element</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Value" 
                  type="number" 
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  disabled={isAnimating}
                />
                <Button size="sm" variant="outline" onClick={handleSearch} disabled={isAnimating || !searchValue.trim()}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Array Actions</label>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={shuffleArray} disabled={isAnimating}>
                  <Shuffle className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={resetArray}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Array Visualization */}
          <div className="bg-muted/20 p-6 rounded-lg min-h-[200px] flex items-end justify-center gap-2">
            {array.length === 0 ? (
              <div className="text-center text-muted-foreground">
                <p className="text-lg font-medium">Empty Array</p>
                <p className="text-sm">Generate an example or insert elements</p>
              </div>
            ) : (
              <AnimatePresence>
                {array.map((item, index) => (
                  <motion.div
                    key={`${index}-${item.value}`}
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-xs text-muted-foreground mb-1">{index}</div>
                    <motion.div
                      className={`w-12 h-16 ${getItemColor(item.status)} text-white rounded-md flex items-center justify-center font-bold text-sm shadow-lg`}
                      animate={{ 
                        scale: item.status === 'searching' || item.status === 'found' ? 1.1 : 1,
                        boxShadow: item.status === 'found' ? '0 0 20px rgba(59, 130, 246, 0.5)' : '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.value}
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-medium">Length</div>
              <div className="text-lg font-bold">{array.length}</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-medium">Memory Usage</div>
              <div className="text-lg font-bold">{array.length * 4} bytes</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-medium">Access Time</div>
              <div className="text-lg font-bold">O(1)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Educational Content */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Time Complexity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Access:</span>
                <span className="font-mono">O(1)</span>
              </div>
              <div className="flex justify-between">
                <span>Search:</span>
                <span className="font-mono">O(n)</span>
              </div>
              <div className="flex justify-between">
                <span>Insertion:</span>
                <span className="font-mono">O(n)</span>
              </div>
              <div className="flex justify-between">
                <span>Deletion:</span>
                <span className="font-mono">O(n)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Real-world Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              <li>• Database indexing</li>
              <li>• Image processing (pixel arrays)</li>
              <li>• Dynamic programming tables</li>
              <li>• Buffer management</li>
              <li>• Mathematical computations</li>
            </ul>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  MDN
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="https://www.geeksforgeeks.org/array-data-structure/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  GeeksforGeeks
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArrayVisualizer;
