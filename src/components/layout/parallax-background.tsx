'use client'; // This is a client component

import { useScroll, useTransform, motion } from 'framer-motion';
import React from 'react';

const ParallaxBackground = () => {
  const { scrollYProgress } = useScroll();

  // Create a layered effect by moving different layers at different speeds.
  // Layer 1: The furthest back, moves the slowest.
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  // Layer 2: A bit closer, moves a bit faster.
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);

  return (
    <div className="fixed inset-0 -z-50">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(135deg, #A3D5FF 0%, #FBC7D4 50%, #C8B6E2 100%)',
            'linear-gradient(135deg, #C8B6E2 0%, #A3D5FF 50%, #FBC7D4 100%)',
            'linear-gradient(135deg, #FBC7D4 0%, #C8B6E2 50%, #A3D5FF 100%)',
            'linear-gradient(135deg, #A3D5FF 0%, #FBC7D4 50%, #C8B6E2 100%)',
          ],
        }}
        transition={{
          duration: 20, // A slow, mesmerizing transition
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      />

      {/* Abstract Shapes Layer 1 */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{ y: y1 }}
      >
        {/* These could be replaced with SVG shapes for more complex visuals */}
        <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-neon-soft-pink rounded-full filter blur-3xl" />
        <div className="absolute bottom-[20%] right-[15%] w-80 h-80 bg-neon-sky-blue rounded-full filter blur-3xl" />
      </motion.div>

      {/* Abstract Shapes Layer 2 */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{ y: y2 }}
      >
        <div className="absolute top-[40%] right-[30%] w-72 h-72 bg-neon-lilac rounded-full filter blur-3xl" />
        <div className="absolute bottom-[5%] left-[25%] w-56 h-56 bg-neon-sky-blue rounded-full filter blur-3xl" />
      </motion.div>
    </div>
  );
};

export default ParallaxBackground;
