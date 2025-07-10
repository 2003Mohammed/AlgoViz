
import React from 'react';
import { Layout } from '../components/Layout';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Play, 
  MousePointer, 
  Eye, 
  Settings, 
  Database, 
  Zap, 
  Brain,
  ArrowRight,
  CheckCircle,
  Lightbulb
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Guide = () => {
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

  const steps = [
    {
      icon: MousePointer,
      title: "Choose Your Topic",
      description: "Navigate to Data Structures or Algorithms section and select what you want to learn"
    },
    {
      icon: Settings,
      title: "Generate or Input Data",
      description: "Use 'Generate Example' for random data or manually input your own values"
    },
    {
      icon: Play,
      title: "Start Visualization",
      description: "Click Play to watch the algorithm animate step-by-step with narration"
    },
    {
      icon: Eye,
      title: "Control & Learn",
      description: "Pause, step through manually, adjust speed, and read explanations as you go"
    }
  ];

  const sections = [
    {
      icon: Database,
      title: "Data Structures",
      items: [
        "Arrays - Dynamic operations and visualizations",
        "Linked Lists - Node connections and traversal",
        "Stacks - LIFO operations (Push, Pop)",
        "Queues - FIFO operations (Enqueue, Dequeue)", 
        "Trees - Binary tree operations and traversals",
        "Graphs - Node relationships and connections"
      ],
      path: "/data-structures"
    },
    {
      icon: Zap,
      title: "Sorting Algorithms",
      items: [
        "Bubble Sort - Compare and swap adjacent elements",
        "Selection Sort - Find minimum and place in position",
        "Insertion Sort - Insert elements in correct position",
        "Merge Sort - Divide and conquer approach",
        "Quick Sort - Partition-based sorting",
        "Heap Sort - Binary heap-based sorting"
      ],
      path: "/algorithms"
    },
    {
      icon: Brain,
      title: "Search & Graph Algorithms",
      items: [
        "Linear Search - Sequential element search",
        "Binary Search - Divide and conquer search",
        "BFS - Breadth-First graph traversal",
        "DFS - Depth-First graph traversal",
        "Dijkstra - Shortest path algorithm"
      ],
      path: "/algorithms"
    }
  ];

  return (
    <Layout>
      <div className="container py-12 max-w-6xl">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl backdrop-blur-xl border border-primary/30">
              <BookOpen className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="heading-lg mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            How to Use AlgoViz
          </h1>
          <p className="body-lg text-muted-foreground max-w-3xl mx-auto">
            Your comprehensive guide to mastering data structures and algorithms through interactive visualizations
          </p>
        </motion.div>

        {/* What is AlgoViz */}
        <motion.section
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="cyber-card mb-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">What is AlgoViz?</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  AlgoViz is an interactive learning platform that brings data structures and algorithms to life through 
                  beautiful visualizations, step-by-step animations, and detailed explanations. Whether you're preparing 
                  for interviews, studying computer science, or just curious about how algorithms work, AlgoViz makes 
                  complex concepts easy to understand.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Interactive Animations</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Step-by-Step Narration</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Mobile Friendly</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* How to Use - Steps */}
        <motion.section
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 
            variants={itemVariants}
            className="text-2xl font-semibold mb-8 text-center text-foreground"
          >
            Getting Started in 4 Easy Steps
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={itemVariants}
                className="cyber-card text-center group hover:border-primary/40"
              >
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-3 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Available Sections */}
        <motion.section
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 
            variants={itemVariants}
            className="text-2xl font-semibold mb-8 text-center text-foreground"
          >
            What You Can Learn
          </motion.h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                variants={itemVariants}
                className="cyber-card group hover:border-primary/40"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <section.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{section.title}</h3>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to={section.path}>
                  <Button variant="outline" className="w-full group-hover:bg-primary/10 group-hover:border-primary/50">
                    <span>Explore {section.title}</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Tips Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="cyber-card bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <h2 className="text-2xl font-semibold mb-6 text-foreground flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              Pro Tips for Learning
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Start Slow:</strong> Use the speed controls to slow down animations when learning new concepts
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Step Through:</strong> Use manual stepping to understand each operation in detail
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Try Examples:</strong> Generate random examples to see how algorithms behave with different data
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Read Narration:</strong> Pay attention to the step-by-step explanations during animations
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Practice:</strong> Try creating your own examples and see how the algorithms handle them
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Mobile Learning:</strong> All visualizations work great on mobile devices too!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>
      </div>
    </Layout>
  );
};

export default Guide;
