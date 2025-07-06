
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import HomePage from './pages/HomePage';
import VisualizerPage from './pages/VisualizerPage';
import DataStructuresPage from './pages/DataStructuresPage';
import LearnPage from './pages/LearnPage';
import { useTheme } from './hooks/useTheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DataStructureVisualizer } from './components/data-structure-visualizer/DataStructureVisualizer';
import { dataStructures } from './utils/dataStructureData';
import { BinarySearchPage } from './pages/BinarySearchPage';
import { ArrayVisualizerPage } from './pages/ArrayVisualizerPage';

const queryClient = new QueryClient();

function App() {
  const { theme } = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className={`min-h-screen transition-colors duration-300 ${
          theme === 'dark' 
            ? 'bg-gray-900 text-white' 
            : 'bg-gray-50 text-gray-900'
        }`}>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/algorithms" element={<VisualizerPage />} />
                
                <Route path="/data-structures" element={<DataStructuresPage />} />
                {dataStructures.map((ds) => (
                  <Route 
                    key={ds.id} 
                    path={`/data-structures/${ds.id}`} 
                    element={<DataStructureVisualizer dataStructure={ds} />} 
                  />
                ))}

                <Route path="/guides" element={<LearnPage />} />
                <Route path="/visualizer/array" element={<ArrayVisualizerPage />} />
                <Route path="/visualizer/binary-search" element={<BinarySearchPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
