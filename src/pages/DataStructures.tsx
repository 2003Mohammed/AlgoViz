
import React from 'react';
import { Layout } from '../components/Layout';
import { DataStructureGrid } from '../components/DataStructureGrid';

const DataStructures = () => {
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Data Structure Visualizations</h1>
        <DataStructureGrid />
      </div>
    </Layout>
  );
};

export default DataStructures;
