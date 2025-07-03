
import React from 'react';
import { Button } from '../../ui/button';
import { ExternalLink } from 'lucide-react';
import { DataStructure } from '../../../utils/dataStructureData';
import { motion } from 'framer-motion';

interface ReferenceSectionProps {
  dataStructure: DataStructure;
}

export const ReferenceSection: React.FC<ReferenceSectionProps> = ({ dataStructure }) => {
  const referenceLinks = [
    {
      title: 'MDN Web Docs',
      url: `https://developer.mozilla.org/en-US/search?q=${dataStructure.name}`,
      description: 'Comprehensive documentation and examples'
    },
    {
      title: 'GeeksforGeeks',
      url: `https://www.geeksforgeeks.org/${dataStructure.name.toLowerCase().replace(/\s+/g, '-')}/`,
      description: 'Detailed tutorials and practice problems'
    },
    {
      title: 'W3Schools',
      url: `https://www.w3schools.com/`,
      description: 'Interactive learning and examples'
    }
  ];

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
