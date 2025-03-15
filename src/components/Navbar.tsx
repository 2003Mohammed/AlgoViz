
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Menu, X, Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    // Check user's preferred color scheme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Algorithms', path: '/visualizer' },
    { name: 'Data Structures', path: '/data-structures' },
    { name: 'About', path: '#' },
  ];

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-lg shadow-sm dark:bg-gray-900/80' 
          : 'bg-transparent'
      }`}
    >
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl" onClick={closeMenu}>
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground">
                AV
              </div>
              <span>AlgoViz</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(link.path) ? 'text-primary' : 'text-foreground/80'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <Link
              to="/visualizer"
              className="hidden md:flex items-center h-9 rounded-md px-4 py-2 bg-primary text-primary-foreground text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors"
            >
              Try Visualizer <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
            
            <button
              className="flex md:hidden items-center justify-center rounded-md w-9 h-9 text-foreground"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="container py-4 pb-6 border-t">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-2 py-1.5 text-base font-medium rounded-md ${
                    isActive(link.path) 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-foreground hover:bg-muted hover:text-foreground'
                  }`}
                  onClick={closeMenu}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/visualizer"
                className="mt-2 flex items-center justify-center h-10 rounded-md px-4 py-2 bg-primary text-primary-foreground font-medium shadow-sm hover:bg-primary/90 transition-colors"
                onClick={closeMenu}
              >
                Try Visualizer <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
