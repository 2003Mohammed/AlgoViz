
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, Zap, BookOpen, Code, Brain, Cpu, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Hero: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentAlgorithm, setCurrentAlgorithm] = useState(0);
  
  const algorithms = [
    { name: "Bubble Sort", color: "from-neon-blue to-neon-purple" },
    { name: "Quick Sort", color: "from-neon-purple to-neon-pink" },
    { name: "Binary Search", color: "from-neon-pink to-neon-blue" },
    { name: "DFS Traversal", color: "from-neon-green to-neon-blue" },
    { name: "Dijkstra's Path", color: "from-neon-yellow to-neon-green" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAlgorithm((prev) => (prev + 1) % algorithms.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleExportDemo = () => {
    // Demo export functionality
    const demoData = {
      algorithm: "bubble-sort",
      array: [64, 34, 25, 12, 22, 11, 90],
      steps: 15,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(demoData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dsa-visualization-demo.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // AI Loading Animation Component
  const AILoadingAnimation = () => (
    <motion.div 
      className="fixed inset-0 z-50 bg-cyber-dark flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <motion.div
          className="relative w-24 h-24 mx-auto mb-8"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 border-4 border-cyber-primary/30 rounded-full"></div>
          <div className="absolute inset-2 border-4 border-cyber-secondary rounded-full border-t-transparent animate-spin"></div>
          <motion.div 
            className="absolute inset-4 bg-gradient-to-r from-cyber-primary to-cyber-secondary rounded-full flex items-center justify-center"
            animate={{ 
              boxShadow: [
                "0 0 20px rgba(0, 243, 255, 0.5)",
                "0 0 40px rgba(255, 0, 160, 0.7)",
                "0 0 20px rgba(0, 243, 255, 0.5)"
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Brain className="h-8 w-8 text-white" />
          </motion.div>
        </motion.div>
        
        <motion.h2 
          className="text-2xl font-bold text-cyber-primary mb-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Initializing AI Visualizer
        </motion.h2>
        
        <motion.div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-cyber-primary rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <>
      <AnimatePresence>
        {isLoading && <AILoadingAnimation />}
      </AnimatePresence>
      
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 cyber-grid opacity-40"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyber-primary rounded-full"
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>
        
        <div className="container relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* AI Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyber-primary/20 to-cyber-secondary/20 backdrop-blur-xl border border-cyber-primary/30 rounded-full px-4 py-2 mb-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Cpu className="h-4 w-4 text-cyber-primary" />
              </motion.div>
              <span className="text-sm font-medium text-cyber-primary">
                AI-Powered Learning Platform
              </span>
              <motion.div 
                className="w-2 h-2 bg-neon-green rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="heading-xl mb-8 leading-tight"
            >
              <span className="block font-heading">Master</span>
              <motion.span 
                className="block bg-gradient-to-r from-cyber-primary via-cyber-secondary to-cyber-tertiary bg-clip-text text-transparent font-heading"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ backgroundSize: '200% 200%' }}
              >
                Data Structures & Algorithms
              </motion.span>
              <span className="block font-heading">Through Interactive Visualization</span>
            </motion.h1>

            {/* Dynamic Algorithm Display */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-lg text-muted-foreground mb-4">
                Currently visualizing:
              </p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentAlgorithm}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className={`inline-block text-2xl font-bold bg-gradient-to-r ${algorithms[currentAlgorithm].color} bg-clip-text text-transparent`}
                >
                  {algorithms[currentAlgorithm].name}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="body-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Experience the future of algorithm learning with our next-generation interactive visualizer. 
              Watch algorithms come to life through stunning animations, step-by-step breakdowns, and 
              hands-on experimentation. Perfect for students, developers, and interview preparation.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Link to="/visualizer">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="cyber-button bg-gradient-to-r from-cyber-primary to-cyber-secondary text-white px-8 py-4 text-lg font-semibold rounded-xl border-0 shadow-xl group relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyber-secondary to-cyber-tertiary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <div className="relative flex items-center gap-3">
                      <Play className="h-5 w-5" />
                      Start Visualizing
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="h-5 w-5" />
                      </motion.div>
                    </div>
                  </Button>
                </motion.div>
              </Link>

              <Link to="/data-structures">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline" 
                    className="cyber-button bg-transparent border-2 border-cyber-primary/50 text-cyber-primary px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-xl hover:bg-cyber-primary/10 group"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5" />
                      Explore Data Structures
                    </div>
                  </Button>
                </motion.div>
              </Link>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="ghost" 
                  onClick={handleExportDemo}
                  className="text-muted-foreground hover:text-cyber-primary border border-muted/20 hover:border-cyber-primary/50 px-6 py-4 rounded-xl group"
                >
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Demo
                  </div>
                </Button>
              </motion.div>
            </motion.div>

            {/* Feature Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              {[
                { icon: Zap, title: "Real-time Visualization", desc: "Watch algorithms execute step-by-step" },
                { icon: Code, title: "Interactive Controls", desc: "Control speed, step through, and experiment" },
                { icon: Brain, title: "AI-Enhanced Learning", desc: "Smart explanations and guided tutorials" }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="cyber-card p-6 text-center group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                >
                  <motion.div 
                    className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-cyber-primary/20 to-cyber-secondary/20 flex items-center justify-center group-hover:from-cyber-primary/30 group-hover:to-cyber-secondary/30 transition-all duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="h-6 w-6 text-cyber-primary" />
                  </motion.div>
                  <h3 className="font-semibold text-sm mb-2 text-foreground group-hover:text-cyber-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};
