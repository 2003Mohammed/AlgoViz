
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, BookOpen, Code } from 'lucide-react';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />
      
      <div className="container relative">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full">
                <Code className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Learn Data Structures & Algorithms</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Visualize
              </span>
              <br />
              <span className="text-foreground">
                Algorithms
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Master data structures and algorithms through interactive visualizations. 
              See how sorting, searching, and data manipulation works step by step.
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/visualizer">
              <Button size="lg" className="flex items-center gap-2 px-8 py-6 text-lg">
                <Play className="h-5 w-5" />
                Start Visualizing
              </Button>
            </Link>
            
            <Link to="/data-structures">
              <Button variant="outline" size="lg" className="flex items-center gap-2 px-8 py-6 text-lg">
                <BookOpen className="h-5 w-5" />
                Explore Data Structures
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div>
              <div className="text-2xl font-bold text-primary">15+</div>
              <div className="text-sm text-muted-foreground">Algorithms</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">8+</div>
              <div className="text-sm text-muted-foreground">Data Structures</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Free</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">∞</div>
              <div className="text-sm text-muted-foreground">Learning</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
