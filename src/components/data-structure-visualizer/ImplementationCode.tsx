
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface ImplementationCodeProps {
  code: string;
}

export const ImplementationCode: React.FC<ImplementationCodeProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  if (!code) return null;

  return (
    <motion.div 
      className="bg-muted rounded-lg p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Implementation</h3>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
        </Button>
      </div>
      <pre className="bg-background p-4 rounded border overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </motion.div>
  );
};
