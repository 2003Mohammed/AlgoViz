
import React from 'react';
import { Github, Mail, Heart, Code, BookOpen, Zap, Coffee, ExternalLink, Keyboard } from 'lucide-react';
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
    <footer className="bg-background/95 backdrop-blur-xl border-t border-border/50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 cyber-grid opacity-30"></div>
      
      <div className="container py-12 relative z-10">
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

            {/* Keyboard Shortcuts */}
            <motion.div 
              className="pt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="text-sm font-semibold text-cyber-primary mb-2 flex items-center gap-2">
                <Keyboard className="h-4 w-4" />
                Keyboard Shortcuts
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Play/Pause:</span>
                  <kbd className="bg-muted px-1 py-0.5 rounded text-xs">Space</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Reset:</span>
                  <kbd className="bg-muted px-1 py-0.5 rounded text-xs">R</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Step Forward:</span>
                  <kbd className="bg-muted px-1 py-0.5 rounded text-xs">→</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Step Back:</span>
                  <kbd className="bg-muted px-1 py-0.5 rounded text-xs">←</kbd>
                </div>
              </div>
            </motion.div>
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

            {/* Trending DSA Questions */}
            <div className="pt-4">
              <h5 className="text-sm font-semibold text-cyber-secondary mb-2">🔥 Trending Questions</h5>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-neon-pink rounded-full animate-pulse"></span>
                  <span>Two Sum Problem</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-neon-blue rounded-full animate-pulse"></span>
                  <span>Binary Tree Traversal</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></span>
                  <span>Longest Substring</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-neon-yellow rounded-full animate-pulse"></span>
                  <span>Merge Intervals</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Contact & Support */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-heading font-semibold text-foreground">Connect & Support</h4>
            
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
                href="mailto:sammohmmed2003@gmail.com" 
                className="text-muted-foreground hover:text-neon-purple transition-colors"
                aria-label="Email"
                variants={socialVariants}
                whileHover="hover"
              >
                <Mail className="h-6 w-6" />
              </motion.a>
            </div>

            {/* Support Section */}
            <div className="space-y-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a 
                  href="https://buymeacoffee.com/example" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-neon-yellow transition-colors bg-yellow-500/10 px-3 py-2 rounded-lg border border-yellow-500/20"
                >
                  <Coffee className="h-4 w-4" />
                  <span>Buy me a coffee</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a 
                  href="mailto:sammohmmed2003@gmail.com"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-neon-blue transition-colors bg-blue-500/10 px-3 py-2 rounded-lg border border-blue-500/20"
                >
                  <Mail className="h-4 w-4" />
                  <span>Contribute</span>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="border-t border-border/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="text-sm text-muted-foreground flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center space-x-2">
              <span>Built with</span>
              <motion.span
                animate={{ 
                  scale: [1, 1.2, 1],
                  color: ['#ef4444', '#ec4899', '#ef4444']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="h-4 w-4 inline" />
              </motion.span>
              <span>by</span>
              <motion.span 
                className="font-semibold text-cyber-primary"
                whileHover={{ 
                  textShadow: "0 0 8px rgba(0, 243, 255, 0.8)",
                  scale: 1.1
                }}
              >
                Mohammed A
              </motion.span>
            </div>
            <span className="text-xs">© 2025 DSA Visualizer</span>
          </motion.div>
          
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
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

        {/* Future Updates Banner */}
        <motion.div
          className="mt-8 cyber-panel bg-gradient-to-r from-cyber-primary/10 to-cyber-secondary/10 border border-cyber-primary/30"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="text-center py-4">
            <motion.h4 
              className="text-lg font-bold text-cyber-primary mb-2"
              animate={{ 
                textShadow: [
                  "0 0 5px rgba(0, 243, 255, 0.5)",
                  "0 0 10px rgba(0, 243, 255, 0.8)",
                  "0 0 5px rgba(0, 243, 255, 0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🚧 Coming Soon
            </motion.h4>
            <p className="text-sm text-muted-foreground">
              We're actively working on adding many more algorithms and data structures. 
              Advanced graph algorithms, dynamic programming visualizations, and interactive coding challenges are in development!
            </p>
            <motion.div 
              className="mt-3 text-xs text-cyber-secondary"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Stay tuned for updates! 🎉
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
