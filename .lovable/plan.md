
# Aizen — Cinematic Portfolio (V1: Visual Shell + Light 3D)

A matte-black, chrome + electric-violet portfolio that feels like a film. Full layout, custom cursor, smooth scrolling, GSAP scroll animations, and lightweight Three.js scenes tuned for performance.

## Visual direction

- **Background**: matte black `#05060a` with deep space blue `#0b1020` gradients
- **Accents**: electric violet `#a78bfa` → `#7c3aed`, soft chrome whites
- **Texture**: subtle film grain overlay, volumetric fog, ambient glow, glassmorphism panels
- **Typography**: oversized display sans for cinematic headers, mono for labels

## Sections & routes

Each gets its own route + unique SEO metadata:

- `/` — Loading screen → Hero
- `/work` — Portfolio gallery
- `/about` — Editorial bio
- `/services` — Floating service cards
- `/contact` — Holographic contact form

Sticky glass navigation with magnetic links across all routes.

## Section breakdown

**Loading screen** (first visit)
- Animated "AIZEN" logo reveal with chrome shimmer
- Smooth 0→100 percentage counter
- Floating particles, ambient violet glow
- Dramatic fade + scale transition into hero

**Hero**
- Fullscreen Three.js scene: floating chrome geometric shape (icosahedron / torus knot) with metallic material + violet rim light, reacting to cursor
- Particle field drifting in depth
- Massive headline: *"Turning Ideas Into Moving Worlds."* with per-character reveal
- Subhead: Moroccan VFX artist · Video editor · 3D motion designer
- Magnetic "Enter Portfolio" CTA
- Visualizer-style animated bars (no audio) pulsing along the bottom

**Portfolio / Work**
- Filter chips (All · VFX · Editing · 3D · Direction)
- Grid of cinematic project cards with glass overlays
- Hover: depth tilt, distortion, violet glow, autoplay video preview (placeholder loops)
- Smooth stagger reveal on scroll

**About**
- Split editorial layout: floating portrait with violet rim lighting + animated bio
- Scroll-triggered timeline of milestones
- Subtle 3D motion background (slow drifting plane / fog)

**Services**
- 5 floating glass cards: VFX · Video Editing · 3D Motion · Creative Direction · Visual Branding
- 3D tilt on hover, holographic gradient sweep, glow emit
- Cursor-reactive parallax

**Contact**
- Holographic glass form (name, email, project, message) with glowing focus borders
- Animated social icons (Instagram, Behance, Vimeo, YouTube)
- "Based in Morocco" with ambient particle map accent
- Floating ambient particles

## Interaction systems (global)

**Custom cursor**
- Dot + trailing ring with smooth easing
- Magnetic pull on buttons/links
- Expand + violet glow on clickable elements
- Particle burst on click
- Hidden on touch devices (native cursor fallback)

**Smooth scrolling** — Lenis-powered inertia across all routes

**Scroll animations** — GSAP ScrollTrigger for:
- Section reveals (fade + lift)
- Parallax layers at varied speeds
- Text character/word reveals
- Pinned storytelling moments in hero & about

**Film grain + vignette** — full-page overlay, very subtle

## Tech approach

- **Stack**: TanStack Start (already configured) + React 19 + Tailwind v4
- **3D**: `three` + `@react-three/fiber` + `@react-three/drei` — lightweight scenes, single canvas per section, capped DPR, suspended on mobile
- **Animation**: `gsap` + ScrollTrigger, `framer-motion` for UI micro-interactions
- **Smooth scroll**: `lenis`
- **SSR safety**: all WebGL/cursor/Lenis code gated to client (dynamic mounts, `typeof window` guards) so SSR doesn't crash
- **Performance**: lazy-load 3D scenes per route, reduce particle counts on smaller viewports, `prefers-reduced-motion` respected
- **Design tokens**: extend `src/styles.css` with new violet/chrome palette, grain texture, glass utilities

## Out of scope for V1 (can layer in later)

- Real audio playback
- Heavy WebGL shaders / post-processing (bloom, DOF) — start with material-level glow
- Real project videos (placeholder loops / posters until you provide assets)
- CMS / backend

After approval I'll scaffold the routes, install dependencies, build the cursor + Lenis + grain shell, then ship each section.
