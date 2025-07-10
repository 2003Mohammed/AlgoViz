
import React from 'react';
import { Layout } from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Database, Zap, Brain, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const features = [
    {
      icon: Database,
      title: "Data Structures",
      description: "Arrays, Linked Lists, Trees, Graphs with interactive operations"
    },
    {
      icon: Zap,
      title: "Sorting & Searching",
      description: "Bubble, Quick, Merge Sort plus Linear and Binary Search algorithms"
    },
    {
      icon: Brain,
      title: "Graph Algorithms",
      description: "BFS, DFS, and Dijkstra's pathfinding with step-by-step visualization"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 cyber-grid opacity-30"></div>
        
        <div className="container relative z-10">
          <motion.div 
            className="text-center max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="heading-xl mb-8 leading-tight"
            >
              <span className="block font-heading">AlgoViz</span>
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-heading">
                Visualize. Learn. Master DSA.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="body-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Explore interactive visualizations of algorithms and data structures with 
              step-by-step animations, detailed explanations, and hands-on experimentation.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center mb-16"
            >
              <Link to="/data-structures">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="cyber-button bg-gradient-to-r from-primary to-accent text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl shadow-xl group relative overflow-hidden">
                    <div className="relative flex items-center gap-3">
                      <Play className="h-5 w-5" />
                      Get Started
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container relative z-10">
          <motion.div 
            className="text-center max-w-4xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-lg mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Master Every Concept
            </h2>
            <p className="body-lg text-muted-foreground">
              Interactive visualizations for data structures and algorithms
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="cyber-card group"
              >
                <motion.div 
                  className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300"
                >
                  <feature.icon className="h-8 w-8 text-primary" />
                </motion.div>
                <h3 className="font-heading font-semibold text-xl mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-center leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
