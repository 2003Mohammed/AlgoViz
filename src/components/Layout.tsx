
import React from 'react';
import { Navbar } from './Navbar';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-cyber-dark text-foreground transition-colors duration-300">
      <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark to-black"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-cyber-grid opacity-20"></div>
        
        {/* Radial glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-primary/5 to-transparent"></div>
        
        {/* Noise texture */}
        <div className="absolute inset-0 noise-bg"></div>
        
        {/* Circuit patterns */}
        <div className="absolute top-20 left-[5%] w-[20%] h-[30%] opacity-10">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M20,10 L80,10 L80,90 L20,90 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyber-primary"></path>
            <path d="M30,20 L70,20 L70,80 L30,80 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyber-primary"></path>
            <path d="M10,0 V100" stroke="currentColor" strokeWidth="0.5" className="text-cyber-primary"></path>
            <path d="M90,0 V100" stroke="currentColor" strokeWidth="0.5" className="text-cyber-primary"></path>
            <path d="M0,10 H100" stroke="currentColor" strokeWidth="0.5" className="text-cyber-primary"></path>
            <path d="M0,90 H100" stroke="currentColor" strokeWidth="0.5" className="text-cyber-primary"></path>
          </svg>
        </div>
        
        <div className="absolute bottom-20 right-[5%] w-[30%] h-[40%] opacity-10">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyber-secondary"></circle>
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyber-secondary"></circle>
            <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyber-secondary"></circle>
            <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-cyber-secondary"></line>
            <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.5" className="text-cyber-secondary"></line>
          </svg>
        </div>
      </div>
      
      <Navbar />
      
      <main className="flex-1 container py-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          {children}
        </motion.div>
      </main>
      
      <footer className="py-6 md:py-8 border-t border-cyber-primary/30 bg-black/30 backdrop-blur-md relative z-10">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-cyber-primary/70">
              <span className="neon-text">AlgoViz</span> &copy; {new Date().getFullYear()} · All rights reserved
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-cyber-primary/60 hover:text-cyber-primary transition-colors hover:animate-neon-pulse">
                GitHub
              </a>
              <a href="#" className="text-sm text-cyber-primary/60 hover:text-cyber-primary transition-colors hover:animate-neon-pulse">
                Twitter
              </a>
              <a href="#" className="text-sm text-cyber-primary/60 hover:text-cyber-primary transition-colors hover:animate-neon-pulse">
                About
              </a>
            </div>
          </div>
        </div>
        
        {/* Decorative footer line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-cyber-primary/0 via-cyber-primary/70 to-cyber-primary/0"></div>
      </footer>
    </div>
  );
};
