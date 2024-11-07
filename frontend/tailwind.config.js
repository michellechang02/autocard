const {nextui} = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}", // Include pages directory
    "./components/**/*.{js,ts,jsx,tsx}", // Include components directory
    "./app/**/*.{js,ts,jsx,tsx}", // Include app directory (if using App Router in Next.js 13+)
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}", // Include NextUI themes
    "./node_modules/@nextui-org/react/**/*.{js,ts,jsx,tsx}", // Include NextUI components
  ],
  theme: {
    extend: {
      rotate: {
        'y-180': '180deg',
      },
      perspective: {
        '1000': '1000px',
      },
      transformStyle: {
        '3d': 'preserve-3d',
      },
      backfaceVisibility: {
        hidden: 'hidden',
      },
    },
  },
  variants: {
    extend: {
      transform: ['responsive', 'hover', 'focus'],
      perspective: ['responsive', 'hover', 'focus'],
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}

