
import React from 'react';
import { Layout } from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Database, Zap, Brain, Play, Eye, MousePointer, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const features = [
    {
      icon: Database,
      title: "Visual Data Structures",
      description: "Interactive arrays, trees, graphs, stacks and queues with real-time manipulation"
    },
    {
      icon: Zap,
      title: "Interactive Algorithms",
      description: "Step-by-step sorting and searching algorithms with color-coded visualization"
    },
    {
      icon: Brain,
      title: "Real-time Animations",
      description: "Watch BFS, DFS, and Dijkstra's algorithm solve problems in real-time"
    },
    {
      icon: Sparkles,
      title: "Educational Narration",
      description: "Follow along with detailed explanations and complexity analysis"
    }
  ];

  const demos = [
    {
      title: "Array Sorting",
      description: "Visualize bubble, merge, and quick sort algorithms",
      gradient: "from-blue-500/20 to-purple-500/20"
    },
    {
      title: "Tree Traversal",
      description: "Explore binary trees with interactive node operations",
      gradient: "from-green-500/20 to-teal-500/20"
    },
    {
      title: "Graph Pathfinding",
      description: "Watch Dijkstra find the shortest path dynamically",
      gradient: "from-orange-500/20 to-red-500/20"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 cyber-grid opacity-20"></div>
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <div className="container relative z-10">
          <motion.div 
            className="text-center max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Main Headlines */}
            <motion.div variants={itemVariants} className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
                  AlgoViz
                </span>
                <span className="block text-3xl md:text-4xl mt-4 text-muted-foreground font-medium">
                  Visualize. Learn. Master DSA.
                </span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Interactive animations of data structures & algorithms made for humans
            </motion.p>

            {/* CTA Button */}
            <motion.div
              variants={itemVariants}
              className="mb-20"
            >
              <Link to="/data-structures">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-block"
                >
                  <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-12 py-6 text-xl font-semibold rounded-2xl shadow-2xl hover:shadow-primary/25 transition-all duration-300 group">
                    <Play className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                    Get Started
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background"></div>
        
        <div className="container relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Everything You Need to Master DSA
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Interactive visualizations designed to make complex concepts simple and engaging
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="cyber-card group cursor-pointer"
              >
                <motion.div 
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: 5 }}
                >
                  <feature.icon className="h-8 w-8 text-primary" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-center leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo Highlights */}
      <section className="py-32 relative">
        <div className="container">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              See Algorithms in Action
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the beauty of algorithms through interactive visual demonstrations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {demos.map((demo, index) => (
              <motion.div
                key={demo.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${demo.gradient} border border-border/40 p-8 backdrop-blur-xl group cursor-pointer`}
              >
                <div className="relative z-10">
                  <h3 className="text-2xl font-semibold mb-4">{demo.title}</h3>
                  <p className="text-muted-foreground mb-6">{demo.description}</p>
                  
                  {/* Mock visualization preview */}
                  <div className="h-20 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg flex items-center justify-center border border-primary/20">
                    <div className="flex space-x-2">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-4 h-8 bg-gradient-to-t from-primary to-accent rounded"
                          animate={{ 
                            height: [32, 16, 24, 40, 28][i],
                            opacity: [0.5, 1, 0.7, 0.9, 0.6]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity, 
                            delay: i * 0.2,
                            repeatType: "reverse"
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    background: [
                      'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.1) 50%, transparent 100%)',
                      'linear-gradient(90deg, transparent 100%, rgba(59,130,246,0.1) 150%, transparent 200%)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 relative">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Learning?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join thousands of students mastering data structures and algorithms through visualization
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/data-structures">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl shadow-xl">
                    <Database className="mr-2 h-5 w-5" />
                    Explore Data Structures
                  </Button>
                </motion.div>
              </Link>
              
              <Link to="/algorithms">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" className="px-8 py-4 text-lg font-semibold rounded-xl border-primary/30 hover:bg-primary/10">
                    <Zap className="mr-2 h-5 w-5" />
                    View Algorithms
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
