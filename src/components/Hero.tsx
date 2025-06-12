
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, BookOpen, Code, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
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

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-neon-blue/5" />
      <div className="absolute inset-0 bg-grid-pattern bg-[size:50px_50px] opacity-30" />
      
      {/* Floating gradient orbs */}
      <motion.div 
        className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -30, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="container relative z-10">
        <motion.div 
          className="flex flex-col items-center justify-center text-center space-y-8 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div 
            variants={itemVariants}
            className="relative"
          >
            <motion.div 
              className="flex items-center space-x-2 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 backdrop-blur-xl px-6 py-3 rounded-full border border-neon-blue/20"
              whileHover={{ scale: 1.05 }}
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(0, 212, 255, 0.2)",
                  "0 0 40px rgba(139, 92, 246, 0.3)",
                  "0 0 20px rgba(0, 212, 255, 0.2)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-5 w-5 text-neon-blue" />
              </motion.div>
              <span className="text-sm font-medium font-heading bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                Next-Gen Algorithm Visualization
              </span>
            </motion.div>
          </motion.div>
          
          {/* Main Heading */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-heading tracking-tight">
              <motion.span 
                className="block bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: "200% 200%"
                }}
              >
                Visualize
              </motion.span>
              <motion.span 
                className="block text-foreground mt-2"
                variants={floatingVariants}
                animate="animate"
              >
                Learn & Master
              </motion.span>
              <motion.span 
                className="block bg-gradient-to-r from-neon-green to-neon-yellow bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 1
                }}
                style={{
                  backgroundSize: "200% 200%"
                }}
              >
                Algorithms
              </motion.span>
            </h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-body"
              variants={itemVariants}
            >
              Experience the future of algorithm learning with{' '}
              <motion.span 
                className="text-neon-blue font-semibold"
                whileHover={{ scale: 1.1 }}
              >
                interactive visualizations
              </motion.span>
              ,{' '}
              <motion.span 
                className="text-neon-purple font-semibold"
                whileHover={{ scale: 1.1 }}
              >
                step-by-step animations
              </motion.span>
              , and{' '}
              <motion.span 
                className="text-neon-pink font-semibold"
                whileHover={{ scale: 1.1 }}
              >
                real-time insights
              </motion.span>
              .
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Link to="/visualizer">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="relative overflow-hidden bg-gradient-to-r from-neon-blue to-neon-purple text-white px-8 py-6 text-lg font-semibold rounded-xl border-0 shadow-2xl group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <div className="relative flex items-center gap-3">
                    <Play className="h-5 w-5" />
                    Start Visualizing
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
            
            <Link to="/data-structures">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="relative overflow-hidden bg-transparent border-2 border-neon-blue/30 text-neon-blue px-8 py-6 text-lg font-semibold rounded-xl backdrop-blur-xl hover:bg-neon-blue/10 group"
                >
                  <div className="relative flex items-center gap-3">
                    <BookOpen className="h-5 w-5" />
                    Explore Data Structures
                    <motion.div
                      animate={{ rotate: [0, 15, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Zap className="h-4 w-4" />
                    </motion.div>
                  </div>
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 w-full max-w-2xl"
          >
            {[
              { value: "15+", label: "Algorithms", color: "neon-blue" },
              { value: "8+", label: "Data Structures", color: "neon-purple" },
              { value: "100%", label: "Free Forever", color: "neon-green" },
              { value: "∞", label: "Learning", color: "neon-pink" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center group cursor-pointer"
                whileHover={{ scale: 1.1 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <motion.div 
                  className={`text-3xl font-bold font-heading text-${stat.color} mb-2`}
                  animate={{ 
                    textShadow: [
                      "0 0 10px rgba(0, 212, 255, 0.5)",
                      "0 0 20px rgba(139, 92, 246, 0.7)",
                      "0 0 10px rgba(0, 212, 255, 0.5)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-muted-foreground font-body">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
