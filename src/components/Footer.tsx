
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-muted/20 border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">AlgoViz</h3>
            <p className="text-sm text-muted-foreground">
              Interactive algorithm and data structure visualizations for learning and teaching.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-medium">Quick Links</h4>
            <div className="space-y-2">
              <motion.div whileHover={{ x: 3 }}>
                <Link to="/algorithms" className="block text-sm text-muted-foreground hover:text-foreground">
                  Algorithms
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 3 }}>
                <Link to="/data-structures" className="block text-sm text-muted-foreground hover:text-foreground">
                  Data Structures
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 3 }}>
                <Link to="/guides" className="block text-sm text-muted-foreground hover:text-foreground">
                  Learning Guides
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Visualizers */}
          <div className="space-y-4">
            <h4 className="font-medium">Visualizers</h4>
            <div className="space-y-2">
              <motion.div whileHover={{ x: 3 }}>
                <Link to="/visualizer/array" className="block text-sm text-muted-foreground hover:text-foreground">
                  Array Operations
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 3 }}>
                <Link to="/visualizer/binary-search" className="block text-sm text-muted-foreground hover:text-foreground">
                  Binary Search
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Social & Credits */}
          <div className="space-y-4">
            <h4 className="font-medium">Connect</h4>
            <div className="flex space-x-4">
              <a href="https://github.com" className="text-muted-foreground hover:text-foreground">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" className="text-muted-foreground hover:text-foreground">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 AlgoViz. Built with <Heart className="w-4 h-4 inline text-red-500" /> for learning.
            </p>
            <p className="text-sm text-muted-foreground mt-2 md:mt-0">
              Educational tool for algorithm visualization
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
