
import React from 'react';
import { Button } from '../../ui/button';
import { ExternalLink } from 'lucide-react';
import { DataStructure } from '../../../utils/dataStructureData';
import { motion } from 'framer-motion';

interface ReferenceSectionProps {
  dataStructure: DataStructure;
}

export const ReferenceSection: React.FC<ReferenceSectionProps> = ({ dataStructure }) => {
  const getReferenceLinks = () => {
    const structureName = dataStructure.name.toLowerCase().replace(/\s+/g, '-');
    
    // Priority-based reference links
    const links = [];
    
    // W3Schools (replacing MDN)
    const w3schoolsTopics = ['array', 'object', 'set', 'map', 'linked-list', 'stack', 'queue', 'tree', 'graph'];
    if (w3schoolsTopics.some(topic => structureName.includes(topic))) {
      let w3schoolsUrl = '';
      if (structureName.includes('array')) {
        w3schoolsUrl = 'https://www.w3schools.com/js/js_arrays.asp';
      } else if (structureName.includes('object')) {
        w3schoolsUrl = 'https://www.w3schools.com/js/js_objects.asp';
      } else if (structureName.includes('set')) {
        w3schoolsUrl = 'https://www.w3schools.com/js/js_sets.asp';
      } else if (structureName.includes('map')) {
        w3schoolsUrl = 'https://www.w3schools.com/js/js_maps.asp';
      } else if (structureName.includes('linked-list')) {
        w3schoolsUrl = 'https://www.w3schools.com/dsa/dsa_theory_linkedlist.php';
      } else if (structureName.includes('stack')) {
        w3schoolsUrl = 'https://www.w3schools.com/dsa/dsa_theory_stack.php';
      } else if (structureName.includes('queue')) {
        w3schoolsUrl = 'https://www.w3schools.com/dsa/dsa_theory_queue.php';
      } else if (structureName.includes('tree')) {
        w3schoolsUrl = 'https://www.w3schools.com/dsa/dsa_theory_tree.php';
      } else if (structureName.includes('graph')) {
        w3schoolsUrl = 'https://www.w3schools.com/dsa/dsa_theory_graph.php';
      }
      
      if (w3schoolsUrl) {
        links.push({
          title: 'W3Schools',
          url: w3schoolsUrl,
          description: 'Interactive learning and examples'
        });
      }
    }
    
    // GeeksforGeeks (always available)
    links.push({
      title: 'GeeksforGeeks',
      url: `https://www.geeksforgeeks.org/${structureName}/`,
      description: 'Detailed tutorials and practice problems'
    });
    
    // Add algorithm-specific references
    if (structureName.includes('graph')) {
      links.push({
        title: 'Graph Algorithms',
        url: 'https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/',
        description: 'Complete guide to graph algorithms'
      });
    }
    
    if (structureName.includes('tree')) {
      links.push({
        title: 'Tree Algorithms',
        url: 'https://www.geeksforgeeks.org/binary-tree-data-structure/',
        description: 'Binary tree operations and traversals'
      });
    }
    
    return links;
  };

  const referenceLinks = getReferenceLinks();

  return (
    <motion.div 
      className="bg-muted rounded-lg p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h3 className="text-lg font-semibold mb-3">Learn More</h3>
      <div className="space-y-3">
        {referenceLinks.map((link, index) => (
          <motion.div
            key={link.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-background rounded border"
          >
            <div>
              <h4 className="font-medium">{link.title}</h4>
              <p className="text-sm text-muted-foreground">{link.description}</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
