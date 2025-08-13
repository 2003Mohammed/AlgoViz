// src/components/FloatingParticles.tsx
import React from 'react';
import { motion } from 'framer-motion';

const FloatingParticles: React.FC = () => {
  const colors = ['#0ea5e9', '#a855f7', '#14b8a6', '#f59e0b', '#ef4444'];

  const generateParticles = () =>
    Array.from({ length: 25 }).map((_, i) => {
      const size = Math.floor(Math.random() * 12) + 8;
      const left = Math.floor(Math.random() * 100);
      const top = Math.floor(Math.random() * 100);
      const duration = Math.random() * 10 + 10;
      const color = colors[i % colors.length];

      return (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-30 blur-2xl"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            top: `${top}%`,
            left: `${left}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            x: [0, 10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration,
            ease: 'easeInOut',
          }}
        />
      );
    });

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {generateParticles()}
    </div>
  );
};

export default FloatingParticles;
