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
        'border border-white/20',
        'bg-white/10',
        'shadow-glass-reflex',
        'backdrop-blur-xl',
        'shadow-glass-inset',
        className
      )}
      {...motionProps}
      {...restProps}
    >
      {/* Optional: Add back glare or other motion effects here if needed */}
      <div className="relative z-10">
        {children}
      </div>
    </MotionComponent>
  );
});

LiquidGlass.displayName = "LiquidGlass";

export { LiquidGlass };
