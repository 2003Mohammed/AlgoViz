
import React from 'react';
import { Layout } from '../components/Layout';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Play, 
  MousePointer, 
  Eye, 
  Database, 
  Zap, 
  Brain,
  Github,
  Mail,
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react';

const Guide = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const steps = [
    {
      number: "01",
      icon: MousePointer,
      title: "Navigate & Choose",
      description: "Select either Data Structures or Algorithms from the main navigation",
      color: "from-blue-500 to-cyan-500"
    },
    {
      number: "02",
      icon: Database,
      title: "Pick Your Topic",
      description: "Choose a specific concept like Arrays, Trees, Bubble Sort, or Graph algorithms",
      color: "from-purple-500 to-pink-500"
    },
    {
      number: "03",
      icon: Play,
      title: "Insert & Visualize",
      description: "Use Insert/Delete buttons to add data, then click Play to see animations",
      color: "from-green-500 to-emerald-500"
    },
    {
      number: "04",
      icon: Eye,
      title: "Learn & Understand",
      description: "Follow the color legend and narration box to understand each step",
      color: "from-orange-500 to-red-500"
    }
  ];

  const features = [
    {
      icon: Database,
      title: "Data Structure Simulators",
      items: [
        "Interactive Arrays with sorting animations",
        "Dynamic Linked Lists with pointer visualization", 
        "Stack & Queue operations with real-time updates",
        "Binary Trees with traversal algorithms",
        "Graph structures with node/edge manipulation"
      ],
      gradient: "from-blue-500/10 to-purple-500/10"
    },
    {
      icon: Zap,
      title: "Sorting & Searching Algorithms",
      items: [
        "Bubble Sort with step-by-step comparisons",
        "Quick Sort with partition visualization",
        "Merge Sort with recursive breakdowns",
        "Binary Search with interval narrowing",
        "Linear Search with element highlighting"
      ],
      gradient: "from-green-500/10 to-teal-500/10"
    },
    {
      icon: Brain,
      title: "Advanced Graph Algorithms",
      items: [
        "Breadth-First Search (BFS) traversal",
        "Depth-First Search (DFS) exploration",
        "Dijkstra's shortest path algorithm",
        "Interactive node and edge creation",
        "Real-time pathfinding visualization"
      ],
      gradient: "from-orange-500/10 to-red-500/10"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 cyber-grid opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
          
          <div className="container relative z-10">
            <motion.div
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl mb-8 backdrop-blur-xl border border-primary/30"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <BookOpen className="h-12 w-12 text-primary" />
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Master AlgoViz
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Your complete guide to understanding data structures and algorithms through interactive visualization
              </p>
            </motion.div>
          </div>
        </section>

        {/* How to Navigate Section */}
        <section className="py-20 md:py-32 relative">
          <div className="container">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                How to Navigate AlgoViz
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Follow these simple steps to get the most out of your learning experience
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="relative group"
                >
                  <div className="cyber-card text-center h-full relative overflow-hidden">
                    {/* Step Number */}
                    <div className="absolute top-4 right-4 text-6xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors">
                      {step.number}
                    </div>
                    
                    {/* Icon */}
                    <motion.div 
                      className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 10 }}
                    >
                      <step.icon className="h-10 w-10 text-white drop-shadow-lg" />
                    </motion.div>
                    
                    <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                    
                    {/* Progress connector for larger screens */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent"></div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"></div>
          
          <div className="container relative z-10">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                What's Inside AlgoViz?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive coverage of essential computer science concepts with interactive learning
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className={`cyber-card group hover:border-primary/40 relative overflow-hidden bg-gradient-to-br ${feature.gradient}`}
                >
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <motion.div 
                      className="p-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: 5 }}
                    >
                      <feature.icon className="h-8 w-8 text-primary" />
                    </motion.div>
                    <h3 className="text-2xl font-semibold">{feature.title}</h3>
                  </div>
                  
                  {/* Feature List */}
                  <ul className="space-y-4">
                    {feature.items.map((item, itemIndex) => (
                      <motion.li 
                        key={itemIndex}
                        className="flex items-start gap-3 text-muted-foreground"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: itemIndex * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  {/* Hover Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    animate={{
                      background: [
                        'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.05) 50%, transparent 100%)',
                        'linear-gradient(90deg, transparent 100%, rgba(59,130,246,0.05) 150%, transparent 200%)'
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="cyber-card bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 text-center">
                <motion.div
                  className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl mb-8 backdrop-blur-xl border border-primary/30"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Sparkles className="h-10 w-10 text-primary" />
                </motion.div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Contact & Feedback
                </h2>
                <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
                  Have questions, suggestions, or want to contribute? We'd love to hear from you!
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div 
                    className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50"
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl">
                      <Github className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-lg mb-2">GitHub Repository</h3>
                      <p className="text-muted-foreground mb-4">View source code, report issues, or contribute</p>
                      <motion.a 
                        href="https://github.com/2003Mohammed" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                        whileHover={{ x: 5 }}
                      >
                        github.com/2003Mohammed
                        <ArrowRight className="h-4 w-4" />
                      </motion.a>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50"
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl">
                      <Mail className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-lg mb-2">Direct Feedback</h3>
                      <p className="text-muted-foreground mb-4">Send suggestions, bug reports, or just say hi</p>
                      <motion.a 
                        href="mailto:sammohammed2003@gmail.com" 
                        className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                        whileHover={{ x: 5 }}
                      >
                        sammohammed2003@gmail.com
                        <ArrowRight className="h-4 w-4" />
                      </motion.a>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Guide;
