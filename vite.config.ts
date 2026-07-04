import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // transformers.js pulls in onnxruntime-web, a webpack/CJS bundle. It must be
  // esbuild-pre-bundled so its CommonJS→ESM interop resolves — do NOT exclude it
  // from optimizeDeps (excluding serves it raw and breaks `registerBackend`).
  optimizeDeps: { include: ['@xenova/transformers'] },
})
