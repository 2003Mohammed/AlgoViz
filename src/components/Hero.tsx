
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Eye, Zap } from 'lucide-react';

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
            <Link
              to="/visualizer"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              to="#features"
              className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Learn More
            </Link>
          </div>
          
          <div className="w-full max-w-5xl mx-auto mt-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="aspect-video rounded-xl overflow-hidden shadow-2xl ring-1 ring-black/5">
              <div className="w-full h-full bg-gradient-to-br from-black/5 to-black/10 flex items-center justify-center">
                <div className="glass-card p-8 flex flex-col items-center gap-4">
                  <Zap size={48} className="text-primary" />
                  <p className="text-lg font-medium">Algorithm Visualizations Coming Soon</p>
                  <Link 
                    to="/visualizer" 
                    className="mt-2 text-sm text-primary hover:underline"
                  >
                    Explore Now
                  </Link>
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
    </section>
  );
};
