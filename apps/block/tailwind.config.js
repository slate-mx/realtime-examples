const { fontFamily } = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')
const { tailwindcssOriginSafelist } = require('@headlessui-float/react')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    ...tailwindcssOriginSafelist,
    {
      pattern:
        /(bg|text|stroke|fill|border|ring)-(neutral|primary|secondary|red|yellow|green|blue|purple|pink|success|warning|error)-(50|100|200|300|400|500|600|700|800|900)/,
    },
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
        display: ['var(--font-inter)', ...fontFamily.sans],
        mono: ['Source Code Pro', 'monospace'],
      },
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',

      neutral: colors.slate,

      primary: '#EC4899',
      secondary: '#14B8A6',

      red: colors.red,
      yellow: colors.yellow,
      green: colors.green,
      blue: colors.blue,
      purple: colors.purple,
      pink: colors.pink,

      success: colors.green,
      warning: colors.yellow,
      error: colors.red,

      black: colors.black,
      white: colors.white,
    },
  },
  plugins: [require('@headlessui/tailwindcss')],
}
