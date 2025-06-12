
import React from 'react';
import { Github, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">DSA Visualizer</h3>
            <p className="text-sm text-muted-foreground">
              Interactive visualizations for data structures and algorithms. 
              Learn, practice, and master CS fundamentals.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-medium">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <div>
                <Link to="/visualizer" className="text-muted-foreground hover:text-primary transition-colors">
                  Algorithms
                </Link>
              </div>
              <div>
                <Link to="/data-structures" className="text-muted-foreground hover:text-primary transition-colors">
                  Data Structures
                </Link>
              </div>
            </div>
          </div>
          
          {/* Contact & Social */}
          <div className="space-y-4">
            <h4 className="font-medium">Connect</h4>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="mailto:contact@dsavisualizer.com" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2025 DSA Visualizer. Made with <Heart className="h-4 w-4 inline text-red-500" /> for learners everywhere.
          </p>
          <p className="text-sm text-muted-foreground mt-2 md:mt-0">
            Open source and free to use
          </p>
        </div>
      </div>
    </footer>
  );
};
