import { useMemo, useState } from "react";
import { Play, X } from "lucide-react";
import type { Project, ProjectMedia } from "@/hooks/use-site-data";

export type VideoEntry = {
  id: string;
  url: string;
  title: string;
  subtitle?: string | null;
  poster?: string | null;
};

function isEmbed(url: string) {
  return /youtube\.com|youtu\.be|vimeo\.com/.test(url);
}

function embedSrc(url: string) {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1`;
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1`;
  return url;
}

export default function VideoWork({
  projects,
  projectMedia,
  headline,
  subtitle,
}: {
  projects: Project[];
  projectMedia: ProjectMedia[];
  headline?: string | null;
  subtitle?: string | null;
}) {
  const [active, setActive] = useState<VideoEntry | null>(null);

  const videos = useMemo<VideoEntry[]>(() => {
    const out: VideoEntry[] = [];
    for (const p of projects) {
      if (p.video_url) {
        out.push({
          id: `p-${p.id}`,
          url: p.video_url,
          title: p.title,
          subtitle: p.client ?? p.kind,
          poster: p.cover_url,
        });
      }
    }
    for (const m of projectMedia) {
      if (m.kind !== "video" || !m.url) continue;
      const parent = projects.find((p) => p.id === m.project_id);
      out.push({
        id: `m-${m.id}`,
        url: m.url,
        title: m.alt || parent?.title || "Motion piece",
        subtitle: parent?.client ?? null,
        poster: m.thumbnail_url ?? parent?.cover_url ?? null,
      });
    }
    return out;
  }, [projects, projectMedia]);

  if (videos.length === 0) return null;

  return (
    <section id="videos" className="relative py-32 px-6 md:px-10 scroll-mt-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 reveal">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary-glow mb-4">
            / 02.5 — Motion
          </div>
          <h2 className="text-5xl md:text-7xl font-bold text-chrome leading-[0.95]">
            {headline ?? "Video "}
            <span className="text-gradient-purple">reel</span>
          </h2>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            {subtitle ?? "Moving pieces — edits, VFX shots and 3D motion, straight from the timeline."}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => (
            <button
              key={v.id}
              onClick={() => setActive(v)}
              data-cursor-label="Play"
              className="group relative aspect-video rounded-2xl overflow-hidden glass-strong cursor-none text-left reveal"
            >
              {isEmbed(v.url) ? (
                v.poster ? (
                  <img src={v.poster} alt={v.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-background" />
                )
              ) : (
                <video
                  src={v.url}
                  poster={v.poster ?? undefined}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onMouseEnter={(e) => void e.currentTarget.play().catch(() => {})}
                  onMouseLeave={(e) => e.currentTarget.pause()}
                />
              )}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,oklch(0_0_0/75%)_100%)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="w-14 h-14 rounded-full glass flex items-center justify-center text-primary-glow transition-transform group-hover:scale-110">
                  <Play className="w-5 h-5" />
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                {v.subtitle && (
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">
                    {v.subtitle}
                  </div>
                )}
                <h3 className="text-xl font-bold text-chrome leading-tight">{v.title}</h3>
              </div>
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
          onClick={() => setActive(null)}
        >
          <button
            aria-label="Close video"
            onClick={() => setActive(null)}
            className="absolute top-6 right-6 w-11 h-11 rounded-full glass flex items-center justify-center text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
          <div
            className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden glass-strong"
            onClick={(e) => e.stopPropagation()}
          >
            {isEmbed(active.url) ? (
              <iframe
                src={embedSrc(active.url)}
                title={active.title}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <video src={active.url} controls autoPlay playsInline className="w-full h-full bg-black" />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
