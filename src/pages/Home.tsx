
import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { motion } from 'framer-motion';
import { Database, Zap, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const Home = () => {
  return (
    <Layout>
      <div className="container py-12">
        <motion.section 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AlgoViz
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Interactive visualizations for algorithms and data structures. Learn by seeing how they work step-by-step.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/algorithms">
                <Zap className="mr-2 h-5 w-5" />
                Explore Algorithms
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/data-structures">
                <Database className="mr-2 h-5 w-5" />
                Data Structures
              </Link>
            </Button>
          </div>
        </motion.section>

        <motion.section 
          className="grid md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Data Structures
              </CardTitle>
              <CardDescription>
                Visualize how data is organized and manipulated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li>• Arrays with sorting animations</li>
                <li>• Linked Lists with pointer visualization</li>
                <li>• Interactive operations</li>
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link to="/data-structures">
                  Start Learning <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Algorithms
              </CardTitle>
              <CardDescription>
                Watch algorithms solve problems step-by-step
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li>• Sorting algorithms with comparisons</li>
                <li>• Search algorithms with highlighting</li>
                <li>• Real-time complexity analysis</li>
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link to="/algorithms">
                  Explore Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </Layout>
  );
};

export default Home;
