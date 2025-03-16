
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Visualizer } from '../components/Visualizer';
import { AlgorithmGuide } from '../components/visualizer/AlgorithmGuide';
import { algorithms } from '../utils/algorithms';
import { ArrowLeft, ChevronRight, Info, CircuitBoard, Zap, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const VisualizerPage = () => {
  const { algorithmId } = useParams<{ algorithmId?: string }>();
  const navigate = useNavigate();
  const [algorithm, setAlgorithm] = useState(algorithms[0]);
  const [showGuide, setShowGuide] = useState(true);
  
  useEffect(() => {
    if (algorithmId) {
      const found = algorithms.find(algo => algo.id === algorithmId);
      if (found) {
        setAlgorithm(found);
        // Check if the user has chosen to not see the guide again
        setShowGuide(localStorage.getItem(`algo-guide-${found.id}-completed`) !== 'true');
      } else {
        navigate(`/visualizer/${algorithms[0].id}`, { replace: true });
      }
    } else {
      navigate('/visualizer', { replace: true });
    }
  }, [algorithmId, navigate]);
  
  const handleSkipGuide = (dontShowAgain = false) => {
    setShowGuide(false);
    if (dontShowAgain) {
      localStorage.setItem(`algo-guide-${algorithm.id}-completed`, 'true');
    }
  };
  
  const handleShowGuide = () => {
    setShowGuide(true);
  };
  
  return (
    <Layout>
      <div className="container py-8">
        {algorithmId ? (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <motion.button
                  onClick={() => navigate('/visualizer')}
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  whileHover={{ x: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="mr-1 h-4 w-4" /> Back to Algorithms
                </motion.button>
                <div className="text-muted-foreground">
                  <ChevronRight className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{algorithm.name}</span>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <motion.h1 
                  className="heading-lg pixel-header neon-text"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <CircuitBoard className="inline-block mr-2 h-8 w-8 text-primary" />
                  {algorithm.name}
                </motion.h1>
                <div className="flex items-center gap-4">
                  {!showGuide && (
                    <motion.button
                      onClick={handleShowGuide}
                      className="text-sm text-primary hover:underline flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <BookOpen className="h-4 w-4" />
                      Show Guide
                    </motion.button>
                  )}
                  <motion.div 
                    className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-full"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span>Category: {algorithm.category.charAt(0).toUpperCase() + algorithm.category.slice(1)}</span>
                  </motion.div>
                </div>
              </div>
              
              <motion.p 
                className="mt-2 text-muted-foreground max-w-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {algorithm.description}
              </motion.p>
            </div>
            
            {showGuide ? (
              <AlgorithmGuide algorithm={algorithm} onSkip={handleSkipGuide} />
            ) : (
              <Visualizer algorithm={algorithm} />
            )}
          </>
        ) : (
          <>
            <motion.h1 
              className="heading-lg text-center mb-10 neon-text pixel-header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CircuitBoard className="inline-block mr-2 h-8 w-8 text-primary" />
              Choose an Algorithm to Visualize
            </motion.h1>
            
            <motion.div
              className="glass-card p-8 circuit-pattern"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {algorithms.map((algo, index) => (
                  <motion.div
                    key={algo.id}
                    className="p-4 border-2 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer pixel-border"
                    onClick={() => navigate(`/visualizer/${algo.id}`)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ 
                      scale: 1.03, 
                      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                      y: -5 
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded-md text-primary">
                        <algo.icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-medium">{algo.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {algo.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default VisualizerPage;
