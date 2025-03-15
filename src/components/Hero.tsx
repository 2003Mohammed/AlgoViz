
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Eye, Zap, BookOpen, Star } from 'lucide-react';
import { Button } from './ui/button';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/0 to-primary/5 -z-10" />
      
      {/* Abstract background shapes */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse-slow" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse-slow" style={{ animationDelay: '1s' }} />
      
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-10">
          <div className="space-y-6 max-w-3xl mx-auto animate-slide-up">
            <h1 className="heading-xl">
              Visualize Algorithms,<br />
              <span className="text-primary">Understand Data Structures</span>
            </h1>
            <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
              A beautiful, interactive way to learn algorithms and data structures.
              Watch algorithms come to life with step-by-step visualizations and code walkthroughs.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <Link to="/visualizer">
              <Button size="lg" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Explore Algorithms
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/data-structures">
              <Button size="lg" variant="outline" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Explore Data Structures
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="w-full max-w-5xl mx-auto mt-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="aspect-video rounded-xl overflow-hidden shadow-2xl ring-1 ring-black/5">
              <div className="w-full h-full bg-gradient-to-br from-black/5 to-black/10 flex items-center justify-center">
                <div className="glass-card p-8 flex flex-col items-center gap-4">
                  <Zap size={48} className="text-primary" />
                  <p className="text-lg font-medium">Interactive Algorithm Visualizations</p>
                  <div className="flex gap-3 mt-2">
                    <Link 
                      to="/visualizer" 
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors"
                    >
                      Try Algorithms
                    </Link>
                    <Link 
                      to="/data-structures" 
                      className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-secondary/90 transition-colors"
                    >
                      Try Data Structures
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features section */}
      <div id="features" className="container px-4 py-24 md:py-32">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="heading-lg">Why Visualize Algorithms?</h2>
          <p className="body-md text-muted-foreground mt-4 max-w-2xl mx-auto">
            Understanding algorithms is easier when you can see them in action.
            Our visualizer helps you comprehend complex concepts with clarity.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Eye className="h-10 w-10 text-primary" />,
              title: "Visual Learning",
              description: "See algorithms in action with step-by-step visualization to understand complex operations intuitively."
            },
            {
              icon: <Code className="h-10 w-10 text-primary" />,
              title: "Code Highlighting",
              description: "Follow along with synchronized code highlights that show exactly what's happening at each step."
            },
            {
              icon: <Zap className="h-10 w-10 text-primary" />,
              title: "Interactive Controls",
              description: "Control the speed, step forward and backward, or use custom inputs to test different scenarios."
            },
            {
              icon: <BookOpen className="h-10 w-10 text-primary" />,
              title: "Comprehensive Learning",
              description: "Access detailed guides, explanations, and real-world examples for each algorithm and data structure."
            },
            {
              icon: <Star className="h-10 w-10 text-primary" />,
              title: "Premium Features",
              description: "Unlock advanced visualizations, in-depth tutorials, and personalized learning paths with AlgoViz Pro."
            },
            {
              icon: <ArrowRight className="h-10 w-10 text-primary" />,
              title: "Get Started Quickly",
              description: "No setup required. Start visualizing algorithms and data structures right in your browser."
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="glass-card p-6 flex flex-col items-center text-center animate-zoom-in"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <div className="mb-5">{feature.icon}</div>
              <h3 className="heading-sm mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Call to action */}
      <div className="container px-4 py-16">
        <div className="glass-card p-8 md:p-12 flex flex-col items-center text-center">
          <h2 className="heading-lg mb-4">Ready to Master Algorithms?</h2>
          <p className="body-md text-muted-foreground max-w-2xl mx-auto mb-8">
            Start your journey to algorithm mastery with interactive visualizations and comprehensive guides.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/visualizer">
              <Button size="lg" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Start Visualizing Now
              </Button>
            </Link>
            <Link to="/learn">
              <Button size="lg" variant="outline" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Browse Learning Resources
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
