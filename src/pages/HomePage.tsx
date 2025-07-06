
import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/button';
import { ArrowRight, Monitor, Database, BookOpen, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  console.log('HomePage rendering');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AlgoViz
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Interactive Data Structures & Algorithms Visualizer
          </p>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Learn algorithms and data structures through beautiful visualizations, 
            step-by-step animations, and hands-on interaction.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/visualizer/array">
              <Button className="px-8 py-3 text-lg">
                Start Visualizing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/algorithms">
              <Button variant="outline" className="px-8 py-3 text-lg">
                Browse Algorithms
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-card rounded-lg p-6 shadow-lg border">
            <Monitor className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Interactive Algorithms</h3>
            <p className="text-muted-foreground">
              Watch sorting, searching, and graph algorithms come to life with real-time animations.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-lg border">
            <Database className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Data Structures</h3>
            <p className="text-muted-foreground">
              Explore stacks, queues, trees, graphs, and more with interactive operations.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-lg border">
            <BookOpen className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Learn by Doing</h3>
            <p className="text-muted-foreground">
              Step through algorithms at your own pace and experiment with different inputs.
            </p>
          </div>
        </motion.div>

        {/* Quick Access */}
        <motion.div 
          className="bg-card rounded-lg p-8 shadow-lg border"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-center mb-8">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/visualizer/array" className="block">
              <Button variant="outline" className="w-full p-4 h-auto flex flex-col">
                <Zap className="h-6 w-6 mb-2" />
                Array Visualizer
              </Button>
            </Link>
            <Link to="/visualizer/binary-search" className="block">
              <Button variant="outline" className="w-full p-4 h-auto flex flex-col">
                <Zap className="h-6 w-6 mb-2" />
                Binary Search
              </Button>
            </Link>
            <Link to="/data-structures" className="block">
              <Button variant="outline" className="w-full p-4 h-auto flex flex-col">
                <Database className="h-6 w-6 mb-2" />
                Data Structures
              </Button>
            </Link>
            <Link to="/algorithms" className="block">
              <Button variant="outline" className="w-full p-4 h-auto flex flex-col">
                <Monitor className="h-6 w-6 mb-2" />
                Algorithms
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default HomePage;
