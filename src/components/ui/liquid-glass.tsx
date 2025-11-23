'use client';

import React, { forwardRef, ElementType, ReactNode, useRef, MouseEvent, useMemo } from 'react';
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
  forwardedRef
) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const MotionComponent = useMemo(() => motion(Component), [Component]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (internalRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      internalRef.current.style.setProperty('--mouse-x', `${x}px`);
      internalRef.current.style.setProperty('--mouse-y', `${y}px`);
    }
  };

  return (
    <MotionComponent
      ref={(node: HTMLDivElement) => {
        // @ts-ignore
        internalRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      }}
      onMouseMove={handleMouseMove}
      className={cn(
        'group',
        'relative',
        'overflow-hidden',
        'rounded-lg',
        'border border-white/10',
        'bg-white/10', // Увеличена прозрачность фона
        'shadow-glassmorphism',
        'backdrop-blur-xl', // Усилено размытие
        className
      )}
      {...motionProps}
      {...restProps}
    >
      <div 
        className="pointer-events-none absolute -inset-px rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px at var(--mouse-x, -200px) var(--mouse-y, -200px), rgba(255,255,255,0.15), transparent 40%)` // Немного усилен эффект свечения
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </MotionComponent>
  );
});

LiquidGlass.displayName = "LiquidGlass";

export { LiquidGlass };
