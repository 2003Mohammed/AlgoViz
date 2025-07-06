
import React from 'react';
import { Layout } from '../components/Layout';
import { AlgorithmGrid } from '../components/AlgorithmGrid';
import { DataStructureGrid } from '../components/DataStructureGrid';
import { motion } from 'framer-motion';
import { Database, Zap } from 'lucide-react';

const HomePage = () => {
  return (
    <Layout>
      <div className="container py-8">
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="heading-lg text-center mb-4 neon-text pixel-header">
            Algorithm & Data Structure Visualizer
          </h1>
          <p className="text-center text-muted-foreground text-lg max-w-3xl mx-auto">
            Interactive visualizations to understand algorithms and data structures
          </p>
        </motion.section>

        <motion.section 
          className="mb-16" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            Algorithm Visualizations
          </h2>
          <AlgorithmGrid />
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            Data Structure Visualizations
          </h2>
          <DataStructureGrid />
        </motion.section>
      </div>
    </Layout>
  );
};

export default HomePage;
