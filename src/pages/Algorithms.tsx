
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import SortingVisualizer from '../components/visualizers/SortingVisualizer';
import SearchVisualizer from '../components/visualizers/SearchVisualizer';
import BubbleSortVisualizer from '../components/visualizers/BubbleSortVisualizer';
import SelectionSortVisualizer from '../components/visualizers/SelectionSortVisualizer';

const algorithms = [
  { id: 'bubble-sort', name: 'Bubble Sort', description: 'Simple comparison-based sorting algorithm' },
  { id: 'selection-sort', name: 'Selection Sort', description: 'Find minimum and place at beginning' },
  { id: 'sorting', name: 'More Sorting', description: 'Quick, Merge, Heap, and more (Coming Soon)' },
  { id: 'searching', name: 'Searching', description: 'Linear, Binary, Jump, and Exponential search' },
  { id: 'graph', name: 'Graph Algorithms', description: 'DFS, BFS, Dijkstra, and A* (Coming Soon)' },
  { id: 'dynamic', name: 'Dynamic Programming', description: 'Fibonacci, Knapsack, LCS (Coming Soon)' }
];

const Algorithms: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble-sort');

  const renderVisualizer = () => {
    switch (selectedAlgorithm) {
      case 'bubble-sort':
        return <BubbleSortVisualizer />;
      case 'selection-sort':
        return <SelectionSortVisualizer />;
      case 'sorting':
        return <SortingVisualizer />;
      case 'searching':
        return <SearchVisualizer />;
      case 'graph':
        return (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">Graph Algorithms</h3>
              <p className="text-muted-foreground">Coming Soon - DFS, BFS, Dijkstra, A*</p>
            </CardContent>
          </Card>
        );
      case 'dynamic':
        return (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">Dynamic Programming</h3>
              <p className="text-muted-foreground">Coming Soon - Fibonacci, Knapsack, LCS</p>
            </CardContent>
          </Card>
        );
      default:
        return <BubbleSortVisualizer />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold gradient-text">Algorithms</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Visualize and understand how different algorithms work step by step
          </p>
        </motion.div>

        {/* Algorithm Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Algorithm Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {algorithms.map((algorithm) => (
                <Button
                  key={algorithm.id}
                  variant={selectedAlgorithm === algorithm.id ? 'default' : 'outline'}
                  className="h-auto p-4 flex flex-col gap-2"
                  onClick={() => setSelectedAlgorithm(algorithm.id)}
                >
                  <span className="font-semibold">{algorithm.name}</span>
                  <span className="text-xs text-muted-foreground text-center">
                    {algorithm.description}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Visualizer */}
        <motion.div
          key={selectedAlgorithm}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderVisualizer()}
        </motion.div>
      </div>
    </div>
  );
};

export default Algorithms;
