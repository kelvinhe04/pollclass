/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brutal: {
          bg: '#F5F5F0',
          surface: '#FFFFFF',
          text: '#1A1A1A',
          textMuted: '#666666',
          border: '#1A1A1A',
          accent: '#FF5722',
          success: '#4CAF50',
          danger: '#E53935',
          warning: '#FFC107',
          code: '#2962FF',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        brutal: '6px 6px 0px 0px #1A1A1A',
        brutalSm: '3px 3px 0px 0px #1A1A1A',
        brutalMd: '4px 4px 0px 0px #1A1A1A',
      },
      borderRadius: {
        none: '0px',
      },
      borderWidth: {
        DEFAULT: '2px',
        3: '3px',
        4: '4px',
      }
    },
  },
  plugins: [],
}