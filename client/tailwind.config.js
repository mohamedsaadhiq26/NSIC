/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neo: {
          bg: '#F4F4F0',
          yellow: '#FFE600',   // Highlighter Yellow
          orange: '#FF5C00',   // Safety Orange
          cyan: '#00F0FF',     // Electric Cyan
          pink: '#FF48B0',     // Hot Pink
          lime: '#CCFF00',     // Acid Lime
          green: '#00FF66',    // Mint Green
          black: '#000000',
          dark: '#121212',
          cream: '#F4F4F0',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['Space Mono', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px #000000',
        'neo-sm': '2px 2px 0px 0px #000000',
        'neo-md': '3px 3px 0px 0px #000000',
        'neo-lg': '6px 6px 0px 0px #000000',
        'neo-xl': '8px 8px 0px 0px #000000',
        'neo-2xl': '12px 12px 0px 0px #000000',
        'neo-yellow': '4px 4px 0px 0px #FFE600',
        'neo-orange': '4px 4px 0px 0px #FF5C00',
        'neo-cyan': '4px 4px 0px 0px #00F0FF',
      }
    },
  },
  plugins: [],
}
