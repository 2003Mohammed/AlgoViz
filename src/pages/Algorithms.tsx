
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const algorithms = [
  // Sorting Algorithms
  { id: 'bubble-sort', name: 'Bubble Sort', description: 'Simple comparison-based sorting algorithm', category: 'sorting', path: '/algorithms/sorting/bubble-sort' },
  { id: 'selection-sort', name: 'Selection Sort', description: 'Find minimum and place at beginning', category: 'sorting', path: '/algorithms/sorting/selection-sort' },
  { id: 'insertion-sort', name: 'Insertion Sort', description: 'Build sorted array one element at a time', category: 'sorting', path: '/algorithms/sorting/insertion-sort' },
  { id: 'merge-sort', name: 'Merge Sort', description: 'Divide-and-conquer sorting algorithm', category: 'sorting', path: '/algorithms/sorting/merge-sort' },
  { id: 'quick-sort', name: 'Quick Sort', description: 'Efficient divide-and-conquer sorting', category: 'sorting', path: '/algorithms/sorting/quick-sort' },
  { id: 'heap-sort', name: 'Heap Sort', description: 'Sorting using binary heap data structure', category: 'sorting', path: '/algorithms/sorting/heap-sort' },
  
  // Searching Algorithms
  { id: 'linear-search', name: 'Linear Search', description: 'Sequential search through array', category: 'searching', path: '/algorithms/searching/linear-search' },
  { id: 'binary-search', name: 'Binary Search', description: 'Efficient search in sorted array', category: 'searching', path: '/algorithms/searching/binary-search' },
  
  // Graph Algorithms
  { id: 'bfs-algo', name: 'BFS Algorithm', description: 'Breadth-first traversal algorithm', category: 'graph', path: '/algorithms/graph/bfs' },
  { id: 'dfs-algo', name: 'DFS Algorithm', description: 'Depth-first traversal algorithm', category: 'graph', path: '/algorithms/graph/dfs' },
  { id: 'dijkstra', name: 'Dijkstra Algorithm', description: 'Shortest path algorithm', category: 'graph', path: '/algorithms/graph/dijkstra' }
];

const Algorithms: React.FC = () => {
  const navigate = useNavigate();

  const getAlgorithmsByCategory = (category: string) => {
    return algorithms.filter(alg => alg.category === category);
  };

  const handleAlgorithmClick = (path: string) => {
    navigate(path);
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">Algorithm Visualizers</h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
            Choose an algorithm to visualize and understand how it works step by step
          </p>
        </motion.div>

        {/* Algorithm Categories */}
        <div className="space-y-8">
          {/* Sorting Algorithms */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl text-blue-600">Sorting Algorithms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {getAlgorithmsByCategory('sorting').map((algorithm) => (
                  <motion.div
                    key={algorithm.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="h-full cursor-pointer hover:border-primary/50 transition-all duration-300" onClick={() => handleAlgorithmClick(algorithm.path)}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-sm sm:text-base">{algorithm.name}</h3>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">{algorithm.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Searching Algorithms */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl text-green-600">Searching Algorithms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                {getAlgorithmsByCategory('searching').map((algorithm) => (
                  <motion.div
                    key={algorithm.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="h-full cursor-pointer hover:border-primary/50 transition-all duration-300" onClick={() => handleAlgorithmClick(algorithm.path)}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-sm sm:text-base">{algorithm.name}</h3>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">{algorithm.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Graph Algorithms */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl text-purple-600">Graph Algorithms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {getAlgorithmsByCategory('graph').map((algorithm) => (
                  <motion.div
                    key={algorithm.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="h-full cursor-pointer hover:border-primary/50 transition-all duration-300" onClick={() => handleAlgorithmClick(algorithm.path)}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-sm sm:text-base">{algorithm.name}</h3>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">{algorithm.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Algorithms;
