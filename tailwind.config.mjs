/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: '#080b0f',
        surface: '#0d1117',
        border: '#1e2d3d',
        'text-primary': '#c8d6e5',
        accent: '#00ff88',
        'accent-alt': '#00cfff',
        muted: '#4a5568',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
