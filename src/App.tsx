import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Algorithms } from './pages/Algorithms';
import { DataStructures } from './pages/DataStructures';
import { Guides } from './pages/Guides';
import { AlgorithmGuide } from './components/guides/AlgorithmGuide';
import { useTheme } from './hooks/useTheme';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeSwitcher } from './components/ThemeSwitcher';
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
            <Route path="/" element={<Home />} />
            <Route path="/algorithms" element={<Algorithms />} />
            
            <Route path="/data-structures" element={<DataStructures />} />
            {dataStructures.map((ds) => (
              <Route 
                key={ds.id} 
                path={`/data-structures/${ds.id}`} 
                element={<DataStructureVisualizer dataStructure={ds} />} 
              />
            ))}

            <Route path="/guides" element={<Guides />} />
            <Route path="/guides/:algorithmId" element={<AlgorithmGuide />} />
            <Route path="/visualizer/array" element={<ArrayVisualizerPage />} />
            <Route path="/visualizer/binary-search" element={<BinarySearchPage />} />
          </Routes>
        </Layout>
      </div>
    </QueryClientProvider>
  );
}

export default App;
