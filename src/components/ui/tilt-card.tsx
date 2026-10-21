"use client";

import React, { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // Maximum rotation in degrees
  glareEffect?: boolean;
}

export function TiltCard({
  children,
  className = "",
  maxTilt = 12,
  glareEffect = true,
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, opacity: 0 });

  const springConfig = { damping: 20, stiffness: 200 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = ((y - centerY) / centerY) * -maxTilt;
    const tiltY = ((x - centerX) / centerX) * maxTilt;

    rotateX.set(tiltX);
    rotateY.set(tiltY);

    setMousePos({
      x,
      y,
      opacity: glareEffect ? 1 : 0,
    });
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setMousePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      style={{ perspective: 1000 }}
      className="transform-gpu"
    >
      <motion.div
        ref={cardRef}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`relative overflow-hidden rounded-3xl bg-surface border border-border/80 shadow-sm transition-colors duration-300 ${className}`}
        {...(props as any)}
      >
        {/* Dynamic mouse spotlight glare */}
        {glareEffect && (
          <div
            className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
            style={{
              opacity: mousePos.opacity,
              background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, var(--primary-glow), transparent 70%)`,
            }}
            aria-hidden="true"
          />
        )}
        <div className="relative z-0 h-full">{children}</div>
      </motion.div>
    </div>
  );
}
