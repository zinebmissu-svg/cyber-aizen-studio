import { useRef, type MouseEvent } from "react";
import portrait from "@/assets/aizen-portrait.png";

export function Portrait3D() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const wrap = wrapRef.current; const img = imgRef.current; const glow = glowRef.current;
    if (!wrap || !img || !glow) return;
    const r = wrap.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    img.style.transform = `perspective(1200px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(20px) scale(1.02)`;
    glow.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
  };
  const onLeave = () => {
    if (imgRef.current) imgRef.current.style.transform = "perspective(1200px) rotateY(0) rotateX(0) translateZ(0) scale(1)";
    if (glowRef.current) glowRef.current.style.transform = "translate(0,0)";
  };

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative aspect-[4/5] w-full"
      style={{ perspective: "1200px" }}
      data-cursor-label="Aizen"
    >
      {/* parallax violet glow */}
      <div
        ref={glowRef}
        className="absolute -inset-10 -z-10 transition-transform duration-300 ease-out"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.62 0.22 295 / 55%), transparent 60%)",
          filter: "blur(40px)",
        }}
      />
      {/* tilted portrait card */}
      <div
        ref={imgRef}
        className="relative h-full w-full rounded-3xl overflow-hidden glass-strong transition-transform duration-300 ease-out will-change-transform"
        style={{ transformStyle: "preserve-3d", boxShadow: "0 40px 100px -20px oklch(0.62 0.22 295 / 50%), 0 0 0 1px oklch(1 0 0 / 8%) inset" }}
      >
        <img
          src={portrait}
          alt="Portrait of Aizen, Moroccan VFX artist and 3D motion designer"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: "translateZ(0)" }}
        />
        {/* Violet rim wash */}
        <div className="absolute inset-0 mix-blend-overlay pointer-events-none"
          style={{ background: "linear-gradient(135deg, oklch(0.62 0.22 295 / 25%), transparent 60%)" }}
        />
        {/* Chromatic edges */}
        <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-primary-glow/30 rounded-3xl" />
        {/* Scanlines */}
        <div className="absolute inset-0 mix-blend-overlay opacity-30 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, oklch(0 0 0 / 30%) 0 1px, transparent 1px 3px)" }}
        />
        {/* Grain */}
        <div
          className="absolute inset-0 mix-blend-overlay opacity-30 pointer-events-none"
          style={{ background: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.9'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")" }}
        />
        {/* Bottom gradient + label */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background/90 to-transparent pointer-events-none" />
        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between" style={{ transform: "translateZ(40px)" }}>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Portrait</div>
            <div className="text-2xl font-bold text-chrome mt-1">Aizen</div>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">MA · 1998</div>
        </div>
      </div>
    </div>
  );
}
