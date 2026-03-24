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

## Docker

The project runs in Docker both locally and on Render.

### Dockerfile

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 4321
ENV HOST=0.0.0.0
ENV PORT=4321
CMD ["node", "./dist/server/entry.mjs"]
```

### .dockerignore

```
node_modules
dist
.env
.env.*
.git
.gitignore
README.md
```

### Local Docker commands

```bash
# Build the image
docker build -t mitools-dev .

# Run with env file
docker run -p 4321:4321 --env-file .env mitools-dev

# Visit http://localhost:4321
```

### Notes

- Multi-stage build — builder compiles Astro, runtime stage runs it lean
- `HOST=0.0.0.0` is required so the server binds to all interfaces inside the container, not just localhost
- Never copy `.env` into the image — pass env vars at runtime via `--env-file` locally or Render's environment tab in production
- Render detects the Dockerfile automatically when the service type is set to Docker

---

## Render Deployment Notes

- Set service type to **Docker** — Render will auto-detect the Dockerfile
- Add `RESEND_API_KEY` and `CONTACT_TO_EMAIL` in Render → Environment tab
- Connect custom domain `mitools.dev` in Render → Settings → Custom Domains

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

## Production Phases

Work through these phases in order. Do not move to the next phase until the current one is complete and working.

---

### Phase 1 — Project Foundation + Docker
*Goal: Runnable project with zero errors, visible in Docker immediately*

- [ ] Initialise Astro project with Tailwind CSS
- [ ] Configure `astro.config.mjs` with `output: 'hybrid'`
- [ ] Set up `tsconfig.json`
- [ ] Install dependencies: `astro`, `@astrojs/tailwind`, `@astrojs/node`, `resend`
- [ ] Create `Base.astro` layout with `<head>`, Google Fonts (Syne + JetBrains Mono), and global meta tags
- [ ] Create `global.css` with CSS variables for all design tokens
- [ ] Create `index.astro` as an empty shell that imports the layout
- [ ] Confirm `npm run dev` starts with no errors
- [ ] Create `Dockerfile` and `.dockerignore` (see Docker section)
- [ ] Build image: `docker build -t mitools-dev .`
- [ ] Run container: `docker run -p 4321:4321 --env-file .env mitools-dev`
- [ ] Confirm site loads at `http://localhost:4321` inside Docker
- [ ] From this point, rebuild Docker after every phase to verify changes

---

### Phase 2 — Global Styles & Design System
*Goal: Design tokens and base aesthetic are locked in*

- [ ] Define all CSS variables in `global.css` (colors, fonts, spacing)
- [ ] Add scanline overlay and faint grid background to `global.css`
- [ ] Set base styles: body background, default text color, font rendering
- [ ] Create reusable Tailwind config extensions for brand colors and fonts
- [ ] Test dark background renders correctly at all viewport widths

---

### Phase 3 — Hero Section
*Goal: First section is built and visually complete*

- [ ] Build `Hero.astro` component
- [ ] Terminal-style heading: `mitools.dev` with prompt prefix (`>_` or `$`)
- [ ] Typing animation on subtitle (CSS keyframes preferred)
- [ ] Scroll-down CTA button linking to `#projects`
- [ ] Staggered fade-up animation on page load (CSS animation-delay)
- [ ] Fully responsive at 375px and up

---

### Phase 4 — Projects Section
*Goal: Both project cards are built and link correctly*

- [ ] Build `ProjectCard.astro` component with props: `name`, `description`, `tags`, `url`
- [ ] Terminal window chrome aesthetic on cards (traffic light dots or bracket style)
- [ ] Render two cards: habit and crimsontools with correct subdomain URLs
- [ ] Cards open subdomains in a new tab
- [ ] Hover state: border glow or accent color transition
- [ ] Cards stack vertically on mobile, side by side on desktop

---

### Phase 5 — About Section & Contact Form
*Goal: About section is live and contact form sends real emails*

- [ ] Build `About.astro` with developer bio and skills list
- [ ] Build `ContactForm.astro` with Name, Email, Message fields
- [ ] Terminal input aesthetic: monospace font, dark inputs, green accent on focus
- [ ] Create `/api/contact.ts` API route
- [ ] Integrate Resend — validate fields, send email to `CONTACT_TO_EMAIL`
- [ ] Return JSON success/error response
- [ ] Handle inline success and error states in the form (no page reload)
- [ ] Test form end-to-end with real email delivery

---

### Phase 6 — Deployment
*Goal: Site is live on Render at mitools.dev*

- [ ] Confirm contact form works inside Docker locally
- [ ] Push repo to GitHub
- [ ] Create new Web Service on Render — set environment to **Docker** (Render auto-detects the Dockerfile)
- [ ] Add `RESEND_API_KEY` and `CONTACT_TO_EMAIL` in Render environment tab
- [ ] Verify deployment builds and runs successfully on Render
- [ ] Connect custom domain `mitools.dev` in Render dashboard
- [ ] Confirm contact form works in production

---

### Phase 7 — Logo & Brand Assets
*Goal: Real logo is in place, favicon is set*

- [ ] Drop finalised `logo.svg` into `/public/`
- [ ] Update `Base.astro` to use logo in nav/header
- [ ] Remove `[ mitools ]` text fallback once logo is confirmed working
- [ ] Create and add `favicon.ico` (export from logo)
- [ ] Add Open Graph meta tags in `Base.astro` (og:title, og:description, og:image)
- [ ] Add a simple og:image (1200×630) to `/public/`

---

### Phase 8 — Polish & Final Touches
*Goal: Site feels production-grade and memorable*

- [ ] Audit all animations — timing, easing, and feel should be smooth not jarring
- [ ] Add scroll-triggered slide-up on project cards (Intersection Observer)
- [ ] Add `<ViewTransitions />` for smooth navigation if multi-page is added later
- [ ] Cross-browser test: Chrome, Firefox, Safari
- [ ] Mobile audit at 375px, 390px, 430px
- [ ] Lighthouse audit — aim for 90+ on Performance, Accessibility, SEO
- [ ] Fix any contrast or accessibility issues flagged
- [ ] Add subtle cursor glow or custom cursor (optional — only if it fits the aesthetic)
- [ ] Final copy review — bio, project descriptions, CTA text
- [ ] Tag `v1.0.0` release on GitHub

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
