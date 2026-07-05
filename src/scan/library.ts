// Wizard-of-Oz mesh library: recognized label → pre-scanned mesh + metadata.
// The CLIP recognition is real; the mesh is pre-authored (image-to-3D is
// server-side and too fragile for a live demo). Label → mesh is a direct lookup.
export type LibraryEntry = {
  name: string // human product name shown in the confirmation step
  glb: string // pre-scanned mesh under /public/meshes (added separately)
  part: string // which broken/replaceable part
  material: string
  note: string
}

export const LIBRARY: Record<string, LibraryEntry> = {
  'remote control': {
    name: 'Telecomando Amazon Fire TV Stick',
    glb: '/meshes/remote.glb',
    part: 'Coperchio vano batterie',
    material: 'ABS',
    note: 'Telecomando Fire TV: coperchio batterie smarrito, ricostruito da scan.',
  },
  'moka pot': {
    name: 'Moka / caffettiera',
    glb: '/meshes/moka.glb',
    part: 'Manico / pomello (rottura comune)',
    material: 'PETG',
    note: 'Modello fuori produzione. Ricambio ricostruibile da scan + libreria community.',
  },
  'coffee mug': {
    name: 'Tazza',
    glb: '/meshes/mug.glb',
    part: 'Manico',
    material: 'PLA',
    note: 'Manico staccato: ristampabile con aggancio a incastro.',
  },
  'over-ear headphones': {
    name: 'Cuffie over-ear',
    glb: '/meshes/cuffie.glb',
    part: 'Cerniera archetto',
    material: 'PETG',
    note: 'Cerniera fragile: rinforzo strutturale nel ricambio community.',
  },
  'eyeglasses': {
    name: 'Occhiali',
    glb: '/meshes/occhiali.glb',
    part: 'Astina / cerniera',
    material: 'Nylon PA12',
    note: 'Astina rotta: ricambio su misura da scan del frontale.',
  },
  // Prototipi reali (mesh .obj/.stl in public/meshes, il viewer li carica direttamente)
  'water valve': {
    name: 'Valvola a muro',
    glb: '/meshes/valvola.obj',
    part: 'Manopola / volantino',
    material: 'PETG',
    note: 'Volantino spanato: ricambio con innesto quadro rinforzato.',
  },
  'umbrella': {
    name: 'Ombrello',
    glb: '/meshes/ombrello.stl',
    part: 'Snodo stecca',
    material: 'Nylon PA12',
    note: 'Snodo della stecca rotto: clip di riparazione dalla libreria community.',
  },
  'refrigerator': {
    name: 'Frigorifero',
    glb: '/meshes/frigo.stl',
    part: 'Ricambio interno (balconcino / supporto)',
    material: 'ABS',
    note: 'Ricambio fuori produzione: ricostruito da scan, adatto a contatto alimentare con PETG.',
  },
}

export const LABELS = Object.keys(LIBRARY)

// Distractor labels: common objects NOT in the library. Included in the CLIP
// candidate set so an out-of-library object spreads its softmax mass here
// instead of falsely clearing the match threshold → makes "nessun match" real.
export const DISTRACTORS = ['person', 'laptop', 'wall', 'chair', 'window', 'hand']

export const ALL_LABELS = [...LABELS, ...DISTRACTORS]
