import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
  useSpring,
  type MotionValue,
} from "framer-motion";

const PHYSICS = {
  slow: { damping: 40, stiffness: 150, mass: 1.2 },
  cursor: { damping: 25, stiffness: 250, mass: 0.5 },
  warp: { damping: 15, stiffness: 300, mass: 0.2 },
};

const NOISE_TEXTURE = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E`;

const MotionPattern = motion.pattern;
const MotionPath = motion.path;

interface GridLayerProps {
  gridSize: MotionValue<number>;
  x: MotionValue<number>;
  y: MotionValue<number>;
  strokeColor: string;
  strokeWidth?: number;
}

const GridLayer: React.FC<GridLayerProps> = React.memo(
  ({ gridSize, x, y, strokeColor, strokeWidth = 1 }) => {
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
            <MotionPath
              d={pathD}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
          </MotionPattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    );
  }
);
GridLayer.displayName = "GridLayer";

export interface MovingGridProps {
  gridSize?: number;
  scrollSpeed?: number;
  maskRadius?: number;
  className?: string;
  children?: React.ReactNode;
}

const MovingGrid: React.FC<MovingGridProps> = ({
  gridSize = 100,
  scrollSpeed = 0.4,
  maskRadius = 400,
  className = "",
  children,
}) => {
  const [isWarping, setIsWarping] = useState(false);
  const [windowSize, setWindowSize] = useState({ w: 1920, h: 1080 });

  const gridX = useMotionValue(0);
  const gridY = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const velocityX = useMotionValue(0);
  const velocityY = useMotionValue(0);

  const prevMouseX = useRef(0);
  const prevMouseY = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);
    prevMouseX.current = window.innerWidth / 2;
    prevMouseY.current = window.innerHeight / 2;
    const handleResize = () =>
      setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mouseX, mouseY]);

  const warpSignal = useSpring(0, PHYSICS.warp);

  const lagX = useSpring(mouseX, PHYSICS.cursor);
  const lagY = useSpring(mouseY, PHYSICS.cursor);

  const sprungVelX = useSpring(velocityX, PHYSICS.slow);
  const sprungVelY = useSpring(velocityY, PHYSICS.slow);

  const rotateXBase = useTransform(mouseY, [0, windowSize.h], [8, -8]);
  const rotateYBase = useTransform(mouseX, [0, windowSize.w], [-8, 8]);

  const finalRotateX = useTransform(
    [rotateXBase, warpSignal],
    ([r, w]) => (r as number) * (1 + (w as number) * 2)
  );
  const finalRotateY = useTransform(
    [rotateYBase, warpSignal],
    ([r, w]) => (r as number) * (1 + (w as number) * 2)
  );

  const sprungRotateX = useSpring(finalRotateX, PHYSICS.slow);
  const sprungRotateY = useSpring(finalRotateY, PHYSICS.slow);

  const animatedGridSize = useTransform(
    warpSignal,
    [0, 1],
    [gridSize, gridSize * 0.8]
  );
  const contentScale = useTransform(warpSignal, [0, 1], [1, 0.92]);

  useAnimationFrame((_, delta) => {
    const safeDelta = Math.min(delta, 100);
    const vx = sprungVelX.get();
    const vy = sprungVelY.get();
    const normalizedVX = Math.max(-2, Math.min(2, vx / 100));
    const normalizedVY = Math.max(-2, Math.min(2, vy / 100));
    const currentWarp = warpSignal.get();
    const speedMultiplier = 1 + currentWarp * 24;
    const baseForwardDrift = -0.3 * speedMultiplier;
    const cellSize = animatedGridSize.get();

    const moveX = normalizedVX * scrollSpeed * speedMultiplier * (safeDelta / 16);
    const moveY =
      (normalizedVY + baseForwardDrift) * scrollSpeed * speedMultiplier * (safeDelta / 16);

    gridX.set((gridX.get() + moveX) % cellSize);
    gridY.set((gridY.get() + moveY) % cellSize);
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    velocityX.set(clientX - prevMouseX.current);
    velocityY.set(clientY - prevMouseY.current);
    mouseX.set(clientX);
    mouseY.set(clientY);
    prevMouseX.current = clientX;
    prevMouseY.current = clientY;
  };

  const handleWarpClick = () => {
    if (isWarping) return;
    setIsWarping(true);
    warpSignal.set(1);
    setTimeout(() => {
      warpSignal.set(0);
      setIsWarping(false);
    }, 2000);
  };

  const maskIntensity = useTransform(warpSignal, [0, 1], [0, 200]);
  const currentMaskRadius = useTransform(
    warpSignal,
    [0, 1],
    [maskRadius, maskRadius * 1.5]
  );
  const maskImage = useMotionTemplate`radial-gradient(${currentMaskRadius}px circle at ${lagX}px ${lagY}px, rgb(${maskIntensity},${maskIntensity},${maskIntensity}), transparent)`;

  return (
    <div
      onMouseMove={handleMouseMove}
      onClick={handleWarpClick}
      className={`relative w-full overflow-hidden bg-background ${className}`}
      style={{ perspective: 1000 }}
    >
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{ backgroundImage: `url("${NOISE_TEXTURE}")` }}
      />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-[15%] w-[38rem] h-[38rem] rounded-full bg-primary/15 blur-[120px] animate-pulse-glow" />
        <div className="absolute -bottom-32 right-[10%] w-[30rem] h-[30rem] rounded-full bg-primary-glow/10 blur-[120px] animate-float-slow" />
      </div>

      <motion.div
        className="absolute inset-0"
        style={{
          rotateX: sprungRotateX,
          rotateY: sprungRotateY,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="absolute inset-0 opacity-30">
          <GridLayer
            gridSize={animatedGridSize}
            x={gridX}
            y={gridY}
            strokeColor="oklch(0.97 0.005 270 / 12%)"
          />
        </div>

        <motion.div
          className="absolute inset-0"
          style={{ maskImage, WebkitMaskImage: maskImage }}
        >
          <GridLayer
            gridSize={animatedGridSize}
            x={gridX}
            y={gridY}
            strokeColor="oklch(0.78 0.18 295 / 85%)"
            strokeWidth={1.2}
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="relative z-10"
        style={{ scale: contentScale }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default MovingGrid;
