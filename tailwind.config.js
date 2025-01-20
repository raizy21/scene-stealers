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
      screens: {
        sm: "640px",
        // => @media (min-width: 640px) { ... }

        tablet: "768px",
        // => @media (min-width: 	768px) { ... }

        miniLaptop: "900px",
        // => @media (min-width: 900px) { ... }

        laptop: "1024px",
        // => @media (min-width: 1024px) { ... }

        desktop: "1280px",
        // => @media (min-width: 1280px) { ... }
      },
    },
  },
  plugins: [],
};
