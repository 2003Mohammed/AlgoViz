
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTheme } from './hooks/useTheme';
import { Toaster } from './components/ui/toaster';

// Page imports
import Index from './pages/Index';
import VisualizerPage from './pages/VisualizerPage';
import DataStructuresPage from './pages/DataStructuresPage';
import LearnPage from './pages/LearnPage';

// Data Structure imports
import { DataStructureVisualizer } from './components/data-structure-visualizer';
import { dataStructures } from './utils/dataStructureData';

const queryClient = new QueryClient();

function App() {
  const { theme } = useTheme();

  console.log('App rendering, theme:', theme);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className={`min-h-screen transition-colors duration-300 ${
          theme === 'dark' 
            ? 'bg-gray-900 text-white' 
            : 'bg-gray-50 text-gray-900'
        }`}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/algorithms" element={<VisualizerPage />} />
            <Route path="/algorithms/:algorithmId" element={<VisualizerPage />} />
            
            <Route path="/data-structures" element={<DataStructuresPage />} />
            {dataStructures.map((ds) => (
              <Route 
                key={ds.id} 
                path={`/data-structures/${ds.id}`} 
                element={<DataStructureVisualizer dataStructure={ds} />} 
              />
            ))}

            <Route path="/guides" element={<LearnPage />} />
            
            {/* Fallback route */}
            <Route path="*" element={<Index />} />
          </Routes>
        </div>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
