import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Menu, X, Activity, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'DSA', path: '/algorithms' },
    { name: 'Guide', path: '/guide' }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isSubPage = location.pathname !== '/' && 
    !location.pathname.endsWith('/data-structures') && 
    !location.pathname.endsWith('/algorithms') && 
    !location.pathname.endsWith('/guide');

  const handleBack = () => {
    navigate(-1);
  };

  const handleAssistantNavigation = () => {
    const assistantPanel = document.getElementById('algoviz-assistant');

    if (assistantPanel) {
      assistantPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    window.dispatchEvent(new Event('algoviz-assistant-toggle'));
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl theme-transition">
      <div className="container flex h-16 items-center justify-between">
        {/* Back Button for Subpages */}
        {isSubPage && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mr-4 theme-transition hover:bg-accent/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">AlgoViz</span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  size="sm"
                  className="theme-transition hover:bg-accent/80"
                >
                  {item.name}
                </Button>
              </motion.div>
            </Link>
          ))}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="ghost"
              size="sm"
              className="theme-transition hover:bg-accent/80"
              onClick={handleAssistantNavigation}
            >
              AlgoViz Assistant
            </Button>
          </motion.div>
        </div>

        {/* Theme Switcher & Mobile Menu */}
        <div className="flex items-center space-x-2">
          <ThemeSwitcher />

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden theme-transition"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isMobileMenuOpen ? 'close' : 'menu'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </motion.div>
            </AnimatePresence>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-border/40 bg-background/90 backdrop-blur-xl"
          >
            <div className="container py-4 space-y-2">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant={isActive(item.path) ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start theme-transition"
                    >
                      {item.name}
                    </Button>
                  </motion.div>
                </Link>
              ))}

              <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start theme-transition"
                  onClick={handleAssistantNavigation}
                >
                  AlgoViz Assistant
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};