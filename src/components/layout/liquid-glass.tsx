'use client';

import React, { forwardRef, ElementType, ComponentPropsWithRef, ReactNode } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

// ---- Polymorphic Component Types ----

type PolymorphicRef<C extends ElementType> = ComponentPropsWithRef<C>['ref'];

type AsProp<C extends ElementType> = {
  as?: C;
};

type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProp<C extends ElementType, Props = {}> = 
  AsProp<C> &
  Omit<ComponentPropsWithRef<C>, PropsToOmit<C, Props>> & {
    children?: ReactNode;
  } & Props;

// ---- LiquidGlass Specific Props ----

interface LiquidGlassOwnProps {
  className?: string;
  motionProps?: MotionProps;
}

type LiquidGlassProps<C extends ElementType> = PolymorphicComponentProp<C, LiquidGlassOwnProps>;

// ---- Component Implementation ----

type LiquidGlassComponent = <C extends ElementType = 'div'>(
  props: LiquidGlassProps<C> & { ref?: PolymorphicRef<C> }
) => React.ReactElement | null;

const LiquidGlass: LiquidGlassComponent = forwardRef(
  <C extends ElementType = 'div'>(
    { as, children, className, motionProps, ...restProps }: LiquidGlassProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';

    const MotionComponent = motion(Component as any);

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
  }
);

// ---- Display Name for Debugging ----
(LiquidGlass as React.FC).displayName = "LiquidGlass";

export default LiquidGlass;
