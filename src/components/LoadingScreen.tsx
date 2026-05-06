import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("aizen-loaded")) {
      setDone(true);
      return;
    }
    let v = 0;
    const id = setInterval(() => {
      v += Math.random() * 9 + 3;
      if (v >= 100) {
        v = 100;
        clearInterval(id);
        setTimeout(() => {
          sessionStorage.setItem("aizen-loaded", "1");
          setDone(true);
        }, 500);
      }
      setPct(Math.floor(v));
    }, 90);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      aria-hidden={done}
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background transition-all duration-1000 ${
        done ? "pointer-events-none opacity-0 scale-110" : "opacity-100"
      }`}
    >
      {/* particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="absolute block rounded-full animate-float-slow"
            style={{
              left: `${(i * 137) % 100}%`,
              top: `${(i * 53) % 100}%`,
              width: `${1 + (i % 3)}px`,
              height: `${1 + (i % 3)}px`,
              background: "oklch(0.78 0.18 295 / 80%)",
              boxShadow: "0 0 8px oklch(0.62 0.22 295 / 80%)",
              animationDelay: `${(i % 8) * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* glow */}
      <div className="absolute inset-0 ambient-violet opacity-50" />

      <div className="relative z-10 flex flex-col items-center gap-10">
        <div className="relative">
          <h1 className="text-7xl md:text-8xl font-bold tracking-[0.3em] text-chrome relative">
            AIZEN
          </h1>
          <div className="absolute inset-0 animate-shimmer" style={{ WebkitMaskImage: "linear-gradient(90deg, transparent, black, transparent)" }} />
        </div>

        {/* sound-wave */}
        <div className="flex items-end gap-1 h-10">
          {Array.from({ length: 28 }).map((_, i) => (
            <span
              key={i}
              className="w-[2px] bg-primary-glow animate-pulse-glow"
              style={{
                height: `${20 + Math.abs(Math.sin(i + pct / 10) * 30)}px`,
                animationDelay: `${i * 0.05}s`,
                boxShadow: "0 0 8px oklch(0.62 0.22 295 / 80%)",
              }}
            />
          ))}
        </div>

        <div className="flex flex-col items-center gap-3 w-72">
          <div className="font-mono text-xs tracking-[0.4em] text-muted-foreground uppercase">Loading Experience</div>
          <div className="w-full h-px bg-border overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${pct}%`, background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
            />
          </div>
          <div className="font-mono text-sm text-foreground/80">{String(pct).padStart(3, "0")}%</div>
        </div>
      </div>
    </div>
  );
}
