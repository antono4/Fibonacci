import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'oh-bg': '#0F111A',
        'oh-panel': '#1E2127',
        'oh-surface': '#282C34',
        'oh-border': '#323844',
        'oh-hover': '#2C313A',
        'oh-text': '#ABB2BF',
        'oh-text-bright': '#E6E6E6',
        'oh-accent': '#528BFF',
        'oh-success': '#98C379',
        'oh-warning': '#E5C07B',
        'oh-error': '#E06C75',
        'oh-info': '#61AFEF',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slideIn 0.2s ease-out',
        'fade-in': 'fadeIn 0.15s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
export default config
