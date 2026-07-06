// In-browser zero-shot image recognition (CLIP) via transformers.js.
// The model (~150MB) downloads from the HuggingFace hub on first use and is
// then served from the browser cache, works offline after that first load.
//
// transformers.js is imported *dynamically* inside getRecognizer(), not at
// module top level: onnxruntime-web can throw during its own module eval under
// some setups, and a static import would let that crash the whole app on boot.
// Lazy-loading isolates any failure to the moment scanning actually runs, where
// ScanView catches it and falls back to demo mode.

type Recognizer = (
  image: string,
  labels: string[],
  opts?: { hypothesis_template?: string },
) => Promise<Array<{ label: string; score: number }>>

let clf: Recognizer | undefined

export async function getRecognizer(): Promise<Recognizer> {
  if (!clf) {
    const { pipeline, env } = await import('@xenova/transformers')
    // Don't look for a local /models path first (default true → noisy 404s).
    env.allowLocalModels = false
    clf = (await pipeline(
      'zero-shot-image-classification',
      'Xenova/clip-vit-base-patch32',
    )) as unknown as Recognizer
  }
  return clf
}

// image = data URL (or any URL RawImage can read). Returns the single best match.
export async function recognize(
  image: string,
  labels: string[],
): Promise<{ label: string; score: number }> {
  const clf = await getRecognizer()
  const out = await clf(image, labels, { hypothesis_template: 'a photo of a {}' })
  // transformers.js returns labels raw (no template prefix) but not guaranteed
  // sorted, sort ourselves and take the top.
  const [top] = [...out].sort((a, b) => b.score - a.score)
  return top
}
