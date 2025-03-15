
import React from 'react';
import { Layout } from '../components/Layout';
import { Button } from '@/components/ui/button';
import { ChevronRight, BookOpen, GraduationCap, VideoIcon, FileText, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const LearnPage = () => {
  return (
    <Layout>
      <div className="container py-8">
        <div className="text-center mb-16">
          <h1 className="heading-lg mb-4">Learning Resources</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Explore our comprehensive guides, tutorials, and resources to deepen your understanding 
            of algorithms and data structures.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Algorithm courses */}
          <div className="glass-card p-6 flex flex-col h-full">
            <div className="p-3 bg-primary/10 rounded-md w-fit mb-4">
              <GraduationCap size={24} className="text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Algorithm Courses</h2>
            <p className="text-muted-foreground mb-6 flex-grow">
              Structured learning paths for mastering algorithms from basic to advanced concepts.
            </p>
            <ul className="space-y-3 mb-6">
              {['Sorting Algorithms', 'Searching Algorithms', 'Graph Algorithms', 'Dynamic Programming'].map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <ChevronRight size={16} className="text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button className="mt-auto w-full">Explore Courses</Button>
          </div>
          
          {/* Video tutorials */}
          <div className="glass-card p-6 flex flex-col h-full">
            <div className="p-3 bg-primary/10 rounded-md w-fit mb-4">
              <VideoIcon size={24} className="text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Video Tutorials</h2>
            <p className="text-muted-foreground mb-6 flex-grow">
              Visual explanations and step-by-step walkthroughs of complex algorithms and data structures.
            </p>
            <ul className="space-y-3 mb-6">
              {['Introduction to Algorithm Analysis', 'Understanding Time Complexity', 'Recursion Fundamentals', 'Advanced Data Structures'].map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <ChevronRight size={16} className="text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="mt-auto w-full">Watch Tutorials</Button>
          </div>
          
          {/* Interactive guides */}
          <div className="glass-card p-6 flex flex-col h-full">
            <div className="p-3 bg-primary/10 rounded-md w-fit mb-4">
              <BookOpen size={24} className="text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Interactive Guides</h2>
            <p className="text-muted-foreground mb-6 flex-grow">
              Learn by doing with our hands-on interactive guides and coding challenges.
            </p>
            <ul className="space-y-3 mb-6">
              {['Binary Search Step-by-Step', 'Building a Linked List', 'Hash Table Internals', 'Balancing Binary Trees'].map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <ChevronRight size={16} className="text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button variant="secondary" className="mt-auto w-full">Try Interactive Guides</Button>
          </div>
          
          {/* Cheatsheets */}
          <div className="glass-card p-6 flex flex-col h-full">
            <div className="p-3 bg-primary/10 rounded-md w-fit mb-4">
              <FileText size={24} className="text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Cheatsheets & References</h2>
            <p className="text-muted-foreground mb-6 flex-grow">
              Quick-reference materials to help you recall key algorithms and data structures.
            </p>
            <ul className="space-y-3 mb-6">
              {['Big O Notation Reference', 'Sorting Algorithm Comparison', 'Data Structure Selection Guide', 'Algorithm Pattern Templates'].map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <ChevronRight size={16} className="text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="mt-auto w-full">Download Cheatsheets</Button>
          </div>
          
          {/* Premium content */}
          <div className="glass-card p-6 flex flex-col h-full border-2 border-primary/20">
            <div className="p-3 bg-primary/10 rounded-md w-fit mb-4">
              <Star size={24} className="text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Premium Content</h2>
            <p className="text-muted-foreground mb-6 flex-grow">
              Unlock exclusive learning resources and advanced visualizations with AlgoViz Pro.
            </p>
            <ul className="space-y-3 mb-6">
              {['Advanced Algorithm Masterclass', 'Interview Preparation Kit', 'Real-world Case Studies', 'Personalized Learning Paths'].map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <ChevronRight size={16} className="text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/pro" className="mt-auto w-full">
              <Button variant="default" className="w-full bg-gradient-to-r from-primary to-purple-600">
                Upgrade to Pro
              </Button>
            </Link>
          </div>
          
          {/* Community */}
          <div className="glass-card p-6 flex flex-col h-full">
            <div className="p-3 bg-primary/10 rounded-md w-fit mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M17 7.82v4.15c0 2.38-4.1 4.32-9.17 4.32S-1.34 14.36-1.34 12V7.82M17 7.82c0 2.38-4.1 4.32-9.17 4.32S-1.34 10.21-1.34 7.82M17 7.82C17 5.46 12.9 3.5 7.83 3.5S-1.34 5.46-1.34 7.82" transform="translate(4 .5)" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Community Resources</h2>
            <p className="text-muted-foreground mb-6 flex-grow">
              Join our community to discuss algorithms, share insights, and learn from peers.
            </p>
            <ul className="space-y-3 mb-6">
              {['Forum Discussions', 'Code Review Exchanges', 'Monthly Challenges', 'Community Contributions'].map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <ChevronRight size={16} className="text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button variant="secondary" className="mt-auto w-full">Join Community</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LearnPage;
