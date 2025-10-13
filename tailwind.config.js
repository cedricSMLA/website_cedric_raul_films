/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ]
      },
      colors: {
        // Palette moody vert-sauge & doré désaturé
        'sauge': '#A3B18A',
        'lin': '#FAFAF8',
        'pierre': '#5E5B55',
        'noir-doux': '#1C1A19',
        'doré-patiné': '#C2A56B',
        // Variations pour plus de flexibilité
        'sauge-light': '#B8C4A5',
        'sauge-dark': '#8A9A73',
        'lin-dark': '#D4CFC1',
        'pierre-light': '#7A766F',
        'doré-light': '#D4B87E'
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(28, 26, 25, 0.08)',
        'cinema': '0 4px 16px rgba(28, 26, 25, 0.12), 0 2px 6px rgba(28, 26, 25, 0.08)',
        'strong': '0 8px 32px rgba(28, 26, 25, 0.16), 0 4px 12px rgba(28, 26, 25, 0.12)'
      },
      backgroundColor: {
        'primary': '#FAFAF8',
        'secondary': '#A3B18A',
        'dark': '#1C1A19'
      },
      textColor: {
        'primary': '#5E5B55',
        'secondary': '#A3B18A',
        'accent': '#C2A56B',
        'light': '#E9E5DA'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'hover-scale': 'hoverScale 0.2s ease-in-out',
        'grain': 'grain 8s steps(10) infinite',
        'line-reveal': 'lineReveal 1.2s ease-out 1s both'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        hoverScale: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' }
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -5%)' },
          '20%': { transform: 'translate(-10%, 5%)' },
          '30%': { transform: 'translate(5%, -10%)' },
          '40%': { transform: 'translate(-5%, 15%)' },
          '50%': { transform: 'translate(-10%, 5%)' },
          '60%': { transform: 'translate(15%, 0%)' },
          '70%': { transform: 'translate(0%, 15%)' },
          '80%': { transform: 'translate(-15%, 10%)' },
          '90%': { transform: 'translate(10%, 5%)' }
        },
        lineReveal: {
          '0%': { opacity: '0', transform: 'scaleX(0)' },
          '100%': { opacity: '1', transform: 'scaleX(1)' }
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      }
    }
  },
  plugins: []
};