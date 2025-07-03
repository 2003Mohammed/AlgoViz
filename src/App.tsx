
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
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

function App() {
  const { theme } = useTheme();

  return (
    <QueryClientProvider client={new QueryClient()}>
      <div className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gray-900 text-white' 
          : 'bg-gray-50 text-gray-900'
      }`}>
        <Layout>
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
        </Layout>
      </div>
    </QueryClientProvider>
  );
}

export default App;
