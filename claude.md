# CLAUDE.md — mitools.dev

## Project Overview

**mitools.dev** is a developer hub and launchpad — the central home for all tools and projects built under the mitools brand. It serves as both a portal to subdomains and a portfolio for potential employers, other developers, and general users discovering the tools.

---

## Goals

- Act as the main entry point for all mitools projects
- Showcase the developer's work in a professional, memorable way
- Link out directly to active subdomains: `habit.mitools.dev` and `crimsontools.mitools.dev`
- Allow visitors to get in touch via a working contact form
- Reflect the mitools brand: retro terminal aesthetic with slick, motion-forward dark design

---

## Tech Stack

**Recommended:** Astro + Tailwind CSS

- Astro is ideal for a mostly-static site with a contact form island
- Fast, SEO-friendly, zero JS by default (ship only what you need)
- Tailwind for utility-first styling with full control over the terminal aesthetic
- Use Astro's `<ViewTransitions />` for smooth page transitions

**Contact Form:** Resend (recommended)
- Simple API, generous free tier, great DX
- Use an Astro API route (`src/pages/api/contact.ts`) to handle form submission server-side
- Set `output: 'hybrid'` in `astro.config.mjs` to enable SSR only for the API route

**Deployment:** Render
- Deploy as a static site on Render
- Set build command: `npm run build`
- Set publish directory: `dist`
- Add environment variables via Render dashboard (see Environment Variables section)

---

## Site Structure

```
mitools.dev/
├── / (Home — single page, all sections)
│   ├── #hero
│   ├── #projects
│   └── #about
└── /api/contact (server endpoint — handles form POST)
```

The site is a single scrollable page. No separate routes needed beyond the API endpoint.

---

## Sections

### 1. Hero (`#hero`)
- Full-viewport opening section
- Display: `mitools.dev` as the primary heading — styled like a terminal prompt
- Subtitle: one-line description of what mitools is
- Animated typing effect on the subtitle (CSS or minimal JS)
- CTA: smooth scroll down to `#projects`
- Background: dark (`#080b0f`), subtle scanline overlay, faint grid

### 2. Projects (`#projects`)
- Two project cards side by side (stack on mobile)
- Each card contains:
  - Project name
  - Short description (1–2 sentences)
  - Tech tags
  - Link button → opens subdomain in new tab
- **habit** → `https://habit.mitools.dev`
- **crimsontools** → `https://crimsontools.mitools.dev`
- Cards use terminal/window chrome aesthetic (traffic light dots or bracket styling)
- Hover: subtle glow or border animation

### 3. About (`#about`)
- Short developer bio (2–3 sentences)
- Skills or tech stack list (minimal, not exhaustive)
- Contact form directly below or embedded in this section

### Contact Form (within `#about`)
- Fields: Name, Email, Message
- Submit → POST to `/api/contact` → sends email via Resend
- Show inline success/error state (no page reload)
- Style: terminal input aesthetic — monospace font, dark inputs, green accent on focus

---

## Design System

### Aesthetic
Retro terminal meets slick dark UI. Think: CRT scanlines, monospace type, green/cyan accents, but with smooth motion and modern layout quality. Not lo-fi — high production value with a terminal soul.

### Colors
```
Background:   #080b0f
Surface:      #0d1117
Border:       #1e2d3d
Text primary: #c8d6e5
Accent:       #00ff88  (terminal green)
Accent alt:   #00cfff  (cyan — use sparingly)
Muted:        #4a5568
```

### Typography
```
Display / headings:  Syne (800 weight) — google fonts
Body / UI:           JetBrains Mono (400, 500) — google fonts
```

### Motion
- Page load: staggered fade-up on hero elements (CSS animation-delay)
- Project cards: subtle slide-up on scroll into view (Intersection Observer)
- Buttons/links: fast color transition on hover (150ms)
- No heavy JS animation libraries — keep it CSS-first

### Logo
- Preferred: use provided logo asset once ready
- Fallback: text-based `[ mitools ]` in JetBrains Mono with accent-colored brackets

---

## File Structure

```
mitools-dev/
├── public/
│   ├── favicon.ico
│   └── logo.svg            # drop logo here when ready
├── src/
│   ├── components/
│   │   ├── Hero.astro
│   │   ├── ProjectCard.astro
│   │   ├── About.astro
│   │   └── ContactForm.astro
│   ├── layouts/
│   │   └── Base.astro      # <head>, fonts, global styles
│   ├── pages/
│   │   ├── index.astro     # assembles all sections
│   │   └── api/
│   │       └── contact.ts  # Resend API handler
│   └── styles/
│       └── global.css      # CSS variables, scanline, grid bg
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
└── CLAUDE.md
```

---

## Environment Variables

Store in Render dashboard and locally in `.env` (never commit):

```
RESEND_API_KEY=your_resend_api_key_here
CONTACT_TO_EMAIL=your@email.com
```

---

## Contact Form API Route

`src/pages/api/contact.ts` should:
1. Accept POST requests only
2. Parse `name`, `email`, `message` from request body
3. Validate all fields are present and email is valid format
4. Call Resend API to send email to `CONTACT_TO_EMAIL`
5. Return `{ success: true }` or `{ error: "..." }` as JSON

---

## Render Deployment Notes

- Framework: Static Site (or Web Service if SSR is needed for the API route)
- If using Astro hybrid mode (recommended): deploy as a **Web Service** on Render
  - Build command: `npm run build`
  - Start command: `node ./dist/server/entry.mjs`
  - Set Node version: 18+
- Add env vars in Render → Environment tab

---

## Subdomains

These are separate projects hosted independently. mitools.dev links to them but does not contain their code.

| Subdomain | Project | URL |
|---|---|---|
| habit | Habit tracker app | https://habit.mitools.dev |
| crimsontools | Crimson Tools suite | https://crimsontools.mitools.dev |

---

## Out of Scope (for now)

- Authentication or user accounts
- CMS or blog
- Analytics (can add later — Plausible or Umami recommended)
- Additional project pages beyond habit and crimsontools

---

## Claude Code Instructions

When working on this project:

1. **Always check this file first** before making architectural decisions
2. Follow the file structure above — do not reorganize without reason
3. Keep the terminal aesthetic consistent across all components
4. Mobile-first — all layouts must work at 375px and up
5. Env vars must never be hardcoded — always use `import.meta.env`
6. The contact form must handle errors gracefully — never show a blank failure
7. When adding new projects in future, duplicate `ProjectCard.astro` — do not refactor the card component without flagging it
8. Prefer CSS animations over JS where possible
9. Logo: use `/public/logo.svg` if it exists, otherwise render `[ mitools ]` text fallback
10. Keep the bundle lean — no heavy dependencies without justification
