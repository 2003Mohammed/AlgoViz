
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { DataStructureVisualizer } from '../components/data-structure-visualizer/DataStructureVisualizer';
import { dataStructures } from '../utils/dataStructureData';
import { ArrowLeft, ChevronRight, Database, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const DataStructuresPage = () => {
  const { structureId } = useParams<{ structureId?: string }>();
  const navigate = useNavigate();
  
  const dataStructure = structureId 
    ? dataStructures.find(ds => ds.id === structureId)
    : null;

  if (structureId && !dataStructure) {
    navigate('/data-structures', { replace: true });
    return null;
  }

  return (
    <Layout>
      <div className="container py-8">
        {dataStructure ? (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <motion.button
                  onClick={() => navigate('/data-structures')}
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  whileHover={{ x: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="mr-1 h-4 w-4" /> Back to Data Structures
                </motion.button>
                <div className="text-muted-foreground">
                  <ChevronRight className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{dataStructure.name}</span>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <motion.h1 
                  className="heading-lg pixel-header neon-text"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Database className="inline-block mr-2 h-8 w-8 text-primary" />
                  {dataStructure.name}
                </motion.h1>
                <motion.div 
                  className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-full"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span>Interactive Visualization</span>
                </motion.div>
              </div>
              
              <motion.p 
                className="mt-2 text-muted-foreground max-w-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {dataStructure.description}
              </motion.p>
            </div>
            
            <DataStructureVisualizer dataStructure={dataStructure} />
          </>
        ) : (
          <>
            <motion.h1 
              className="heading-lg text-center mb-10 neon-text pixel-header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Database className="inline-block mr-2 h-8 w-8 text-primary" />
              Choose a Data Structure to Visualize
            </motion.h1>
            
            <motion.div
              className="glass-card p-8 circuit-pattern"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dataStructures.map((ds, index) => (
                  <motion.div
                    key={ds.id}
                    className="p-4 border-2 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer pixel-border"
                    onClick={() => navigate(`/data-structures/${ds.id}`)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ 
                      scale: 1.03, 
                      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                      y: -5 
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded-md text-primary">
                        <Database className="h-5 w-5" />
                      </div>
                      <h3 className="font-medium">{ds.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {ds.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default DataStructuresPage;
