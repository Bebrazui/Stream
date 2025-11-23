'use client';

import React, { forwardRef, ElementType, ReactNode } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LiquidGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  motionProps?: MotionProps;
}

const LiquidGlass = forwardRef<HTMLDivElement, LiquidGlassProps>((
  { as: Component = 'div', children, className, motionProps, ...restProps },
  ref
) => {
  const MotionComponent = motion(Component);

  return (
    <MotionComponent
      ref={ref}
      className={cn(
        'relative', // Base class
        'overflow-hidden', // Clip the inner pseudo-elements
        'rounded-lg', // Default rounding
        'z-10', // Ensure it's above other content
        className // Allow overriding
      )}
      {...motionProps}
      {...restProps}
    >
      {/* Top-left glow */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-64 md:h-64 bg-primary/20 dark:bg-primary/30 opacity-50 blur-3xl rounded-full -z-10" />
      {/* Bottom-right glow */}
      <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-32 h-32 md:w-64 md:h-64 bg-secondary/20 dark:bg-secondary/30 opacity-50 blur-3xl rounded-full -z-10" />
      
      {/* Content */}
      {children}
    </MotionComponent>
  );
});

LiquidGlass.displayName = "LiquidGlass";

export default LiquidGlass;
