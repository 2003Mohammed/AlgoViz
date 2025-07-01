
import React, { useState } from 'react';
import { ChevronDown, Globe, Code, Database, MapPin, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DataStructure } from '../../../utils/dataStructureData';

interface RealWorldApplicationsProps {
  dataStructure: DataStructure;
}

const realWorldApplications = {
  'array': [
    { icon: <Database className="h-4 w-4" />, title: 'Image Processing', description: 'Pixel data storage in images and videos' },
    { icon: <Code className="h-4 w-4" />, title: 'Game Development', description: 'Game boards, inventories, and tile maps' },
    { icon: <Layers className="h-4 w-4" />, title: 'Data Analysis', description: 'Spreadsheet data and mathematical computations' }
  ],
  'linked-list': [
    { icon: <Globe className="h-4 w-4" />, title: 'Web Browsers', description: 'Browser history navigation (back/forward)' },
    { icon: <Code className="h-4 w-4" />, title: 'Music Players', description: 'Playlist management and song sequences' },
    { icon: <Database className="h-4 w-4" />, title: 'Memory Management', description: 'Dynamic memory allocation in operating systems' }
  ],
  'stack': [
    { icon: <Code className="h-4 w-4" />, title: 'Undo Operations', description: 'Text editors, image editors, and IDEs' },
    { icon: <Globe className="h-4 w-4" />, title: 'Function Calls', description: 'Call stack in programming languages' },
    { icon: <Layers className="h-4 w-4" />, title: 'Expression Evaluation', description: 'Mathematical expression parsing and evaluation' }
  ],
  'queue': [
    { icon: <Database className="h-4 w-4" />, title: 'Job Scheduling', description: 'CPU task scheduling and print job queues' },
    { icon: <Globe className="h-4 w-4" />, title: 'Web Servers', description: 'Request handling in web applications' },
    { icon: <Code className="h-4 w-4" />, title: 'Breadth-First Search', description: 'Graph traversal and shortest path algorithms' }
  ],
  'binary-tree': [
    { icon: <Database className="h-4 w-4" />, title: 'Database Indexing', description: 'B-trees in database management systems' },
    { icon: <Code className="h-4 w-4" />, title: 'File Systems', description: 'Directory structure organization' },
    { icon: <Layers className="h-4 w-4" />, title: 'Decision Trees', description: 'Machine learning and AI decision making' }
  ],
  'hash-table': [
    { icon: <Database className="h-4 w-4" />, title: 'Database Indexing', description: 'Fast data retrieval and caching systems' },
    { icon: <Globe className="h-4 w-4" />, title: 'Web Applications', description: 'Session management and user authentication' },
    { icon: <Code className="h-4 w-4" />, title: 'Compilers', description: 'Symbol tables and variable lookup' }
  ],
  'graph': [
    { icon: <MapPin className="h-4 w-4" />, title: 'GPS Navigation', description: 'Route finding and traffic optimization' },
    { icon: <Globe className="h-4 w-4" />, title: 'Social Networks', description: 'Friend connections and recommendation systems' },
    { icon: <Database className="h-4 w-4" />, title: 'Network Topology', description: 'Internet routing and network analysis' }
  ]
};

export const RealWorldApplications: React.FC<RealWorldApplicationsProps> = ({ dataStructure }) => {
  const [isOpen, setIsOpen] = useState(false);
  const applications = realWorldApplications[dataStructure.id] || [];

  if (applications.length === 0) return null;

  return (
    <div className="bg-muted/30 rounded-lg p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left hover:bg-muted/50 p-2 rounded-md transition-colors"
      >
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <span className="font-medium">Real World Applications</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-3"
          >
            {applications.map((app, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-background rounded-lg"
              >
                <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
                  {app.icon}
                </div>
                <div>
                  <h4 className="font-medium text-sm">{app.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{app.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
