
import React from 'react';
import { Layout } from '../components/Layout';
import { Hero } from '../components/Hero';
import { AlgorithmGrid } from '../components/AlgorithmGrid';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <section className="container py-20">
        <h2 className="heading-lg text-center mb-10">
          Explore Algorithms
        </h2>
        <AlgorithmGrid />
      </section>
    </Layout>
  );
};

export default Index;
