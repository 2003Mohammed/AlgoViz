import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { motion } from 'framer-motion';
import { ArrowLeft, Database, Zap, Target, Eye, Play, RotateCcw, ArrowRight, Mail, Github, HelpCircle, BookOpen, Code, Activity } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const Guide = () => {
  const navigate = useNavigate();

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

  const steps = [
    {
      number: 1,
      icon: <Target className="h-6 w-6" />,
      title: "Choose Your Path",
      description: "Navigate to either Data Structures or Algorithms section based on what you want to learn",
      color: "from-[hsl(var(--zady-pink))] to-[hsl(var(--zady-blue))]"
    },
    {
      number: 2,
      icon: <Eye className="h-6 w-6" />,
      title: "Select a Topic",
      description: "Pick a specific topic like Arrays, Linked Lists, Bubble Sort, or Binary Search from the grid",
      color: "from-[hsl(var(--zady-blue))] to-[hsl(var(--zady-accent))]"
    },
    {
      number: 3,
      icon: <Play className="h-6 w-6" />,
      title: "Interactive Controls",
      description: "Use Insert, Delete, Play, Pause, and Step buttons to control the visualization",
      color: "from-[hsl(var(--zady-accent))] to-[hsl(var(--zady-pink))]"
    },
    {
      number: 4,
      icon: <BookOpen className="h-6 w-6" />,
      title: "Follow the Journey",
      description: "Watch the color-coded animations and read the narration box to understand each step",
      color: "from-[hsl(var(--zady-pink))] to-[hsl(var(--zady-blue))]"
    }
  ];

  const features = [
    {
      icon: <Database className="h-8 w-8" />,
      title: "Data Structure Simulators",
      items: [
        "Arrays with sorting animations",
        "Linked Lists with pointer visualization", 
        "Stacks and Queues with LIFO/FIFO operations",
        "Trees with traversal animations",
        "Graphs with node and edge interactions"
      ]
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "Sorting & Searching Algorithms",
      items: [
        "Bubble Sort with swap animations",
        "Quick Sort with pivot selection",
        "Merge Sort with divide-and-conquer",
        "Binary Search with range narrowing",
        "Linear Search with sequential checking"
      ]
    },
    {
      icon: <Activity className="h-8 w-8" />,
      title: "Advanced Graph Algorithms",
      items: [
        "Breadth-First Search (BFS) traversal",
        "Depth-First Search (DFS) exploration", 
        "Connected components detection",
        "Cycle detection in graphs"
      ]
    }
  ];

  return (
    <Layout>
      <div className="relative overflow-hidden">
        {/* Floating Shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-32 right-10 w-12 h-12 bg-gradient-to-r from-[hsl(var(--zady-pink))] to-[hsl(var(--zady-blue))] rounded-full opacity-20 animate-float-shapes"></div>
          <div className="absolute bottom-40 left-16 w-16 h-16 bg-gradient-to-r from-[hsl(var(--zady-blue))] to-[hsl(var(--zady-accent))] rounded-lg opacity-15 animate-float-shapes" style={{ animationDelay: '3s' }}></div>
        </div>

        {/* Header with Back Button */}
        <motion.section 
          className="py-12 bg-gradient-to-r from-[hsl(var(--zady-pink))] via-[hsl(var(--zady-blue))] to-[hsl(var(--zady-accent))]"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="container mx-auto">
            <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button asChild variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <Link to="/">
                  Home
                </Link>
              </Button>
            </motion.div>
            
            <motion.div variants={itemVariants} className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Guide to Using AlgoViz
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Your comprehensive guide to mastering algorithms and data structures through interactive visualizations
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* How to Navigate */}
        <motion.section 
          className="py-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="container mx-auto">
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How to Navigate
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Follow these simple steps to get the most out of your learning experience
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <Card className="zady-card h-full">
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white`}>
                        <span className="text-2xl font-bold">{step.number}</span>
                      </div>
                      <div className="text-[hsl(var(--zady-blue))] mb-2">
                        {step.icon}
                      </div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center">
                        {step.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                  
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="h-6 w-6 text-[hsl(var(--zady-blue))]" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* What's Inside */}
        <motion.section 
          className="py-20 bg-gradient-to-b from-transparent to-muted/30"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="container mx-auto">
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What's Inside AlgoViz?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive coverage of computer science fundamentals with interactive learning
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="zady-card h-full">
                    <CardHeader>
                      <div className="text-[hsl(var(--zady-blue))] mb-4">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {feature.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-[hsl(var(--zady-pink))] rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Quick Tips */}
        <motion.section 
          className="py-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="container mx-auto">
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pro Tips for Learning
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <motion.div variants={itemVariants}>
                <Card className="zady-card">
                  <CardHeader>
                    <HelpCircle className="h-8 w-8 text-[hsl(var(--zady-blue))] mb-2" />
                    <CardTitle>What is a Data Structure?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      A data structure is a way of organizing and storing data so that it can be accessed and modified efficiently. 
                      Examples include arrays, linked lists, trees, and graphs - each optimized for different types of operations.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="zady-card">
                  <CardHeader>
                    <Zap className="h-8 w-8 text-[hsl(var(--zady-pink))] mb-2" />
                    <CardTitle>What is an Algorithm?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      An algorithm is a step-by-step procedure for solving a problem or completing a task. 
                      In computer science, algorithms define how to manipulate data structures to achieve specific goals efficiently.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section 
          className="py-20 bg-gradient-to-r from-[hsl(var(--zady-pink))] via-[hsl(var(--zady-blue))] to-[hsl(var(--zady-accent))]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="container mx-auto">
            <motion.div variants={itemVariants} className="text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Contact & Feedback
              </h2>
              <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
                Have questions, suggestions, or just want to say hi? We'd love to hear from you!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <motion.a
                  href="mailto:sammohammed2003@gmail.com"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg border border-white/30 text-white transition-all"
                >
                  <Mail className="h-5 w-5" />
                  sammohammed2003@gmail.com
                </motion.a>
                
                <motion.a
                  href="https://github.com/2003Mohammed"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg border border-white/30 text-white transition-all"
                >
                  <Github className="h-5 w-5" />
                  GitHub Profile
                </motion.a>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Bottom Navigation */}
        <motion.section 
          className="py-12 bg-card border-t border-border"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="container mx-auto">
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild variant="outline" size="lg">
                <Link to="/">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back to Home
                </Link>
              </Button>
              <Button asChild size="lg">
                <Link to="/data-structures">
                  <Database className="mr-2 h-5 w-5" />
                  Start with Data Structures
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/algorithms">
                  <Zap className="mr-2 h-5 w-5" />
                  Explore Algorithms
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </Layout>
  );
};

export default Guide;