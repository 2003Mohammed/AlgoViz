
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import VisualizerPage from './pages/VisualizerPage';
import DataStructuresPage from './pages/DataStructuresPage';
import { Toaster } from '@/components/ui/toaster';
import { useTheme } from './hooks/useTheme';
import { useEffect } from 'react';

function App() {
  const { theme } = useTheme();
  
  useEffect(() => {
    // Apply theme to document root
    document.documentElement.className = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update CSS variables for consistent theming
    if (theme === 'dark') {
      document.documentElement.style.setProperty('--background', '222.2% 84% 4.9%');
      document.documentElement.style.setProperty('--foreground', '210% 40% 98%');
      document.documentElement.style.setProperty('--primary', '210% 40% 98%');
      document.documentElement.style.setProperty('--primary-foreground', '222.2% 84% 4.9%');
    } else {
      document.documentElement.style.setProperty('--background', '0 0% 100%');
      document.documentElement.style.setProperty('--foreground', '222.2% 84% 4.9%');
      document.documentElement.style.setProperty('--primary', '222.2% 47.4% 11.2%');
      document.documentElement.style.setProperty('--primary-foreground', '210% 40% 98%');
    }
  }, [theme]);

  return (
    <Router>
      <div className={`min-h-screen transition-all duration-300 ${theme}`}>
        <Routes>
          <Route path="/" element={<Index />} />
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
