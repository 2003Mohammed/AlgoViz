
import React, { Suspense, lazy } from 'react';
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';

// Lazy-loaded main pages
const Index = lazy(() => import('./pages/Index'));
const Algorithms = lazy(() => import('./pages/Algorithms'));
const DataStructures = lazy(() => import('./pages/DataStructures'));
const Guide = lazy(() => import('./pages/Guide'));
const BuyMeACoffeePage = lazy(() => import('./pages/BuyMeACoffeePage'));

// Lazy-loaded data structure pages
const ArrayVisualizerPage = lazy(() => import('./pages/data-structures/ArrayVisualizerPage'));
const StackVisualizerPage = lazy(() => import('./pages/data-structures/StackVisualizerPage'));
const QueueVisualizerPage = lazy(() => import('./pages/data-structures/QueueVisualizerPage'));
const LinkedListVisualizerPage = lazy(() => import('./pages/data-structures/LinkedListVisualizerPage'));
const TreeVisualizerPage = lazy(() => import('./pages/data-structures/TreeVisualizerPage'));
const GraphVisualizerPage = lazy(() => import('./pages/data-structures/GraphVisualizerPage'));

// Lazy-loaded algorithm pages - Sorting
const BubbleSortPage = lazy(() => import('./pages/algorithms/sorting/BubbleSortPage'));
const SelectionSortPage = lazy(() => import('./pages/algorithms/sorting/SelectionSortPage'));
const InsertionSortPage = lazy(() => import('./pages/algorithms/sorting/InsertionSortPage'));
const MergeSortPage = lazy(() => import('./pages/algorithms/sorting/MergeSortPage'));
const QuickSortPage = lazy(() => import('./pages/algorithms/sorting/QuickSortPage'));
const HeapSortPage = lazy(() => import('./pages/algorithms/sorting/HeapSortPage'));

// Lazy-loaded algorithm pages - Searching
const LinearSearchPage = lazy(() => import('./pages/algorithms/searching/LinearSearchPage'));
const BinarySearchPage = lazy(() => import('./pages/algorithms/searching/BinarySearchPage'));

// Lazy-loaded algorithm pages - Graph
const BFSPage = lazy(() => import('./pages/algorithms/graph/BFSPage'));
const DFSPage = lazy(() => import('./pages/algorithms/graph/DFSPage'));
const DijkstraPage = lazy(() => import('./pages/algorithms/graph/DijkstraPage'));
const AStarPage = lazy(() => import('./pages/algorithms/graph/AStarPage'));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background theme-transition">
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>}>
            <Routes>
              {/* Main pages */}
              <Route path="/" element={<Index />} />
              <Route path="/algorithms" element={<Algorithms />} />
              <Route path="/data-structures" element={<DataStructures />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/buy-me-a-coffee" element={<BuyMeACoffeePage />} />

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
              <Route path="/algorithms/graph/astar" element={<AStarPage />} />
            </Routes>
          </Suspense>
        </div>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
