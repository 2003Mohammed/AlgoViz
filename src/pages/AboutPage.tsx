
import React from 'react';
import { Layout } from '../components/Layout';
import { Code, Heart, Github, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="heading-lg mb-4">About AlgoViz</h1>
            <p className="text-muted-foreground">
              An interactive visualization tool to help people understand algorithms and data structures.
            </p>
          </div>
          
          <div className="glass-card p-8 md:p-10 mb-12">
            <h2 className="text-2xl font-semibold mb-6">Our Mission</h2>
            <p className="text-muted-foreground mb-6">
              AlgoViz was created with a simple mission: to make algorithms and data structures more accessible, 
              understandable, and enjoyable to learn. We believe that visualization is a powerful learning tool 
              that can transform abstract concepts into intuitive, tangible experiences.
            </p>
            <p className="text-muted-foreground mb-6">
              Our goal is to help students, developers, and anyone interested in computer science to gain a deeper 
              understanding of fundamental algorithms and data structures through interactive, visual learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 mt-10">
              <div className="flex-1 flex flex-col items-center text-center p-6 bg-muted/30 rounded-lg">
                <Code size={32} className="text-primary mb-3" />
                <h3 className="text-lg font-medium mb-2">Interactive Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Learn by interacting with visualizations and seeing algorithms in action
                </p>
              </div>
              <div className="flex-1 flex flex-col items-center text-center p-6 bg-muted/30 rounded-lg">
                <Heart size={32} className="text-primary mb-3" />
                <h3 className="text-lg font-medium mb-2">Open Source</h3>
                <p className="text-sm text-muted-foreground">
                  Built with love by the community, for the community
                </p>
              </div>
              <div className="flex-1 flex flex-col items-center text-center p-6 bg-muted/30 rounded-lg">
                <Star size={32} className="text-primary mb-3" />
                <h3 className="text-lg font-medium mb-2">Free to Use</h3>
                <p className="text-sm text-muted-foreground">
                  Core features are free and accessible to everyone
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-8 text-center">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Alex Chen",
                  role: "Lead Developer",
                  bio: "Passionate about algorithms and creating interactive educational tools.",
                  image: "https://source.unsplash.com/random/100x100?face&1"
                },
                {
                  name: "Maya Rodriguez",
                  role: "UI/UX Designer",
                  bio: "Focused on creating intuitive and engaging user experiences for learning.",
                  image: "https://source.unsplash.com/random/100x100?face&2"
                },
                {
                  name: "Jamal Wilson",
                  role: "Algorithm Specialist",
                  bio: "Expert in algorithm implementation and optimization techniques.",
                  image: "https://source.unsplash.com/random/100x100?face&3"
                }
              ].map((member, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-primary">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-medium">{member.name}</h3>
                  <p className="text-sm text-primary mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass-card p-8 text-center mb-16">
            <h2 className="text-2xl font-semibold mb-6">Get Involved</h2>
            <p className="text-muted-foreground mb-8">
              AlgoViz is an open-source project, and we welcome contributions from the community. 
              Whether you're a developer, designer, educator, or enthusiast, there are many ways to get involved.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="flex items-center gap-2">
                <Github className="h-4 w-4" /> 
                View on GitHub
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Contribute
              </Button>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-6">Support AlgoViz</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Help us continue to improve and expand AlgoViz by upgrading to AlgoViz Pro. 
              Your support enables us to keep developing new features and content.
            </p>
            <Link to="/pro">
              <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600">
                <Star className="mr-2 h-4 w-4" />
                Upgrade to AlgoViz Pro
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
