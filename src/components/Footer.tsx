
import React from 'react';
import { Github, Mail, Heart, Code, BookOpen, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Footer: React.FC = () => {
  const socialVariants = {
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: { duration: 0.3 }
    }
  };

  const linkVariants = {
    hover: {
      x: 5,
      color: '#00d4ff',
      transition: { duration: 0.3 }
    }
  };

  return (
    <footer className="bg-background/95 backdrop-blur-xl border-t border-border/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div 
            className="space-y-4 md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3">
              <motion.div 
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple text-white shadow-lg"
                whileHover={{ 
                  boxShadow: "0 0 20px rgba(0, 212, 255, 0.5)",
                  rotate: 360
                }}
                transition={{ duration: 0.6 }}
              >
                <Code className="h-5 w-5" />
              </motion.div>
              <h3 className="font-heading font-bold text-xl bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                DSA Visualizer
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Next-generation interactive visualizations for data structures and algorithms. 
              Master computer science fundamentals through beautiful, engaging animations and step-by-step explorations.
            </p>
            <div className="flex space-x-4 pt-2">
              <motion.span className="text-xs text-muted-foreground bg-neon-blue/10 px-3 py-1 rounded-full border border-neon-blue/20">
                🚀 Always Free
              </motion.span>
              <motion.span className="text-xs text-muted-foreground bg-neon-purple/10 px-3 py-1 rounded-full border border-neon-purple/20">
                🎓 Educational
              </motion.span>
            </div>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-heading font-semibold text-foreground">Explore</h4>
            <div className="space-y-3 text-sm">
              <motion.div variants={linkVariants} whileHover="hover">
                <Link to="/visualizer" className="flex items-center space-x-2 text-muted-foreground hover:text-neon-blue transition-colors group">
                  <Zap className="h-4 w-4 group-hover:text-neon-yellow transition-colors" />
                  <span>Algorithms</span>
                </Link>
              </motion.div>
              <motion.div variants={linkVariants} whileHover="hover">
                <Link to="/data-structures" className="flex items-center space-x-2 text-muted-foreground hover:text-neon-blue transition-colors group">
                  <BookOpen className="h-4 w-4 group-hover:text-neon-green transition-colors" />
                  <span>Data Structures</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Contact & Social */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-heading font-semibold text-foreground">Connect</h4>
            <div className="flex space-x-4">
              <motion.a 
                href="https://github.com" 
                className="text-muted-foreground hover:text-neon-blue transition-colors"
                aria-label="GitHub"
                variants={socialVariants}
                whileHover="hover"
              >
                <Github className="h-6 w-6" />
              </motion.a>
              <motion.a 
                href="mailto:contact@dsavisualizer.com" 
                className="text-muted-foreground hover:text-neon-purple transition-colors"
                aria-label="Email"
                variants={socialVariants}
                whileHover="hover"
              >
                <Mail className="h-6 w-6" />
              </motion.a>
            </div>
            <motion.div 
              className="text-xs text-muted-foreground"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Built with ❤️ for learners
            </motion.div>
          </motion.div>
        </div>
        
        <motion.div 
          className="border-t border-border/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <motion.p 
            className="text-sm text-muted-foreground flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
          >
            <span>© 2025 DSA Visualizer. Made with</span>
            <motion.span
              animate={{ 
                scale: [1, 1.2, 1],
                color: ['#ef4444', '#ec4899', '#ef4444']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="h-4 w-4 inline" />
            </motion.span>
            <span>for learners everywhere.</span>
          </motion.p>
          <div className="flex items-center space-x-4">
            <motion.p 
              className="text-sm text-muted-foreground"
              whileHover={{ color: '#00d4ff' }}
            >
              Open source & free forever
            </motion.p>
            <motion.div 
              className="w-2 h-2 bg-neon-green rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
