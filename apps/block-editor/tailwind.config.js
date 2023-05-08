/* eslint-disable @typescript-eslint/no-var-requires */
// const tailwindConfig = require('./src/tailwind.config')

// module.exports = tailwindConfig

// TODO: Theses lines above were used in order to be able to import from the config, we moved the file inside src, maybe not needed anymore

/** @type {import('tailwindcss').Config} */

/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require('tailwindcss/colors')

const { tailwindcssOriginSafelist } = require('@headlessui-float/react')

const { fontFamily } = require('tailwindcss/defaultTheme')

// TODO: Name the colors a bit more functionally instead of their actual names so that they can be replaced via themes later.
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
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
        sans: ['Nunito', ...fontFamily.sans],
        body: ['Nunito', ...fontFamily.sans],
        mono: ['Source Code Pro', 'monospace'],
        display: ['Nunito', ...fontFamily.sans],
      },
      animation: {
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
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

// This file is in src and is extended in global because theme utils cannot have access to things outside of src
// If we don't need that any time, then move this to the root tailwind config instead and delete this one.
