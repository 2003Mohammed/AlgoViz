
import React from 'react';
import { Layout } from '../components/Layout';
import { AlgorithmGrid } from '../components/AlgorithmGrid';

const Algorithms = () => {
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Algorithm Visualizations</h1>
        <AlgorithmGrid />
      </div>
    </Layout>
  );
};

export default Algorithms;
