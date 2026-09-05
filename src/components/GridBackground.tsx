import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

const PHYSICS = {
  slow: { damping: 40, stiffness: 150, mass: 1.2 },
  cursor: { damping: 25, stiffness: 250, mass: 0.5 },
};

const MotionPattern = motion.pattern;
const MotionPath = motion.path;

function GridLayer({
  gridSize,
  x,
  y,
  strokeColor,
  strokeWidth = 1,
}: {
  gridSize: MotionValue<number>;
  x: MotionValue<number>;
  y: MotionValue<number>;
  strokeColor: string;
  strokeWidth?: number;
}) {
  const patternId = React.useId();
  const pathD = useTransform(gridSize, (s) => `M ${s} 0 L 0 0 0 ${s}`);
  return (
    <svg className="absolute inset-0 w-full h-full">
      <defs>
        <MotionPattern
          id={patternId}
          width={gridSize}
          height={gridSize}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <MotionPath d={pathD} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
        </MotionPattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

/**
 * Fixed, full-viewport reactive grid that sits behind all page content.
 * Fades in once the user scrolls past the hero.
 */
export default function GridBackground({
  gridSize = 100,
  scrollSpeed = 0.4,
  maskRadius = 380,
}: {
  gridSize?: number;
  scrollSpeed?: number;
  maskRadius?: number;
}) {
  const [visible, setVisible] = useState(false);
  const [size, setSize] = useState({ w: 1920, h: 1080 });

  const gridX = useMotionValue(0);
  const gridY = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const velocityX = useMotionValue(0);
  const velocityY = useMotionValue(0);
  const prevX = useRef(0);
  const prevY = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const setDims = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    setDims();
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);
    prevX.current = window.innerWidth / 2;
    prevY.current = window.innerHeight / 2;

    const onMove = (e: MouseEvent) => {
      velocityX.set(e.clientX - prevX.current);
      velocityY.set(e.clientY - prevY.current);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      prevX.current = e.clientX;
      prevY.current = e.clientY;
    };
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.55);

    onScroll();
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", setDims);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", setDims);
    };
  }, [mouseX, mouseY, velocityX, velocityY]);

  const lagX = useSpring(mouseX, PHYSICS.cursor);
  const lagY = useSpring(mouseY, PHYSICS.cursor);
  const sprungVelX = useSpring(velocityX, PHYSICS.slow);
  const sprungVelY = useSpring(velocityY, PHYSICS.slow);

  const rotateX = useSpring(useTransform(mouseY, [0, size.h], [6, -6]), PHYSICS.slow);
  const rotateY = useSpring(useTransform(mouseX, [0, size.w], [-6, 6]), PHYSICS.slow);

  const cellSize = useMotionValue(gridSize);

  useAnimationFrame((_, delta) => {
    const safeDelta = Math.min(delta, 100);
    const nvx = Math.max(-2, Math.min(2, sprungVelX.get() / 100));
    const nvy = Math.max(-2, Math.min(2, sprungVelY.get() / 100));
    const cs = cellSize.get();
    gridX.set((gridX.get() + nvx * scrollSpeed * (safeDelta / 16)) % cs);
    gridY.set((gridY.get() + (nvy - 0.3) * scrollSpeed * (safeDelta / 16)) % cs);
  });

  const maskImage = useMotionTemplate`radial-gradient(${maskRadius}px circle at ${lagX}px ${lagY}px, rgb(255,255,255), transparent)`;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-700"
      style={{ opacity: visible ? 1 : 0, perspective: 1000 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 opacity-25">
          <GridLayer gridSize={cellSize} x={gridX} y={gridY} strokeColor="oklch(0.97 0.005 270 / 10%)" />
        </div>
        <motion.div className="absolute inset-0" style={{ maskImage, WebkitMaskImage: maskImage }}>
          <GridLayer
            gridSize={cellSize}
            x={gridX}
            y={gridY}
            strokeColor="oklch(0.78 0.18 295 / 70%)"
            strokeWidth={1.2}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
