
import React from 'react';
import { Layout } from '../components/Layout';
import { Hero } from '../components/Hero';
import { AlgorithmGrid } from '../components/AlgorithmGrid';
import { DataStructureGrid } from '../components/DataStructureGrid';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Code, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <Layout>
      <Hero />
      
      {/* Site Introduction Section */}
      <section className="container py-16 bg-gradient-to-br from-background to-secondary/20">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-primary/10 rounded-full">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="heading-lg mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Interactive Data Structures & Algorithms Visualizer
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            This site offers interactive visualizations for core data structures and algorithms. 
            Perfect for students, developers, and interview preparation. Learn through visual 
            exploration and step-by-step animations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <motion.div 
              className="p-6 rounded-lg bg-card border hover:shadow-lg transition-all duration-300"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Code className="h-8 w-8 text-blue-500 mb-4 mx-auto" />
              <h3 className="font-semibold mb-2">Visual Learning</h3>
              <p className="text-sm text-muted-foreground">
                See algorithms in action with step-by-step animations
              </p>
            </motion.div>
            
            <motion.div 
              className="p-6 rounded-lg bg-card border hover:shadow-lg transition-all duration-300"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Zap className="h-8 w-8 text-yellow-500 mb-4 mx-auto" />
              <h3 className="font-semibold mb-2">Interactive Controls</h3>
              <p className="text-sm text-muted-foreground">
                Control speed, step through algorithms, and experiment
              </p>
            </motion.div>
            
            <motion.div 
              className="p-6 rounded-lg bg-card border hover:shadow-lg transition-all duration-300"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <BookOpen className="h-8 w-8 text-green-500 mb-4 mx-auto" />
              <h3 className="font-semibold mb-2">Interview Prep</h3>
              <p className="text-sm text-muted-foreground">
                Master algorithms commonly asked in technical interviews
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>
      
      <section className="container py-20">
        <h2 className="heading-lg text-center mb-10">
          Explore Algorithms
        </h2>
        <div className="mb-6">
          <AlgorithmGrid />
        </div>
        <div className="flex justify-center mt-8">
          <Link to="/visualizer">
            <Button className="flex items-center gap-2">
              View All Algorithms
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
      
      <section className="container py-20 bg-secondary/10">
        <h2 className="heading-lg text-center mb-10">
          Explore Data Structures
        </h2>
        <div className="mb-6">
          <DataStructureGrid />
        </div>
        <div className="flex justify-center mt-8">
          <Link to="/data-structures">
            <Button variant="outline" className="flex items-center gap-2">
              View All Data Structures
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
