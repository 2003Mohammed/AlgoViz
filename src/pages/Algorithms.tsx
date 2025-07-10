
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import BubbleSortVisualizer from '../components/visualizers/BubbleSortVisualizer';
import SelectionSortVisualizer from '../components/visualizers/SelectionSortVisualizer';
import InsertionSortVisualizer from '../components/visualizers/InsertionSortVisualizer';
import MergeSortVisualizer from '../components/visualizers/MergeSortVisualizer';
import QuickSortVisualizer from '../components/visualizers/QuickSortVisualizer';
import HeapSortVisualizer from '../components/visualizers/HeapSortVisualizer';
import BFSVisualizer from '../components/visualizers/BFSVisualizer';
import DFSVisualizer from '../components/visualizers/DFSVisualizer';
import DijkstraVisualizer from '../components/visualizers/DijkstraVisualizer';
import LinearSearchVisualizer from '../components/visualizers/LinearSearchVisualizer';
import BinarySearchVisualizer from '../components/visualizers/BinarySearchVisualizer';

const algorithms = [
  // Sorting Algorithms
  { id: 'bubble-sort', name: 'Bubble Sort', description: 'Simple comparison-based sorting algorithm', category: 'sorting' },
  { id: 'selection-sort', name: 'Selection Sort', description: 'Find minimum and place at beginning', category: 'sorting' },
  { id: 'insertion-sort', name: 'Insertion Sort', description: 'Build sorted array one element at a time', category: 'sorting' },
  { id: 'merge-sort', name: 'Merge Sort', description: 'Divide-and-conquer sorting algorithm', category: 'sorting' },
  { id: 'quick-sort', name: 'Quick Sort', description: 'Efficient divide-and-conquer sorting', category: 'sorting' },
  { id: 'heap-sort', name: 'Heap Sort', description: 'Sorting using binary heap data structure', category: 'sorting' },
  
  // Searching Algorithms
  { id: 'linear-search', name: 'Linear Search', description: 'Sequential search through array', category: 'searching' },
  { id: 'binary-search', name: 'Binary Search', description: 'Efficient search in sorted array', category: 'searching' },
  
  // Graph Algorithms
  { id: 'bfs-algo', name: 'BFS Algorithm', description: 'Breadth-first traversal algorithm', category: 'graph' },
  { id: 'dfs-algo', name: 'DFS Algorithm', description: 'Depth-first traversal algorithm', category: 'graph' },
  { id: 'dijkstra', name: 'Dijkstra Algorithm', description: 'Shortest path algorithm', category: 'graph' }
];

const Algorithms: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble-sort');

  const renderVisualizer = () => {
    switch (selectedAlgorithm) {
      // Sorting Algorithms
      case 'bubble-sort':
        return <BubbleSortVisualizer />;
      case 'selection-sort':
        return <SelectionSortVisualizer />;
      case 'insertion-sort':
        return <InsertionSortVisualizer />;
      case 'merge-sort':
        return <MergeSortVisualizer />;
      case 'quick-sort':
        return <QuickSortVisualizer />;
      case 'heap-sort':
        return <HeapSortVisualizer />;
      
      // Searching Algorithms
      case 'linear-search':
        return <LinearSearchVisualizer />;
      case 'binary-search':
        return <BinarySearchVisualizer />;
      
      // Graph Algorithms
      case 'bfs-algo':
        return <BFSVisualizer />;
      case 'dfs-algo':
        return <DFSVisualizer />;
      case 'dijkstra':
        return <DijkstraVisualizer />;
      
      default:
        return <BubbleSortVisualizer />;
    }
  };

  const getAlgorithmsByCategory = (category: string) => {
    return algorithms.filter(alg => alg.category === category);
  };

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2 md:space-y-4"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">Algorithms</h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
            Visualize and understand how different algorithms work step by step
          </p>
        </motion.div>

        {/* Algorithm Selection by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Select Algorithm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sorting Algorithms */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-blue-600">Sorting Algorithms</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {getAlgorithmsByCategory('sorting').map((algorithm) => (
                  <Button
                    key={algorithm.id}
                    variant={selectedAlgorithm === algorithm.id ? 'default' : 'outline'}
                    className="h-auto p-2 sm:p-3 flex flex-col gap-1"
                    onClick={() => setSelectedAlgorithm(algorithm.id)}
                  >
                    <span className="font-semibold text-xs sm:text-sm">{algorithm.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Searching Algorithms */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-green-600">Searching Algorithms</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {getAlgorithmsByCategory('searching').map((algorithm) => (
                  <Button
                    key={algorithm.id}
                    variant={selectedAlgorithm === algorithm.id ? 'default' : 'outline'}
                    className="h-auto p-2 sm:p-3 flex flex-col gap-1"
                    onClick={() => setSelectedAlgorithm(algorithm.id)}
                  >
                    <span className="font-semibold text-xs sm:text-sm">{algorithm.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Graph Algorithms */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-purple-600">Graph Algorithms</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {getAlgorithmsByCategory('graph').map((algorithm) => (
                  <Button
                    key={algorithm.id}
                    variant={selectedAlgorithm === algorithm.id ? 'default' : 'outline'}
                    className="h-auto p-2 sm:p-3 flex flex-col gap-1"
                    onClick={() => setSelectedAlgorithm(algorithm.id)}
                  >
                    <span className="font-semibold text-xs sm:text-sm">{algorithm.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visualizer */}
        <motion.div
          key={selectedAlgorithm}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          {renderVisualizer()}
        </motion.div>
      </div>
    </div>
  );
};

export default Algorithms;
