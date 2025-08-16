
import React from 'react';
import { Github, Mail, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-background/95 backdrop-blur-xl border-t border-border/50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 cyber-grid opacity-20"></div>
      
      <div className="container py-8 relative z-10">
        <div className="text-center">
          {/* Social Links */}
          <div className="flex justify-center space-x-6 mb-6">
            <motion.a 
              href="https://github.com/2003Mohammed" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors p-3 rounded-full hover:bg-primary/10"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              aria-label="GitHub"
            >
              <Github className="h-6 w-6" />
            </motion.a>
            <motion.a 
              href="mailto:sammohammed2003@gmail.com" 
              className="text-muted-foreground hover:text-primary transition-colors p-3 rounded-full hover:bg-primary/10"
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Email"
            >
              <Mail className="h-6 w-6" />
            </motion.a>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/buy-me-a-coffee"
                className="text-muted-foreground hover:text-yellow-500 transition-colors p-3 rounded-full hover:bg-yellow-500/10 inline-block"
                aria-label="Buy Me a Coffee"
              >
                <Coffee className="h-6 w-6" />
              </Link>
            </motion.div>
          </div>

          {/* Main Footer Text */}
          <motion.div 
            className="text-muted-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-2">
              <span>Built by</span>
              <motion.span 
                className="font-semibold text-primary"
                whileHover={{ 
                  scale: 1.05,
                  textShadow: "0 0 8px rgba(59, 130, 246, 0.5)"
                }}
              >
                Mohammed A
              </motion.span>
              <span>|</span>
              <span>© 2025</span>
              <motion.span 
                className="font-semibold text-primary"
                whileHover={{ 
                  scale: 1.05,
                  textShadow: "0 0 8px rgba(59, 130, 246, 0.5)"
                }}
              >
                AlgoViz™
              </motion.span>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};
