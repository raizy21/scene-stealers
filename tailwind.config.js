/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primaryColor: "#123456",
        secondaryColor: "#123456",
        accentColor: "#123456",
        backgroundColor: "#123456",
        textColor: "#123456",
      },
      fontFamily: {
        sans: ["Ubuntu", "system-ui"],
      },
    },
  },
  plugins: [],
};
