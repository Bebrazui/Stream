'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import React from 'react';

// A simple component to render a single blurred shape
const BlurredShape = ({ className }: { className: string }) => (
  <div className={`absolute rounded-full filter blur-3xl ${className}`} />
);

const ParallaxBackground = () => {
  // No need to create a motion component, just use motion.div directly
  const { scrollYProgress } = useScroll();

  // Create a layered effect by moving different layers at different speeds.
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
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
          duration: 20,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      />

      {/* Abstract Shapes Layer 1 */}
      <motion.div className="absolute inset-0 opacity-20" style={{ y: y1 }}>
        <BlurredShape className="top-[10%] left-[10%] w-64 h-64 bg-neon-soft-pink" />
        <BlurredShape className="bottom-[20%] right-[15%] w-80 h-80 bg-neon-sky-blue" />
      </motion.div>

      {/* Abstract Shapes Layer 2 */}
      <motion.div className="absolute inset-0 opacity-20" style={{ y: y2 }}>
        <BlurredShape className="top-[40%] right-[30%] w-72 h-72 bg-neon-lilac" />
        <BlurredShape className="bottom-[5%] left-[25%] w-56 h-56 bg-neon-sky-blue" />
      </motion.div>
    </div>
  );
};

export default ParallaxBackground;
