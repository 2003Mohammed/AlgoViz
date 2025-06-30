
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
    // Apply theme to document root with enhanced styling
    document.documentElement.className = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    // Enhanced CSS variables for better theming
    if (theme === 'dark') {
      // Navy blue dark theme
      document.documentElement.style.setProperty('--background', '222 47% 11%');
      document.documentElement.style.setProperty('--foreground', '213 31% 91%');
      document.documentElement.style.setProperty('--primary', '210 40% 98%');
      document.documentElement.style.setProperty('--primary-foreground', '222 47% 11%');
      document.documentElement.style.setProperty('--card', '222 84% 5%');
      document.documentElement.style.setProperty('--card-foreground', '213 31% 91%');
      document.documentElement.style.setProperty('--muted', '217 32% 17%');
      document.documentElement.style.setProperty('--muted-foreground', '215 20.2% 65.1%');
    } else {
      // Clean light theme
      document.documentElement.style.setProperty('--background', '0 0% 100%');
      document.documentElement.style.setProperty('--foreground', '224 71.4% 4.1%');
      document.documentElement.style.setProperty('--primary', '220.9 39.3% 11%');
      document.documentElement.style.setProperty('--primary-foreground', '210 20% 98%');
      document.documentElement.style.setProperty('--card', '0 0% 100%');
      document.documentElement.style.setProperty('--card-foreground', '224 71.4% 4.1%');
      document.documentElement.style.setProperty('--muted', '220 14.3% 95.9%');
      document.documentElement.style.setProperty('--muted-foreground', '220 8.9% 46.1%');
    }
  }, [theme]);

  return (
    <Router>
      <div className={`min-h-screen transition-all duration-300 theme-transition ${theme}`}>
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
