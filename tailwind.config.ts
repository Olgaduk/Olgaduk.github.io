import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontSize: {
        "12": "12px",
        "14": "14px",
        "16": "16px",
        "18": "18px",
        "20": "20px",
        "24": "24px",
        "32": "32px",
        "40": "40px",
        "48": "48px",
        "56": "56px",
        "64": "64px",
      },
      colors: {
        grey: {
          1: "#FFFFFF",
          2: "#F5F5F5",
          3: "#E5E5E5",
          4: "#D4D4D4",
          5: "#C4C4C4",
          6: "#B3B3B3",
          7: "#A2A2A2",
          8: "#919191",
          9: "#808080",
          10: "#666666",
          11: "#5E5E5E",
        },
      },
    },
  },
  plugins: [],
};

export default config;
