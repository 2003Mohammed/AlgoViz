
import React from 'react';
import { Layout } from '../components/Layout';
import { motion } from 'framer-motion';
import { Code, Cpu, Zap } from 'lucide-react';

const PlaygroundPage = () => {
  return (
    <Layout>
      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex justify-center mb-8">
            <motion.div 
              className="p-4 bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 rounded-2xl backdrop-blur-xl border border-neon-blue/20"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 30px rgba(0, 212, 255, 0.3)"
              }}
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <Code className="h-12 w-12 text-neon-blue" />
            </motion.div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-8 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
            Algorithm Playground
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed font-body max-w-2xl mx-auto">
            Experiment with algorithms in a sandbox environment. Test your own implementations, 
            modify existing algorithms, and see the results in real-time.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {[
              {
                icon: Code,
                title: "Code Editor",
                description: "Write and test your own algorithm implementations with syntax highlighting",
                color: "neon-blue"
              },
              {
                icon: Cpu,
                title: "Performance Testing",
                description: "Benchmark your algorithms and compare performance metrics",
                color: "neon-purple"
              },
              {
                icon: Zap,
                title: "Real-time Visualization",
                description: "See your custom algorithms visualized as they execute",
                color: "neon-pink"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  y: -10
                }}
                className="group relative p-8 rounded-2xl bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border border-border/50 hover:border-neon-blue/30 transition-all duration-300"
              >
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-blue/5 to-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="relative z-10">
                  <motion.div 
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br from-${feature.color}/20 to-${feature.color}/10 flex items-center justify-center mb-6 mx-auto`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className={`h-8 w-8 text-${feature.color}`} />
                  </motion.div>
                  <h3 className="font-heading font-semibold text-xl mb-4 text-center">{feature.title}</h3>
                  <p className="text-muted-foreground text-center leading-relaxed font-body">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 p-8 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl border border-amber-500/20"
          >
            <h3 className="text-xl font-semibold mb-4 text-amber-400">Coming Soon!</h3>
            <p className="text-muted-foreground">
              The interactive playground is currently under development. Soon you'll be able to write, test, and visualize your own algorithms!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default PlaygroundPage;
