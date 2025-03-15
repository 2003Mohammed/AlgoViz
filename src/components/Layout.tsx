
import React from 'react';
import { Navbar } from './Navbar';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="flex-1 container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          {children}
        </motion.div>
        
        {/* Decorative pixel art elements */}
        <div className="fixed top-0 right-0 w-40 h-40 bg-primary/5 -z-10 rotate-45 transform translate-x-20 -translate-y-10"></div>
        <div className="fixed bottom-0 left-0 w-60 h-60 bg-primary/5 -z-10 rotate-12 transform -translate-x-20 translate-y-10"></div>
        
        {/* Pixel art decorative dots */}
        <div className="fixed inset-0 pointer-events-none -z-20 pixel-dot opacity-30"></div>
      </main>
      <footer className="py-6 md:py-8 border-t border-border/30 bg-muted/20 dark:bg-gray-800/20 relative z-10">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Algorithm Visualizer &copy; {new Date().getFullYear()} · All rights reserved
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                GitHub
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Twitter
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
