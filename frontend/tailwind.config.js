/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary": "#002045",
        "on-primary": "#ffffff",
        "background": "#f5faff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#eff4f9",
        "surface-container": "#e9eef3",
        "surface-variant": "#dee3e8",
        "on-surface": "#171c20",
        "on-surface-variant": "#43474e",
        "secondary": "#006d3c",
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "outline-variant": "#c4c6cf",
      },
      spacing: {
        "xs": "4px",
        "sm": "8px",
        "md": "16px",
        "lg": "24px",
        "xl": "32px",
      },
    },
  },
  plugins: [],
}