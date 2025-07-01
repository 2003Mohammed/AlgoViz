
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import HomePage from './pages/HomePage';
import VisualizerPage from './pages/VisualizerPage';
import DataStructuresPage from './pages/DataStructuresPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/visualizer" element={<VisualizerPage />} />
          <Route path="/visualizer/:algorithmId" element={<VisualizerPage />} />
          <Route path="/data-structures" element={<DataStructuresPage />} />
          <Route path="/data-structures/:structureId" element={<DataStructuresPage />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
