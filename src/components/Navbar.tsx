
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronRight, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  BookOpen, 
  Info, 
  Star, 
  Code
} from 'lucide-react';
import { Button } from './ui/button';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from './ui/navigation-menu';
import { cn } from '@/lib/utils';

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

  const mainNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'Algorithms', path: '/visualizer' },
    { name: 'Data Structures', path: '/data-structures' },
    { name: 'Learn', path: '/learn' },
    { name: 'About', path: '/about' },
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
            
            {/* Desktop navigation */}
            <div className="hidden md:flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link 
                      to="/" 
                      className={cn(
                        navigationMenuTriggerStyle(),
                        isActive('/') ? 'text-primary bg-primary/10' : ''
                      )}
                    >
                      Home
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuTrigger 
                      className={isActive('/visualizer') || location.pathname.includes('/visualizer/') ? 'text-primary bg-primary/10' : ''}
                    >
                      Algorithms
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        <div>
                          <Link 
                            to="/visualizer"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            onClick={closeMenu}
                          >
                            <div className="text-sm font-medium leading-none">
                              All Algorithms
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Browse all available algorithm visualizations
                            </p>
                          </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Link 
                            to="/visualizer?category=sorting"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            onClick={closeMenu}
                          >
                            <div className="text-sm font-medium leading-none">Sorting</div>
                          </Link>
                          <Link 
                            to="/visualizer?category=searching"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            onClick={closeMenu}
                          >
                            <div className="text-sm font-medium leading-none">Searching</div>
                          </Link>
                          <Link 
                            to="/visualizer?category=graph"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            onClick={closeMenu}
                          >
                            <div className="text-sm font-medium leading-none">Graph</div>
                          </Link>
                          <Link 
                            to="/visualizer?category=dynamic"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            onClick={closeMenu}
                          >
                            <div className="text-sm font-medium leading-none">Dynamic Programming</div>
                          </Link>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={isActive('/data-structures') || location.pathname.includes('/data-structures/') ? 'text-primary bg-primary/10' : ''}
                    >
                      Data Structures
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        <div>
                          <Link 
                            to="/data-structures" 
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            onClick={closeMenu}
                          >
                            <div className="text-sm font-medium leading-none">
                              All Data Structures
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Browse all available data structure visualizations
                            </p>
                          </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Link 
                            to="/data-structures/array"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            onClick={closeMenu}
                          >
                            <div className="text-sm font-medium leading-none">Arrays</div>
                          </Link>
                          <Link 
                            to="/data-structures/linked-list"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            onClick={closeMenu}
                          >
                            <div className="text-sm font-medium leading-none">Linked Lists</div>
                          </Link>
                          <Link 
                            to="/data-structures/stack"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            onClick={closeMenu}
                          >
                            <div className="text-sm font-medium leading-none">Stacks</div>
                          </Link>
                          <Link 
                            to="/data-structures/queue"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            onClick={closeMenu}
                          >
                            <div className="text-sm font-medium leading-none">Queues</div>
                          </Link>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <Link 
                      to="/learn" 
                      className={cn(
                        navigationMenuTriggerStyle(),
                        isActive('/learn') ? 'text-primary bg-primary/10' : ''
                      )}
                    >
                      <BookOpen className="mr-1 h-4 w-4" />
                      Learn
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <Link 
                      to="/about" 
                      className={cn(
                        navigationMenuTriggerStyle(),
                        isActive('/about') ? 'text-primary bg-primary/10' : ''
                      )}
                    >
                      <Info className="mr-1 h-4 w-4" />
                      About
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
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
              to="/pro"
              className="hidden md:flex items-center h-9 rounded-md px-4 py-2 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground text-sm font-medium shadow-sm hover:opacity-90 transition-opacity"
            >
              <Star className="mr-1 h-4 w-4" /> Try AlgoViz Pro
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
              {mainNavLinks.map((link) => (
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
                to="/pro"
                className="mt-2 flex items-center justify-center h-10 rounded-md px-4 py-2 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground font-medium shadow-sm hover:opacity-90 transition-opacity"
                onClick={closeMenu}
              >
                <Star className="mr-1 h-4 w-4" /> Try AlgoViz Pro
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
