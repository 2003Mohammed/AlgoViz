
import React from 'react';
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';

// Import main pages
import Index from './pages/Index';
import Algorithms from './pages/Algorithms';
import DataStructures from './pages/DataStructures';
import Guide from './pages/Guide';

// Import individual data structure pages
import ArrayVisualizerPage from './pages/data-structures/ArrayVisualizerPage';
import StackVisualizerPage from './pages/data-structures/StackVisualizerPage';
import QueueVisualizerPage from './pages/data-structures/QueueVisualizerPage';
import LinkedListVisualizerPage from './pages/data-structures/LinkedListVisualizerPage';
import TreeVisualizerPage from './pages/data-structures/TreeVisualizerPage';
import GraphVisualizerPage from './pages/data-structures/GraphVisualizerPage';

// Import individual algorithm pages - Sorting
import BubbleSortPage from './pages/algorithms/sorting/BubbleSortPage';
import SelectionSortPage from './pages/algorithms/sorting/SelectionSortPage';
import InsertionSortPage from './pages/algorithms/sorting/InsertionSortPage';
import MergeSortPage from './pages/algorithms/sorting/MergeSortPage';
import QuickSortPage from './pages/algorithms/sorting/QuickSortPage';
import HeapSortPage from './pages/algorithms/sorting/HeapSortPage';

// Import individual algorithm pages - Searching
import LinearSearchPage from './pages/algorithms/searching/LinearSearchPage';
import BinarySearchPage from './pages/algorithms/searching/BinarySearchPage';

// Import individual algorithm pages - Graph
import BFSPage from './pages/algorithms/graph/BFSPage';
import DFSPage from './pages/algorithms/graph/DFSPage';
import DijkstraPage from './pages/algorithms/graph/DijkstraPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background theme-transition">
          <Routes>
            {/* Main pages */}
            <Route path="/" element={<Index />} />
            <Route path="/algorithms" element={<Algorithms />} />
            <Route path="/data-structures" element={<DataStructures />} />
            <Route path="/guide" element={<Guide />} />

            {/* Data Structure pages */}
            <Route path="/data-structures/array" element={<ArrayVisualizerPage />} />
            <Route path="/data-structures/stack" element={<StackVisualizerPage />} />
            <Route path="/data-structures/queue" element={<QueueVisualizerPage />} />
            <Route path="/data-structures/linked-list" element={<LinkedListVisualizerPage />} />
            <Route path="/data-structures/tree" element={<TreeVisualizerPage />} />
            <Route path="/data-structures/graph" element={<GraphVisualizerPage />} />

            {/* Algorithm pages - Sorting */}
            <Route path="/algorithms/sorting/bubble-sort" element={<BubbleSortPage />} />
            <Route path="/algorithms/sorting/selection-sort" element={<SelectionSortPage />} />
            <Route path="/algorithms/sorting/insertion-sort" element={<InsertionSortPage />} />
            <Route path="/algorithms/sorting/merge-sort" element={<MergeSortPage />} />
            <Route path="/algorithms/sorting/quick-sort" element={<QuickSortPage />} />
            <Route path="/algorithms/sorting/heap-sort" element={<HeapSortPage />} />

            {/* Algorithm pages - Searching */}
            <Route path="/algorithms/searching/linear-search" element={<LinearSearchPage />} />
            <Route path="/algorithms/searching/binary-search" element={<BinarySearchPage />} />

            {/* Algorithm pages - Graph */}
            <Route path="/algorithms/graph/bfs" element={<BFSPage />} />
            <Route path="/algorithms/graph/dfs" element={<DFSPage />} />
            <Route path="/algorithms/graph/dijkstra" element={<DijkstraPage />} />
          </Routes>
        </div>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
