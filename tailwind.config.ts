import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        forest: '#F4F0E7',
        gold: '#C3A46F',
        ivory: '#304E43',
        sage: '#878E7A',
        espresso: '#3A3530',
        ink: '#3A3530',
        cream: '#304E43',
        amber: '#C3A46F',
        moss: '#F4F0E7',
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
      boxShadow: {
        soft: '0 20px 55px rgba(58, 53, 48, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
