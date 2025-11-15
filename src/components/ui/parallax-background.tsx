'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

// A more neutral, calming background with subtle movement.
export function ParallaxBackground() {
  const { scrollY } = useScroll();

  // Create a parallax effect by moving the background elements at different speeds.
  // The values [-200, 200] and [-100, 100] can be adjusted to change the parallax intensity.
  const y1 = useTransform(scrollY, [0, 500], [0, -100]); // Slower layer
  const y2 = useTransform(scrollY, [0, 500], [0, -250]); // Faster layer
  const y3 = useTransform(scrollY, [0, 500], [0, -50]); // Very slow layer


  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-slate-900 overflow-hidden">
      <motion.div
        className="absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: 'url(/assets/noise.png)', // Subtle noise texture
          backgroundRepeat: 'repeat', 
          y: y1,
        }}
      />
      <motion.div 
        className="absolute bottom-0 left-[-20%] right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,255,255,0.08),rgba(255,255,255,0))]"
        style={{ y: y2, x: 150 }}
      />
      <motion.div
        className="absolute bottom-[-10%] left-[20%] h-[300px] w-[600px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,255,255,0.06),rgba(255,255,255,0))]"
        style={{ y: y3, x: -100 }}
      />
    </div>
  );
}

