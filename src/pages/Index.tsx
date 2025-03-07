
import React from 'react';
import { Layout } from '../components/Layout';
import { Hero } from '../components/Hero';
import { AlgorithmGrid } from '../components/AlgorithmGrid';
import { DataStructureGrid } from '../components/DataStructureGrid';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      <Hero />
      
      <section className="container py-20">
        <h2 className="heading-lg text-center mb-10">
          Explore Algorithms
        </h2>
        <div className="mb-6">
          <AlgorithmGrid />
        </div>
        <div className="flex justify-center mt-8">
          <Link to="/visualizer">
            <Button className="flex items-center gap-2">
              View All Algorithms
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
      
      <section className="container py-20 bg-secondary/10">
        <h2 className="heading-lg text-center mb-10">
          Explore Data Structures
        </h2>
        <div className="mb-6">
          <DataStructureGrid />
        </div>
        <div className="flex justify-center mt-8">
          <Link to="/data-structures">
            <Button variant="outline" className="flex items-center gap-2">
              View All Data Structures
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
