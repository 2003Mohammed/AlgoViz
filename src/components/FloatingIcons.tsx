
import React from 'react';
import { motion } from 'framer-motion';
import { Blocks, TreeDeciduous, Grid2x2, List, BarChart3, GitBranch } from 'lucide-react';

const iconVariants = {
  float: {
    y: [0, -20, 0],
    x: [0, 10, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  hover: {
    scale: 1.2,
    rotate: 15,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const FloatingIcon: React.FC<{ 
  Icon: any; 
  className?: string; 
  delay?: number;
  hoverAnimation?: any;
}> = ({ Icon, className = "", delay = 0, hoverAnimation }) => (
  <motion.div
    className={`absolute opacity-20 text-neon-blue ${className}`}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 0.2, scale: 1 }}
    variants={iconVariants}
    whileInView="float"
    whileHover={hoverAnimation || "hover"}
    transition={{ delay }}
  >
    <Icon size={48} />
  </motion.div>
);

export const FloatingIcons: React.FC = () => {
  const sortingAnimation = {
    scale: [1, 1.2, 1],
    y: [-5, -15, -5],
    transition: { duration: 0.8, repeat: 2 }
  };

  const treeAnimation = {
    scale: [1, 1.3, 1.1, 1],
    rotate: [0, 10, -5, 0],
    transition: { duration: 1, repeat: 1 }
  };

  const graphAnimation = {
    rotate: [0, 180, 360],
    scale: [1, 1.2, 1],
    transition: { duration: 1.5, repeat: 1 }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <FloatingIcon 
        Icon={Blocks} 
        className="top-20 left-10" 
        delay={0}
      />
      <FloatingIcon 
        Icon={TreeDeciduous} 
        className="top-32 right-20" 
        delay={1}
        hoverAnimation={treeAnimation}
      />
      <FloatingIcon 
        Icon={Grid2x2} 
        className="bottom-40 left-20" 
        delay={2}
      />
      <FloatingIcon 
        Icon={List} 
        className="bottom-20 right-10" 
        delay={3}
      />
      <FloatingIcon 
        Icon={BarChart3} 
        className="top-1/2 left-5" 
        delay={4}
        hoverAnimation={sortingAnimation}
      />
      <FloatingIcon 
        Icon={GitBranch} 
        className="top-3/4 right-1/4" 
        delay={5}
        hoverAnimation={graphAnimation}
      />
    </div>
  );
};
