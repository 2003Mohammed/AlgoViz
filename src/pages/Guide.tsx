
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
  Mail
} from 'lucide-react';

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
      title: "Navigate",
      description: "Choose either Data Structures or Algorithms section"
    },
    {
      icon: Database,
      title: "Select Topic",
      description: "Pick a specific topic like Array, Linked List, or Bubble Sort"
    },
    {
      icon: Play,
      title: "Visualize",
      description: "Use Insert/Delete/Play buttons to see the concept in action"
    },
    {
      icon: Eye,
      title: "Learn",
      description: "Follow the narration box and color legend to understand each step"
    }
  ];

  const features = [
    {
      icon: Database,
      title: "Data Structures",
      items: ["Arrays", "Linked Lists", "Stacks", "Queues", "Trees", "Graphs"]
    },
    {
      icon: Zap,
      title: "Sorting & Searching",
      items: ["Bubble Sort", "Quick Sort", "Merge Sort", "Binary Search", "Linear Search"]
    },
    {
      icon: Brain,
      title: "Graph Algorithms",
      items: ["BFS", "DFS", "Dijkstra's Algorithm"]
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
            Guide to Using AlgoViz
          </h1>
          <p className="body-lg text-muted-foreground max-w-3xl mx-auto">
            Learn how to navigate and use AlgoViz for mastering data structures and algorithms
          </p>
        </motion.div>

        {/* How to Use Steps */}
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
            How to Use AlgoViz
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={itemVariants}
                className="cyber-card text-center group hover:border-primary/40"
              >
                <div className="mb-4 relative">
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

        {/* Features Section */}
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
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="cyber-card group hover:border-primary/40"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                </div>
                
                <ul className="space-y-2">
                  {feature.items.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="cyber-card bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <h2 className="text-2xl font-semibold mb-6 text-foreground text-center">Contact & Feedback</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Email</h3>
                  <a 
                    href="mailto:sammohammed2003@gmail.com" 
                    className="text-primary hover:underline"
                  >
                    sammohammed2003@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl">
                  <Github className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">GitHub</h3>
                  <a 
                    href="https://github.com/2003Mohammed" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    github.com/2003Mohammed
                  </a>
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
