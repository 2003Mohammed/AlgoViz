
import React from 'react';
import { Layout } from '../components/Layout';
import { Hero } from '../components/Hero';
import { AlgorithmGrid } from '../components/AlgorithmGrid';
import { DataStructureGrid } from '../components/DataStructureGrid';
import { FloatingIcons } from '../components/FloatingIcons';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Code, Zap, Sparkles, Cpu, Brain } from 'lucide-react';
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

  return (
    <Layout>
      <FloatingIcons />
      <Hero />
      
      {/* Site Introduction Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-blue/5 to-transparent" />
        <div className="container relative z-10">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="flex justify-center mb-8">
              <motion.div 
                className="p-4 bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 rounded-2xl backdrop-blur-xl border border-neon-blue/20"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(0, 212, 255, 0.3)"
                }}
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                <Brain className="h-12 w-12 text-neon-blue" />
              </motion.div>
            </motion.div>
            
            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold font-heading mb-8 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent"
            >
              Interactive Data Structures & Algorithms Visualizer
            </motion.h2>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl text-muted-foreground mb-12 leading-relaxed font-body"
            >
              This platform offers cutting-edge interactive visualizations for core data structures and algorithms. 
              Perfect for students, developers, and interview preparation. Learn through visual 
              exploration, step-by-step animations, and hands-on experimentation.
            </motion.p>
            
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
            >
              {[
                {
                  icon: Code,
                  title: "Visual Learning",
                  description: "See algorithms in action with beautiful step-by-step animations and real-time visualizations",
                  color: "neon-blue",
                  delay: 0.1
                },
                {
                  icon: Zap,
                  title: "Interactive Controls",
                  description: "Control speed, step through algorithms, experiment with custom inputs and see instant results",
                  color: "neon-purple",
                  delay: 0.2
                },
                {
                  icon: Sparkles,
                  title: "Interview Prep",
                  description: "Master algorithms commonly asked in technical interviews with comprehensive explanations",
                  color: "neon-pink",
                  delay: 0.3
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05,
                    y: -10
                  }}
                  className="group relative p-8 rounded-2xl bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border border-border/50 hover:border-neon-blue/30 transition-all duration-300 cursor-pointer"
                >
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-blue/5 to-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <div className="relative z-10">
                    <motion.div 
                      className={`w-16 h-16 rounded-xl bg-gradient-to-br from-${feature.color}/20 to-${feature.color}/10 flex items-center justify-center mb-6 mx-auto`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className={`h-8 w-8 text-${feature.color}`} />
                    </motion.div>
                    <h3 className="font-heading font-semibold text-xl mb-4 text-center">{feature.title}</h3>
                    <p className="text-muted-foreground text-center leading-relaxed font-body">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Algorithms Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/5 via-transparent to-neon-purple/5" />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              Explore Algorithms
            </h2>
            <p className="text-xl text-muted-foreground font-body">
              Dive deep into sorting, searching, and optimization algorithms
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <AlgorithmGrid />
          </motion.div>
          
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link to="/visualizer">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="relative overflow-hidden bg-gradient-to-r from-neon-blue to-neon-purple text-white px-8 py-4 text-lg font-semibold rounded-xl border-0 shadow-xl group">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <div className="relative flex items-center gap-3">
                    View All Algorithms
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
          </motion.div>
        </div>
      </section>
      
      {/* Data Structures Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-l from-neon-purple/5 via-transparent to-neon-pink/5" />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4 bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">
              Explore Data Structures
            </h2>
            <p className="text-xl text-muted-foreground font-body">
              Master fundamental data structures with interactive visualizations
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <DataStructureGrid />
          </motion.div>
          
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link to="/data-structures">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  className="relative overflow-hidden bg-transparent border-2 border-neon-purple/30 text-neon-purple px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-xl hover:bg-neon-purple/10 group"
                >
                  <div className="relative flex items-center gap-3">
                    View All Data Structures
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
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
