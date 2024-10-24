const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      "tm-gray-light": "#0000001a",
      "tm-white": "#ffffff",
      "tm-black-80": "#2D3E57",
      "tm-danger": "#D9486E",
      "tm-yellow": "#FCB13F",
      "tm-purple": "#C663FF",
      "tm-black-20": "#2d3e5733",
      "tm-theme-text": "#1F2D42",
      "tm-green": "#278F7C",
      "tm-blue": "#4EA4D9",
      "tm-dark-secondary": "#222222",
      "tm-blue-secondary": "#5898C7",
      "tm-orange": "#FFB619",
      "tm-charcoal-blue": "#2D3E57",
      "tm-red": "#D9486E",
      "tm-black-transparent-05": "#0000000d",
      "tm-yellow-transparent": "#edad211a",
      "tm-green-transparent": "#278f7c1a",
      "tm-green-light": "#278f7c33",
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
      boxShadow: {
        custom: "0 0 10px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
