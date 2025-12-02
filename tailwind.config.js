module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      // Custom colors inspired by the Quizlet screenshots
      colors: {
        "app-bg": "#050720", // deep navy background
        "app-bg-soft": "#050b2c",
        "nav-bg": "rgba(3, 7, 18, 0.9)",

        "card-bg": "#101631",
        "card-bg-alt": "#151b3a",

        "accent-primary": "#6366f1", // indigo
        "accent-secondary": "#22c55e", // teal/green
        "accent-gold": "#facc15", // yellow sun
        "accent-chip": "#1f2937",

        "text-main": "#e5e7eb",
        "text-muted": "#9ca3af",
      },

      fontFamily: {
        // Default sans font for the whole app
        sans: ["Inter", "system-ui", "sans-serif"],
      },

      boxShadow: {
        "card-glow": "0 24px 60px rgba(15, 23, 42, 0.85)",
        "pill-soft": "0 0 0 1px rgba(148, 163, 184, 0.5)",
      },

      borderRadius: {
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
