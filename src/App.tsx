import React from 'react';
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';

// Import pages
import Home from './pages/Home';
import Algorithms from './pages/Algorithms';
import DataStructures from './pages/DataStructures';
import Guides from './pages/Guides';
import { AlgorithmGuide } from './components/guides/AlgorithmGuide';
import ArrayVisualizer from './components/visualizers/ArrayVisualizer';
import LinkedListVisualizer from './components/visualizers/LinkedListVisualizer';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/algorithms" element={<Algorithms />} />
            <Route path="/data-structures" element={<DataStructures />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/visualizers/array" element={<ArrayVisualizer />} />
            <Route path="/visualizers/linked-list" element={<LinkedListVisualizer />} />
            <Route path="/guides/:algorithmId" element={<AlgorithmGuide algorithmId="bubble-sort" />} />
          </Routes>
        </div>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
