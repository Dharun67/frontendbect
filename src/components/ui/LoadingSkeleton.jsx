import React from 'react';
import { motion } from 'framer-motion';

const LoadingSkeleton = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <motion.div 
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
        style={{ height: '40px', width: '30%', backgroundColor: '#e2e8f0', borderRadius: '8px', marginBottom: '2rem' }}
      />
      <div style={{ display: 'flex', gap: '2rem' }}>
        <motion.div 
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1, repeatType: "reverse", delay: 0.2 }}
          style={{ height: '300px', width: '25%', backgroundColor: '#e2e8f0', borderRadius: '8px' }}
        />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3, 4].map(i => (
            <motion.div 
              key={i}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 1, repeatType: "reverse", delay: 0.1 * i }}
              style={{ height: '60px', width: '100%', backgroundColor: '#e2e8f0', borderRadius: '8px' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
