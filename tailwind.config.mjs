/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: '#E8E0CD',
        surface: '#DDD5C0',
        border: '#B8AD94',
        'text-primary': '#3B2322',
        accent: '#261312',
        'accent-alt': '#5E3A2E',
        muted: '#8A7D6B',
      },
      fontFamily: {
        display: ['Charcoal', 'Chicago', 'Geneva', 'Arial', 'sans-serif'],
        mono: ['Monaco', 'Geneva', 'Lucida Console', 'monospace'],
      },
    },
  },
  plugins: [],
};
