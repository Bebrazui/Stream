'use client';

import { forwardRef, MouseEvent } from 'react';
import { motion, useMotionTemplate, useMotionValue, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import React from 'react';

// Define a props interface that inherits from Framer Motion's props
// but explicitly sets the type for `children` to `React.ReactNode`
// to resolve the type conflict.
interface LiquidGlassButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children?: React.ReactNode;
}

const LiquidGlassButton = forwardRef<
  HTMLButtonElement,
  LiquidGlassButtonProps
>(({ className, children, ...props }, forwardedRef) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const spotlightStyle = useMotionTemplate`
    radial-gradient(
      200px circle at ${mouseX}px ${mouseY}px,
      rgba(255, 255, 255, 0.2),
      transparent 80%
    )
  `;

  return (
    <motion.button
      ref={forwardedRef}
      onMouseMove={handleMouseMove}
      style={{
        WebkitTapHighlightColor: "transparent",
      }}
      className={cn(
        'group relative rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-white shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out',
        'hover:border-white/30 hover:bg-white/15 hover:shadow-2xl',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
        className
      )}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: spotlightStyle,
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
});

LiquidGlassButton.displayName = 'LiquidGlassButton';

export { LiquidGlassButton };
