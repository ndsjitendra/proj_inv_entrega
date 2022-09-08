module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  mode: 'jit',
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  purge: {
    enabled: true,
    content: ['./src/**/*.{html,ts}']
  },
  plugins: [],
}
