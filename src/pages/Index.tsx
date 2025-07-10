
import React from 'react';
import { Layout } from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Code, Zap, Sparkles, Cpu, Brain, Database, Play, ChevronRight } from 'lucide-react';
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
      description: "Arrays, Linked Lists, Trees, Graphs, Stacks, Queues with interactive operations",
      path: "/data-structures",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "Sorting & Searching",
      description: "Bubble, Quick, Merge, Heap Sort plus Linear and Binary Search algorithms",
      path: "/algorithms",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Brain,
      title: "Graph Algorithms",
      description: "BFS, DFS, and Dijkstra's pathfinding with step-by-step visualization",
      path: "/algorithms",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const whyFeatures = [
    "🎯 Interactive visualizations for every concept",
    "📚 Step-by-step narration and explanations", 
    "🎮 Control animation speed and step through manually",
    "📱 Mobile-friendly and responsive design",
    "🚀 Perfect for interview preparation and learning",
    "💡 Generate examples or create your own data"
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 cyber-grid opacity-30"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full"
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
          <motion.div 
            className="text-center max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-xl border border-primary/30 rounded-full px-4 py-2 mb-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Cpu className="h-4 w-4 text-primary" />
              </motion.div>
              <span className="text-sm font-medium text-primary">
                Interactive Learning Platform
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="heading-xl mb-8 leading-tight"
            >
              <span className="block font-heading">Visualize.</span>
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent font-heading">
                Understand.
              </span>
              <span className="block font-heading">Master Algorithms.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="body-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              The ultimate interactive DSA learning companion. Watch algorithms come to life through 
              stunning animations, step-by-step breakdowns, and hands-on experimentation.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <Link to="/data-structures">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="cyber-button bg-gradient-to-r from-primary to-accent text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl shadow-xl group relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <div className="relative flex items-center gap-3">
                      <Play className="h-5 w-5" />
                      Get Started
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

              <Link to="/guide">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline" 
                    className="cyber-button bg-transparent border-2 border-primary/50 text-primary px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-xl hover:bg-primary/10"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5" />
                      Learn How to Use
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
              Explore interactive visualizations for data structures and algorithms
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
                className="cyber-card group cursor-pointer"
              >
                <Link to={feature.path} className="block">
                  <motion.div 
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="font-heading font-semibold text-xl mb-4 text-center group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-center leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center justify-center text-primary group-hover:translate-x-2 transition-transform duration-300">
                    <span className="text-sm font-medium">Explore</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why AlgoViz Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-lg mb-6 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Why Choose AlgoViz?
            </h2>
          </motion.div>
          
          <motion.div 
            className="max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {whyFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start gap-4 p-6 cyber-card hover:border-primary/40"
                >
                  <div className="text-2xl">
                    {feature.split(' ')[0]}
                  </div>
                  <p className="text-foreground font-medium">
                    {feature.substring(feature.indexOf(' ') + 1)}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
