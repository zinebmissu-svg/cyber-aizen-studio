## What I'll build

### 1. Enable Lovable Cloud (backend)
Required for: persistent content edits, sending real emails, storing reviews/projects, and securing the dashboard with login.

### 2. Contact section updates
- Replace generic socials with prominent **Instagram @aizen.visuals** card linking to `https://instagram.com/aizen.visuals` (opens in new tab).
- Wire the contact form to **send a real email** in-place via a server function (no `mailto:`, no leaving the site). Shows inline success/error states. Email is delivered to your configured inbox using Lovable's built-in app emails (Resend-style, set up via Lovable Cloud).

### 3. About section
- Add your uploaded portrait as the main image with cinematic 3D effects:
  - Mouse-driven 3D tilt (perspective rotateX/rotateY).
  - Parallax violet glow + chromatic aberration-like layered shadow.
  - Soft floating animation, scanline + grain overlay preserved.
- Move **About above Work** in the page order (and update nav order + section labels `01 — About`, `02 — Portfolio`).

### 4. New "Reviews" section (horizontal scroll)
- Placed after Services / before Contact.
- Horizontally scrolling row of review cards (avatar, name, role, quote, star rating).
- Smooth horizontal auto-scroll on hover-pause + drag/wheel scroll.
- Editable from dashboard.

### 5. Admin Dashboard (`/admin`)
Protected by login (your account only — first signup becomes admin). Lets you edit:
- **Site content**: hero text, about text, stats, Instagram handle, contact email.
- **Projects**: add/edit/delete portfolio items (title, category, year, type, gradient/cover).
- **Reviews**: add/edit/delete reviewer name, role, quote, rating, avatar.
- All changes are saved to the database and reflected live on the public site.

## Section order (after changes)
Home → About → Work → Services → Reviews → Contact

## Tech notes
- Database tables: `site_settings`, `projects`, `reviews`, `user_roles` (admin role gated via `has_role` security-definer function).
- Public read via RLS; writes restricted to admin role.
- Email sending uses Lovable's built-in transactional email infrastructure (sends to your configured destination address).
- Portrait image copied into `src/assets/aizen-portrait.png` and used in About.

## A couple quick choices before I build

I'll ask 2 questions to finalize, then implement everything.