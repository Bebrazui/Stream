import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import React, { useRef } from "react";

interface LiquidGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * A component that creates a "liquid glass" effect.
 * It features a backdrop blur, inner shadow, and a glare that follows the mouse.
 * It also has a subtle scaling effect on hover.
 */
const LiquidGlass = React.forwardRef<HTMLDivElement, LiquidGlassProps>(
  ({ className, children, ...props }, ref) => {
    const localRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Ensure we have a ref to work with
    const divRef = (ref || localRef) as React.RefObject<HTMLDivElement>;

    function handleMouseMove({ clientX, clientY }: React.MouseEvent) {
      if (divRef.current) {
        const { left, top } = divRef.current.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
      }
    }

    // Springs for smooth, physical animations
    const hoverScale = useSpring(1, { stiffness: 400, damping: 30 });
    const glareOpacity = useSpring(0, { stiffness: 200, damping: 20 });

    return (
      <motion.div
        ref={divRef}
        onMouseMove={handleMouseMove}
        onHoverStart={() => {
          hoverScale.set(1.03);
          glareOpacity.set(1);
        }}
        onHoverEnd={() => {
          hoverScale.set(1);
          glareOpacity.set(0);
        }}
        style={{ scale: hoverScale }}
        className={cn(
          "relative rounded-3xl border border-white/20 bg-white/10 shadow-glass-reflex backdrop-blur-xl",
          // The magical inner glow from tailwind.config.ts
          "shadow-glass-inset",
          className
        )}
        {...props}
      >
        {/* This creates the moving glare effect */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-3xl"
          style={{
            opacity: glareOpacity,
            background: useMotionTemplate`
              radial-gradient(
                400px circle at ${mouseX}px ${mouseY}px,
                rgba(240, 248, 255, 0.2), /* silver-glow with alpha */
                transparent 80%
              )
            `,
          }}
        />
        {/* Ensure content is above the glare */}
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    );
  }
);

LiquidGlass.displayName = "LiquidGlass";

export { LiquidGlass };
