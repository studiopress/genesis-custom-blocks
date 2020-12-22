const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    content: [
      './js/src/edit-block/components/*.js',
      './js/src/edit-block/components/settings/*.js',
    ],
  },
  darkMode: false,
  theme: {
    colors: {
      blue: colors.lightBlue,
      red: colors.red,
      gray: colors.trueGray,
      black: colors.black,
      white: colors.white,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
