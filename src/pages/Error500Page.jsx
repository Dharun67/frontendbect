import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Error500Page = () => {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color, #f8fafc)', color: 'var(--text-color, #1e293b)' }}>
      <motion.h1 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{ fontSize: '6rem', margin: 0, color: '#b91c1c' }}
      >
        500
      </motion.h1>
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ fontSize: '2rem', marginTop: '1rem' }}
      >
        Internal Server Error
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ color: '#64748b', marginBottom: '2rem' }}
      >
        Oops! Something went wrong on our end. Please try again later.
      </motion.p>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link to="/" style={{ padding: '12px 24px', backgroundColor: '#1e3a8a', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
          Return Home
        </Link>
      </motion.div>
    </div>
  );
};

export default Error500Page;
