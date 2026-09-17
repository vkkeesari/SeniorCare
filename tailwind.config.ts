import type { Config } from 'tailwindcss';
const config: Config = { content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}','./src/components/**/*.{js,ts,jsx,tsx,mdx}','./src/app/**/*.{js,ts,jsx,tsx,mdx}'], theme: { extend: { colors: { ink: '#1E293B', sage: '#E8EFE9', cream: '#FAFAFA', amber: '#D99A45', moss: '#527060' }, fontFamily: { sans: ['var(--font-jakarta)'], serif: ['var(--font-display)'] }, boxShadow: { soft: '0 16px 45px rgba(30, 41, 59, .08)' } } }, plugins: [] };
export default config;
