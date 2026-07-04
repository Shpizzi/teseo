// Wizard-of-Oz mesh library: recognized label → pre-scanned mesh + metadata.
// The CLIP recognition is real; the mesh is pre-authored (image-to-3D is
// server-side and too fragile for a live demo). Label → mesh is a direct lookup.
export type LibraryEntry = {
  glb: string // pre-scanned mesh under /public/meshes (added separately)
  part: string // which broken/replaceable part
  material: string
  note: string
}

export const LIBRARY: Record<string, LibraryEntry> = {
  'moka pot': {
    glb: '/meshes/moka.glb',
    part: 'Manico / pomello (rottura comune)',
    material: 'PETG',
    note: 'Modello fuori produzione. Ricambio ricostruibile da scan + libreria community.',
  },
  'coffee mug': {
    glb: '/meshes/mug.glb',
    part: 'Manico',
    material: 'PLA',
    note: 'Manico staccato: ristampabile con aggancio a incastro.',
  },
  'over-ear headphones': {
    glb: '/meshes/cuffie.glb',
    part: 'Cerniera archetto',
    material: 'PETG',
    note: 'Cerniera fragile: rinforzo strutturale nel ricambio community.',
  },
  'eyeglasses': {
    glb: '/meshes/occhiali.glb',
    part: 'Astina / cerniera',
    material: 'Nylon PA12',
    note: 'Astina rotta: ricambio su misura da scan del frontale.',
  },
}

export const LABELS = Object.keys(LIBRARY)

// Distractor labels: common objects NOT in the library. Included in the CLIP
// candidate set so an out-of-library object spreads its softmax mass here
// instead of falsely clearing the match threshold → makes "nessun match" real.
export const DISTRACTORS = ['person', 'laptop', 'wall', 'chair', 'window', 'hand']

export const ALL_LABELS = [...LABELS, ...DISTRACTORS]
