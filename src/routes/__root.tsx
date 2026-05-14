import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { ClientOnly } from "../components/ClientOnly";
import { CustomCursor } from "../components/CustomCursor";
import { SmoothScroll } from "../components/SmoothScroll";
import { LoadingScreen } from "../components/LoadingScreen";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { ThemeApplier } from "../components/ThemeApplier";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 ambient-violet">
      <div className="max-w-md text-center glass-strong rounded-3xl p-10">
        <h1 className="text-7xl font-bold text-violet-glow">404</h1>
        <h2 className="mt-4 text-xl font-semibold tracking-wide">Signal lost</h2>
        <p className="mt-2 text-sm text-muted-foreground">This frame doesn't exist in the timeline.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-3 text-xs font-mono uppercase tracking-[0.3em] text-background hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Aizen — Cinematic VFX, Editing & 3D Motion Design" },
      { name: "description", content: "Aizen is a Moroccan VFX artist, video editor, and 3D motion designer turning ideas into moving worlds." },
      { name: "author", content: "Aizen" },
      { property: "og:title", content: "Aizen — Cinematic VFX, Editing & 3D Motion Design" },
      { property: "og:description", content: "Aizen is a Moroccan VFX artist, video editor, and 3D motion designer turning ideas into moving worlds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#05060a" },
      { name: "twitter:title", content: "Aizen — Cinematic VFX, Editing & 3D Motion Design" },
      { name: "twitter:description", content: "Aizen is a Moroccan VFX artist, video editor, and 3D motion designer turning ideas into moving worlds." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/bdbb33a4-e5ad-4c43-9674-a23c1aad5110/id-preview-a3f28642--efeeae5f-5e78-4f19-86ea-1b6045230977.lovable.app-1778085020945.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/bdbb33a4-e5ad-4c43-9674-a23c1aad5110/id-preview-a3f28642--efeeae5f-5e78-4f19-86ea-1b6045230977.lovable.app-1778085020945.png" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body className="grain vignette ambient-violet">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <ClientOnly>
        <ThemeApplier />
        <LoadingScreen />
        <CustomCursor />
        <SmoothScroll />
      </ClientOnly>
      <Nav />
      <main className="relative">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
