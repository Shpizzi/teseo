/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a2342',
        'bg-2': '#0c2a52',
        ink: '#eaf4fb',
        cyan: '#AFE3F9',
        line: 'rgba(174,227,249,0.28)',
        'line-2': 'rgba(174,227,249,0.50)',
        glass: 'rgba(255,255,255,0.055)',
        'glass-2': 'rgba(255,255,255,0.10)',
        muted: 'rgba(234,244,251,0.68)',
        'muted-2': 'rgba(234,244,251,0.45)',
      },
      fontFamily: {
        sans: ['Urbanist', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        card: '18px',
        inner: '13px',
        pill: '100px',
      },
      backdropBlur: {
        glass: '14px',
      },
    },
  },
  plugins: [],
}
