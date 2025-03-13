
import React from 'react';
import { motion } from 'framer-motion';

interface QueueRendererProps {
  queue: any[];
}

export const QueueRenderer: React.FC<QueueRendererProps> = ({ queue }) => {
  return (
    <div className="flex flex-col items-center">
      {queue.length > 0 ? (
        <>
          <div className="flex justify-between w-full max-w-md mb-2">
            <motion.div 
              className="px-2 py-1 text-xs font-medium bg-primary/20 rounded-md"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              Front
            </motion.div>
            <motion.div 
              className="px-2 py-1 text-xs font-medium bg-secondary/50 rounded-md"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              Rear
            </motion.div>
          </div>
          <div className="flex flex-row-reverse items-center justify-center">
            {queue.map((item, index) => (
              <motion.div 
                key={index} 
                className={`w-16 h-12 flex items-center justify-center border border-primary/50 rounded-md mx-1 ${
                  index === 0 ? 'bg-primary/20' : 
                  index === queue.length - 1 ? 'bg-secondary/30' : 
                  'bg-primary/10'
                }`}
                initial={{ 
                  opacity: 0, 
                  x: index === 0 ? -50 : index === queue.length - 1 ? 50 : 0,
                  y: 20
                }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20, 
                  delay: index * 0.05 
                }}
                whileHover={{ 
                  scale: 1.1,
                  zIndex: 10,
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)" 
                }}
              >
                {item}
              </motion.div>
            ))}
          </div>
          <motion.div 
            className="w-full max-w-md h-1 bg-gradient-to-r from-primary/50 to-secondary/50 mt-3 rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        </>
      ) : (
        <div className="text-muted-foreground">Queue is empty</div>
      )}
    </div>
  );
};
