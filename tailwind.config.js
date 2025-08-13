module.exports = {
  content: [
    "./apps/**/*.{js,jsx}",
    "./packages/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        bg: "var(--color-bg)"
      },
      borderRadius: {
        xl: "1rem",
        '2xl': "1.5rem"
      }
    }
  },
  plugins: []
};
