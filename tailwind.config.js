/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#f4faed',
        'bg-2': '#f0fae6',
        ink: '#090f05',
        cyan: '#3f7308', // ponytail: vecchio nome, ora è il moss di spade
        moss: '#3f7308',
        forest: '#18280e',
        lemongrass: '#b2eb76',
        line: '#d8e5ca',
        'line-2': '#b3c5a0',
        glass: '#ffffff',
        'glass-2': '#eaf6dc',
        muted: 'rgba(9,15,5,0.60)',
        'muted-2': 'rgba(9,15,5,0.40)',
      },
      fontFamily: {
        sans: ['Urbanist', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        card: '12px',
        inner: '8px',
        pill: '100px',
      },
      backdropBlur: {
        glass: '14px',
      },
    },
  },
  plugins: [],
}
