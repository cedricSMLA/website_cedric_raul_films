/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Jost Variable"', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
        serif: ['Chiffres', 'Marcellus', 'Georgia', '"Times New Roman"', 'serif']
      },
      colors: {
        // Palette « Sauge profonde ». Les mêmes valeurs existent en variables
        // CSS dans src/styles/global.css : modifier les deux ensemble.
        ivoire: '#F5F2EA',
        sable: '#EBE7DB',
        ligne: '#D6D3C6',
        encre: '#1C211D',
        mousse: '#586058',
        foret: '#26342B',
        'foret-profond': '#1A251E',
        cuivre: '#A0562F',
        'cuivre-clair': '#DBA27C',
        sauge: '#A9B8A0'
      }
    }
  },
  plugins: []
};
