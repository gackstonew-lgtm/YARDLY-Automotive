/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yardly: {
          bg: "#001A13",           // Primary page background (Very dark forest green)
          bgDark: "#00140F",       // Deepest dark green
          bgCard: "#002B1F",       // Deep forest card background
          bgElevated: "#003D2D",   // Elevated surface / hover surface
          forestLight: "#004D39",  // Subtle forest container surface
          primary: "#00E878",      // Primary Emerald accent (Buttons, active states, key icons)
          primaryHover: "#55FF78", // Luminous green hover accent
          primaryDark: "#00B85E",  // Deep emerald
          accent: "#55FF78",       // Secondary luminous accent
          highlight: "#B7F7A0",    // Soft natural green highlight
          text: "#F2F7F3",         // Primary text (Warm off-white)
          muted: "#8EA79C",        // Secondary text (Muted green-gray)
          mutedDark: "#5B7569",    // Subdued metadata text
          border: "rgba(180, 255, 210, 0.12)", // Subtle translucent green border
          borderGlow: "rgba(0, 232, 120, 0.3)", // Glowing emerald border
          success: "#00E878",
          warning: "#F59E0B",
          danger: "#EF4444",
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 20, 15, 0.4)',
        'glass-hover': '0 16px 40px -8px rgba(0, 232, 120, 0.12), 0 8px 24px -4px rgba(0, 20, 15, 0.6)',
        'floating': '0 20px 40px -15px rgba(0, 20, 15, 0.7)',
        'glow': '0 0 25px rgba(0, 232, 120, 0.25)',
        'glow-lg': '0 0 40px rgba(0, 232, 120, 0.35)',
        'emerald-btn': '0 4px 20px rgba(0, 232, 120, 0.25)',
      },
      backgroundImage: {
        'unitpay-hero': 'linear-gradient(135deg, #001A13 0%, #002B1F 50%, #003D2D 100%)',
        'forest-gradient': 'linear-gradient(180deg, #001A13 0%, #002B1F 100%)',
        'emerald-gradient': 'linear-gradient(135deg, #00E878 0%, #55FF78 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(0, 43, 31, 0.85) 0%, rgba(0, 26, 19, 0.95) 100%)',
      }
    },
  },
  plugins: [],
}
