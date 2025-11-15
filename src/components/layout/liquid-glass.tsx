'use client';

import { cn } from '@/lib/utils';
import { motion, MotionProps } from 'framer-motion';
import React from 'react';

// Define a type for the polymorphic 'as' prop
type AsProp<C extends React.ElementType> = {
  as?: C;
};

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

// This is the first polymorphic type
type PolymorphicComponentProp<
  C extends React.ElementType,
  Props = {}
> = React.PropsWithChildren<Props & AsProp<C>> & Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

// This is the second polymorphic type
type PolymorphicComponentPropWithRef<
  C extends React.ElementType,
  Props = {}
> = PolymorphicComponentProp<C, Props> & { ref?: PolymorphicRef<C> };

// This is the type for the 'ref'
type PolymorphicRef<C extends React.ElementType> = React.ComponentPropsWithRef<C>['ref'];

// Type for the combined props of LiquidGlass, including motion props
type LiquidGlassProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
  C,
  {
    className?: string;
    motionProps?: MotionProps;
  }
>;

// The generic type for the component
type LiquidGlassComponent = <C extends React.ElementType = 'div'>(
  props: LiquidGlassProps<C>
) => React.ReactElement | null;

// ---- Component Implementation ----

const LiquidGlass: LiquidGlassComponent = React.forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, className, motionProps, ...restProps }: LiquidGlassProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = motion(as as React.ElementType) || motion.div;

    return (
      <Component
        ref={ref}
        className={cn(
          'bg-white/60 dark:bg-black/60',
          'backdrop-blur-xl shadow-lg',
          'border border-white/20 dark:border-white/10',
          'transition-colors duration-300 ease-in-out',
          className
        )}
        {...motionProps}
        {...restProps}
      >
        {children}
      </Component>
    );
  }
);

LiquidGlass.displayName = 'LiquidGlass';

export { LiquidGlass };
