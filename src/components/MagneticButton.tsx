import { useRef, type ReactNode, type MouseEvent } from "react";

export function MagneticButton({
  children,
  onClick,
  href,
  label,
  variant = "primary",
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  label?: string;
  variant?: "primary" | "ghost";
}) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0,0)";
  };

  const base =
    "relative inline-flex items-center gap-3 px-7 py-4 rounded-full font-mono text-xs uppercase tracking-[0.3em] transition-[background,box-shadow,color] duration-300 will-change-transform";
  const cls =
    variant === "primary"
      ? `${base} bg-foreground text-background hover:shadow-[var(--shadow-glow)]`
      : `${base} glass-strong text-foreground hover:bg-primary/10`;

  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      <span className="relative z-10 inline-block w-2 h-2 rounded-full bg-primary-glow shadow-[0_0_12px_oklch(0.62_0.22_295)]" />
    </>
  );

  if (href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={cls}
        data-cursor-label={label}
      >
        {inner}
      </a>
    );
  }
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cls}
      data-cursor-label={label}
    >
      {inner}
    </button>
  );
}
