# TESEO — Distributed 3D Printing Platform

## 1. Product Description

**TESEO** is a distributed on-demand 3D printing platform built for the Industria 4.0/5.0 context.
It connects two actors:

- **User (Maker / Cliente)** — uploads or selects a 3D model, chooses a nearby FabLab producer, tracks print progress in real time, and picks up finished pieces.
- **FabLab (Produttore)** — receives print orders, manages the printer queue, uses AI-assisted slicing (AI slicing mode in the studio view), and reports job status to the user.

The problem it solves: 3D printers are expensive and sparsely distributed. TESEO matches demand (people who need parts) with supply (FabLabs that have idle printers) in a localised marketplace, with zero friction from model upload to physical delivery. It sits at the crossroads of the maker economy, local manufacturing, and AI-assisted production.

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **React 18 + Vite + TypeScript** | Fast HMR, ecosystem, typed safety, Vite's ESM-native build |
| Styling | **Tailwind CSS v3** | Utility-first + design token extension; v3 pinned (v4 pipeline is different) |
| Routing | **react-router-dom v6** | Declarative nested routes for /app and /fablab branches |
| Icons | **lucide-react** | Consistent stroke-based icon set matching prototype style |
| 3D viewport | **@react-three/fiber + @react-three/drei + three** | For the `/app/stampa` slicing/printing studio view |
| Fonts | **Urbanist + IBM Plex Mono** (Google Fonts) | Prototype exact — geometric sans + technical mono |
| Backend | **None — mock data only** | Prototype fidelity first; no API required for UI development |

---

## 3. Folder Structure

```
teseo/
├── index.html                    # Entry point, loads fonts, title "TESEO"
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── package.json
├── CLAUDE.md                     # This file
├── prototipo_blueprint.html      # Reference prototype (source of truth for design)
└── src/
    ├── main.tsx                  # BrowserRouter wrapper
    ├── App.tsx                   # Route definitions
    ├── index.css                 # Global CSS: blueprint grid, custom component classes
    ├── mock/
    │   └── index.ts              # All mock data + TypeScript types
    ├── components/               # Shared atomic/molecule components
    │   ├── GlassCard.tsx
    │   ├── IconButton.tsx
    │   ├── KpiCard.tsx
    │   ├── PrimaryButton.tsx
    │   ├── ProgressBar.tsx
    │   ├── SearchBar.tsx
    │   ├── Sidebar.tsx
    │   └── StatusPill.tsx
    ├── layouts/
    │   └── UserLayout.tsx        # Sidebar + Outlet shell for /app/* routes
    └── pages/
        ├── user/
        │   └── Dashboard.tsx     # /app/dashboard — user home
        └── fablab/               # (future) /fablab/* pages
```

---

## 4. Design System Tokens

### CSS Custom Properties (defined in `src/index.css`)

```css
--bg:      #0a2342          /* primary background */
--bg-2:    #0c2a52          /* secondary background (cards, panels) */
--ink:     #eaf4fb          /* primary text */
--cyan:    #AFE3F9          /* brand accent, interactive elements */
--white:   #fff
--muted:   rgba(234,244,251,.62)  /* secondary text */
--muted-2: rgba(234,244,251,.42)  /* tertiary text */
--line:    rgba(174,227,249,.20)  /* borders (weak) */
--line-2:  rgba(174,227,249,.36)  /* borders (strong, interactive) */
--glass:   rgba(174,227,249,.035) /* card backgrounds (subtle) */
--glass-2: rgba(174,227,249,.07)  /* card backgrounds (hover/active) */
--mono:    'IBM Plex Mono', monospace
--radius:  18px
--radius-sm: 13px
```

### Blueprint Aesthetic Signatures

1. **Body gradient** — `linear-gradient(160deg, #0a2342, #081d3a 60%, #0a2645)` with `overflow: hidden`
2. **Radial glows** (`body::before`) — two soft radial gradients at top-right and bottom-left
3. **Blueprint grid** (`body::after`) — 4-layer grid: fine 26px lines (5% opacity) + master 130px lines (10% opacity), masked with radial gradient so it fades at edges
4. **Registration marks** (`.reg-tl/tr/bl/br`) — 18×18 L-shaped corner marks in cyan, opacity 0.55
5. **Glass panels** — `backdrop-filter: blur(14px)`, semi-transparent bg, 1px cyan border at 20% opacity
6. **Hero card** — `.glass-panel` with stronger border (line-2) + `::before` inset dashed border at 8px inset
7. **Status pills** — all-caps, pill shape; printing=cyan tinted, ready=solid cyan, draft=ghost, error=dashed cyan
8. **Mono numbers** — all KPI values, ETAs, order IDs, percentages use IBM Plex Mono
9. **UPPERCASE section titles** with letter-spacing

---

## 5. Information Architecture

### Public routes
| Route | Page | Status |
|---|---|---|
| `/` | Landing page SaaS (hero 3D, how it works, features, CTA) | **done** |
| `*` | Redirect → `/app/dashboard` | done |

### User branch `/app/...`
| Route | Page | Status |
|---|---|---|
| `/app/dashboard` | User dashboard (KPIs, progetti, mappa) | **done** |
| `/app/progetti` | Lista progetti (In corso / Storico) | **done** |
| `/app/progetti/:id` | Dettaglio progetto (3D viewer, timeline) | **done** |
| `/app/new` | Nuova stampa (upload → produttore → conferma) | **done** |
| `/app/salvati` | Modelli salvati | **done** |
| `/app/community` | Community feed | **done** |
| `/app/community/:id` | Dettaglio modello + versioning | **done** |
| `/app/produttori` | Mappa + lista produttori | **done** |
| `/app/produttori/:id` | Profilo produttore | **done** |
| `/app/messages` | Chat con produttori | **done** |
| `/app/profile` | Profilo utente | **done** |

### FabLab branch `/fablab/...`
| Route | Page | Status |
|---|---|---|
| `/fablab/dashboard` | FabLab dashboard (ordini, stampanti) | **done** |
| `/fablab/slicing` | 3D slicing studio (Three.js viewport) | **done** |
| `/fablab/ordini` | Lista ordini con tabs | **done** |
| `/fablab/ordini/:id` | Dettaglio ordine 3 pannelli (stampa/3D/cliente) | **done** |
| `/fablab/coda` | Coda di stampa | **done** |
| `/fablab/stampanti` | Parco stampanti | **done** |
| `/fablab/community` | Community panel | todo |

---

## 6. Code Conventions

- **Naming:** PascalCase for components/pages/layouts; camelCase for functions/variables; SCREAMING_SNAKE for constants
- **Mock data:** All in `src/mock/index.ts` — export typed arrays/objects; no API calls anywhere
- **Adding a page:**
  1. Create `src/pages/<branch>/<PageName>.tsx`
  2. Add a `<Route path="<slug>" element={<PageName />} />` inside the matching layout in `src/App.tsx`
  3. Add a nav item to the relevant layout's sidebar items array
- **CSS:** Blueprint background + grid stays in `src/index.css` global scope. Component-level glass/pill/reg-mark styles are in `@layer components` in `src/index.css`. Tailwind utilities for layout/spacing only.
- **No yellow, no warm colors.** Palette is strictly: deep navy, white, and cyan (#AFE3F9).
- **Fonts:** Urbanist for all body text. IBM Plex Mono for numbers, ETAs, order codes, labels with letter-spacing.
- **Italian everywhere** — all UI copy, labels, status text, buttons, tooltips.

---

## 7. How to Run

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

## 8. Key Design Decisions

- `body { overflow: hidden }` is intentional — all scrolling happens inside flex children with `overflow: auto`
- The blueprint grid uses `position: fixed; inset: 0; pointer-events: none; z-index: 0` so it never captures clicks
- All glass panels need `position: relative` to sit above z-index:0 grid layers
- The sidebar is `flex: 0 0 212px` — never grows/shrinks
- Content area is `flex: 1; min-width: 0` to prevent overflow blowout
