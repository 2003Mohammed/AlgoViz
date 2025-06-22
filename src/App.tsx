
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import VisualizerPage from './pages/VisualizerPage';
import DataStructuresPage from './pages/DataStructuresPage';
import PlaygroundPage from './pages/PlaygroundPage';
import { Toaster } from '@/components/ui/toaster';
import { useTheme } from './hooks/useTheme';
import { useEffect } from 'react';

function App() {
  const { theme } = useTheme();
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Router>
      <div className={`min-h-screen bg-background text-foreground ${theme}`}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/visualizer" element={<VisualizerPage />} />
          <Route path="/visualizer/:algorithmId" element={<VisualizerPage />} />
          <Route path="/data-structures" element={<DataStructuresPage />} />
          <Route path="/data-structures/:structureId" element={<DataStructuresPage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
