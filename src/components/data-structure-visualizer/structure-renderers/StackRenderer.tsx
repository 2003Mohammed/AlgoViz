
import React from 'react';
import { motion } from 'framer-motion';

interface StackRendererProps {
  stack: any[];
}

export const StackRenderer: React.FC<StackRendererProps> = ({ stack }) => {
  return (
    <div className="flex flex-col gap-1 items-center">
      {stack.length > 0 ? (
        <>
          <motion.div 
            className="px-2 py-1 text-xs font-medium bg-primary/20 rounded-md mb-2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            Top
          </motion.div>
          <div className="relative">
            {stack.map((item, index) => (
              <motion.div 
                key={index} 
                className={`w-24 h-12 flex items-center justify-center border border-primary/50 rounded-md ${
                  index === 0 ? 'bg-primary/20' : 'bg-primary/10'
                } shadow-md`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  type: "spring",
                  damping: 15,
                  stiffness: 200,
                  delay: index * 0.08
                }}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  zIndex: 10
                }}
                style={{ 
                  marginBottom: "4px",
                  transform: `perspective(1000px) rotateX(${index * 2}deg)`
                }}
              >
                {item}
              </motion.div>
            ))}
          </div>
          <motion.div 
            className="border-b-2 border-primary/50 w-32 mt-1"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        </>
      ) : (
        <div className="text-muted-foreground">Stack is empty</div>
      )}
    </div>
  );
};
