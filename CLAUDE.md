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

Palette ispirata a spade.com (luglio 2026): sage chiaro + verde moss/forest.
NB: la variabile si chiama ancora `--cyan` per compatibilità storica, ma il valore è il verde moss.

```css
--bg:      #f4faed          /* sage-1: primary background */
--bg-2:    #f0fae6          /* sage-2: secondary background */
--ink:     #090f05          /* near-black green: primary text */
--cyan:    #3f7308          /* moss: brand accent (nome legacy!) */
--forest:  #18280e          /* dark surfaces, primary buttons */
--lemongrass: #b2eb76       /* hover/highlight su superfici scure */
--white:   #fff
--muted:   rgba(9,15,5,.60)   /* secondary text */
--muted-2: rgba(9,15,5,.40)   /* tertiary text */
--line:    #d8e5ca          /* sage-3: borders (weak) */
--line-2:  #b3c5a0          /* sage-4: borders (strong, interactive) */
--glass:   #ffffff          /* card backgrounds */
--glass-2: #eaf6dc          /* card hover/active */
--mono:    'IBM Plex Mono', monospace
--radius:  12px
--radius-sm: 8px
```

### Spade Aesthetic Signatures

1. **Fondo flat sage** (`--bg`) con blueprint grid in inchiostro a bassissima opacità (`body::after`)
2. **Card bianche** — bordo 1px sage-3, radius 12px, niente blur, ombra minima
3. **Registration marks** (`.reg-tl/tr/bl/br`) — tick angolari 18×18 in moss, opacity 0.5
4. **Bottone spade** (`.btn-spade`) — layer `::before` forest che scala a 0.98 in hover, testo → lemongrass; variante ghost `.btn-spade--light`
5. **Status pills** — mono, uppercase, squadrate (radius 6px); printing=moss tinted, ready=solid moss, draft=ghost, error=dashed red #e40014
6. **Superfici scure** (mappe, viewport 3D, hero landing) — forest `#18280e`/`#122006` con linee/pin lemongrass
7. **Mono numbers** — KPI, ETA, order IDs, percentuali in IBM Plex Mono
8. **Label di sezione** — mono, UPPERCASE, 12px, letter-spacing 0.08em, colore muted
9. **Animazioni** — fadeUp a cascata (`.anim-fadeUp`, `-d1`…`-d6`), `.anim-marquee`, transizioni con `cubic-bezier(.4,0,.2,1)`

---

## 5. Information Architecture

### Public routes
| Route | Page | Status |
|---|---|---|
| `/` | Landing (payoff, survey, scroll-print GSAP, due destini, CTA) | **done** |
| `/come-funziona` | Percorso in 5 step, i 5 layer, FAQ dalle barriere survey | **done** |
| `/impatto` | Caso sedia, digital footprint, circolarità R4/R7 | **done** |
| `/community` | Versioning collaborativo, ruoli della rete | **done** |
| `*` | Redirect → `/app/dashboard` | done |

Contenuti pubblici basati sulla ricerca Miro (luglio 2026): payoff «Non è rotto: è stato
progettato per rompersi», survey 100 risposte Milano (80% ricambio introvabile, 43% butta
per un pezzo, 56% non sa cos'è un FabLab), personas Marco/Giulia/Roberto, caso sedia
(−95% CO₂, −70€), digital footprint (28Wh pezzo nuovo / 2Wh da archivio).
La sezione scroll-stampa della landing usa **gsap ScrollTrigger** (scroller `.landing-scroll`,
sticky pin) + clipping plane di `PrintViewer3D` (`buildDisplacedGeo` esportata).

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
- **Palette spade**: sage (#f4faed), bianco, moss (#3f7308), forest (#18280e), lemongrass (#b2eb76). No blu, no colori caldi (il rosso #e40014 solo per errori).
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

---

## 9. Scan + CV (feature `src/scan/`)

Live in-browser object recognition wired into `/app/new` ("Scansiona con fotocamera" → `ScanView`).

- **Approach — Wizard of Oz.** Recognition is real (CLIP, zero-shot). Mesh generation is NOT: a recognized label maps to a pre-scanned `.glb` from `src/scan/library.ts` (files go in `public/meshes/`). Currently the result state shows the existing procedural `PrintViewer3D`; swap to `.glb` when files exist (see the `ponytail:` note in `ScanView.tsx`).
- **Stack.** `@xenova/transformers` v2.17, pipeline `zero-shot-image-classification`, model `Xenova/clip-vit-base-patch32`. No API key. `vite.config.ts` excludes it from dep pre-bundling; `useRecognizer.ts` sets `env.allowLocalModels = false`.
- **Flow.** `capture → scanning → result | nomatch → match`. Threshold `0.2` (calibration knob in `ScanView.tsx`). Distractor labels in `library.ts` make "nessun match" reliable.
- **Fallbacks.** Camera denied → upload/dropzone. CLIP load error → silent demo mode. **Demo toggle** in the header forces `moka pot` (use in class if net/camera misbehave).
- **Pre-warm / offline.** The model (~150MB) downloads from the HF hub on first `ScanView` mount ("inizializzazione CV…") and is then served from the browser cache — works offline after that first load. To pre-warm before an exam: open `/app/new` → scan once on the target device/browser while online, confirm it works, then it stays cached. **Camera needs HTTPS** on mobile: run `npm run dev -- --host` + `cloudflared tunnel --url http://localhost:5173` and open the `https://…trycloudflare.com` URL on the phone.
