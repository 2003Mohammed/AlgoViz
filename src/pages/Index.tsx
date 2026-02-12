import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { motion } from 'framer-motion';
import { Database, Zap, ArrowRight, Play, Target, Eye, Cpu, Code2, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { AssistantInfo } from '../components/AssistantInfo';

const Index = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const features = [
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Interactive DSA Visualizations",
      description: "Watch data structures and algorithms come to life with real-time animations"
    },
    {
      icon: <Play className="h-8 w-8" />,
      title: "Real-time Animations", 
      description: "Step-by-step visual execution with pause, play, and rewind controls"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Step-by-step Algorithm Tracing",
      description: "Follow every operation with detailed explanations and visual feedback"
    },
    {
      icon: <Cpu className="h-8 w-8" />,
      title: "Dark/Light UI Mode",
      description: "Beautiful themes that adapt to your preference for comfortable learning"
    },
    {
      icon: <Code2 className="h-8 w-8" />,
      title: "User-friendly Examples",
      description: "Learn complex concepts through intuitive, relatable examples"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Educational Content",
      description: "Comprehensive guides and explanations for every concept"
    }
  ];

  const demoHighlights = [
    {
      type: 'sorting',
      title: "Array Sorting",
      description: "Visualize bubble sort, quick sort, and merge sort with color-coded comparisons",
      gradient: "from-[hsl(var(--zady-pink))] to-[hsl(var(--zady-blue))]"
    },
    {
      type: 'trees',
      title: "Binary Trees & BST",
      description: "Build and explore Binary Trees and Binary Search Trees: insert, delete, and traverse (inorder/preorder/postorder)",
      gradient: "from-[hsl(var(--zady-blue))] to-[hsl(var(--zady-accent))]"
    },
    {
      type: 'graph',
      title: "Graph Pathfinding",
      description: "See algorithms find paths with animated node exploration",
      gradient: "from-[hsl(var(--zady-accent))] to-[hsl(var(--zady-pink))]"
    }
  ] as const;

  return (
    <Layout>
      <div className="relative overflow-hidden">
        {/* Floating Animated Shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-r from-[hsl(var(--zady-pink))] to-[hsl(var(--zady-blue))] rounded-full opacity-20 animate-float-shapes"></div>
          <div className="absolute top-40 right-20 w-12 h-12 bg-gradient-to-r from-[hsl(var(--zady-blue))] to-[hsl(var(--zady-accent))] rounded-lg opacity-30 animate-float-shapes" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-40 left-20 w-20 h-20 bg-gradient-to-r from-[hsl(var(--zady-accent))] to-[hsl(var(--zady-pink))] rounded-full opacity-15 animate-float-shapes" style={{ animationDelay: '4s' }}></div>
          <div className="hero-ambient-glow hero-ambient-glow-left" />
          <div className="hero-ambient-glow hero-ambient-glow-right" />
        </div>

        {/* Hero Section */}
        <motion.section 
          className="relative py-20 md:py-32"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="container mx-auto text-center">
            <motion.div
              variants={itemVariants}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  className="hero-badge-wrap"
                  variants={itemVariants}
                >
                  <span className="hero-badge">
                    <Sparkles className="h-3.5 w-3.5" />
                    Interactive learning, made calm and clear
                  </span>
                </motion.div>
                <motion.h1 
                  className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-[hsl(var(--zady-pink))] via-[hsl(var(--zady-blue))] to-[hsl(var(--zady-accent))] bg-clip-text text-transparent leading-tight"
                  variants={itemVariants}
                >
                  Welcome to AlgoViz
                </motion.h1>
                <motion.div
                  className="hero-orbit"
                  aria-hidden="true"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                >
                  <span className="hero-orbit-dot hero-orbit-dot-a" />
                  <span className="hero-orbit-dot hero-orbit-dot-b" />
                </motion.div>
                <motion.p 
                  className="text-xl md:text-2xl text-muted-foreground font-medium"
                  variants={itemVariants}
                >
                  Visualize. Learn. Master.
                </motion.p>
              </div>
              
              <motion.p 
                className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                variants={itemVariants}
              >
                Experience the beauty of algorithms and data structures through interactive visualizations. 
                Watch code come to life with step-by-step animations that make complex concepts crystal clear.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Button asChild size="lg" className="pixel-button animate-zady-glow">
                  <Link to="/data-structures">
                    <Database className="mr-2 h-5 w-5" />
                    Explore Structures
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="pixel-button">
                  <Link to="/algorithms">
                    <Zap className="mr-2 h-5 w-5" />
                    View Algorithms
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        <AssistantInfo />

        {/* Features Section */}
        <motion.section 
          className="py-20 bg-gradient-to-b from-transparent to-muted/30"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="container mx-auto">
            <motion.div className="text-center mb-16" variants={itemVariants}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose AlgoViz?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Learning algorithms doesn't have to be boring. Our platform makes complex concepts 
                accessible through beautiful, interactive visualizations.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="zady-card p-6"
                >
                  <div className="text-[hsl(var(--zady-blue))] mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Quote Section */}
        <motion.section
          className="py-16 bg-gradient-to-r from-muted/50 to-transparent"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="container mx-auto text-center">
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-bold pixel-text mb-4">
                  "Learning algorithms is like learning to see the matrix of code"
                </h2>
                <p className="text-lg text-muted-foreground">
                  Transform complex concepts into visual understanding through interactive exploration
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <div className="zady-card p-4">
                  <h3 className="font-bold text-lg mb-2">💡 Pro Tip</h3>
                  <p className="text-sm text-muted-foreground">Start with simpler data structures like arrays and stacks before moving to trees and graphs</p>
                </div>
                <div className="zady-card p-4">
                  <h3 className="font-bold text-lg mb-2">🎯 Focus</h3>
                  <p className="text-sm text-muted-foreground">Watch how each step affects the overall structure - patterns will emerge naturally</p>
                </div>
                <div className="zady-card p-4">
                  <h3 className="font-bold text-lg mb-2">🚀 Practice</h3>
                  <p className="text-sm text-muted-foreground">Use different input sizes to see how time complexity affects real performance</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Live Demo Highlights */}
        <motion.section 
          className="py-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="container mx-auto">
            <motion.div className="text-center mb-16" variants={itemVariants}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 pixel-text">
                See It In Action
              </h2>
              <p className="text-lg text-muted-foreground">
                Get a taste of what makes our visualizations special
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {demoHighlights.map((demo, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -6 }}
                  className="relative group"
                >
                  <Card className="zady-card overflow-hidden demo-highlight-card">
                    <div className={`h-32 bg-gradient-to-r ${demo.gradient} relative overflow-hidden demo-highlight-media`}>
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="demo-highlight-shine" aria-hidden="true" />

                      {demo.type === 'sorting' && (
                        <div className="absolute inset-x-4 bottom-4 flex items-end gap-1 h-16">
                          {[18, 34, 24, 40, 28, 46, 30, 36].map((height, i) => (
                            <div
                              key={`sort-${i}`}
                              className="assistant-demo-sort-bar"
                              style={{ height: `${height}px`, animationDelay: `${i * 0.15}s` }}
                            />
                          ))}
                        </div>
                      )}

                      {demo.type === 'trees' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="assistant-demo-tree-wrap">
                            {[0, 1, 2, 3, 4, 5, 6].map((node, i) => (
                              <span key={`tree-${node}`} className="assistant-demo-tree-node" style={{ animationDelay: `${i * 0.25}s` }} />
                            ))}
                          </div>
                        </div>
                      )}

                      {demo.type === 'graph' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="assistant-demo-graph-wrap">
                            {[0, 1, 2, 3, 4].map((node, i) => (
                              <span key={`graph-${node}`} className="assistant-demo-graph-node" style={{ animationDelay: `${i * 0.2}s` }} />
                            ))}
                            <span className="assistant-demo-graph-path" />
                          </div>
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg demo-highlight-title">{demo.title}</CardTitle>
                      <CardDescription className="demo-highlight-description">{demo.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="py-20 bg-gradient-to-r from-[hsl(var(--zady-pink))] via-[hsl(var(--zady-blue))] to-[hsl(var(--zady-accent))]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="container mx-auto text-center">
            <motion.div variants={itemVariants} className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Ready to Master Algorithms?
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Join thousands of developers who've transformed their understanding of computer science fundamentals
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button asChild size="lg" variant="secondary">
                    <Link to="/data-structures">
                      <Database className="mr-2 h-5 w-5" />
                      Explore Data Structures
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                    <Link to="/algorithms">
                      <Zap className="mr-2 h-5 w-5" />
                      View Algorithms
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </Layout>
  );
};

export default Index;
