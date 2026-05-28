/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F1117",
        surface: {
          light: "#FFFFFF",
          dark: "#1E2435",
          ink: "#141722",
        },
        primary: {
          DEFAULT: "#1A2035",
          hover: "#262E4A",
        },
        accent: {
          DEFAULT: "#E8A838",
          hover: "#F0B855",
        },
        muted: "#8A8FA3",
        border: "#2E354F",
        success: "#2DB87A",
        danger: "#E84040",
        status: {
          pending: "#E8A838",
          processing: "#3B82F6",
          completed: "#2DB87A",
          cancelled: "#E84040"
        }
      },
      fontFamily: {
        serif: ["'Fraunces'", "Georgia", "serif"],
        sans: ["'Sora'", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'IBM Plex Mono'", "SFMono-Regular", "Consolas", "monospace"],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'pulse-subtle': 'pulseSubtle 2s infinite ease-in-out',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.01)' },
        }
      }
    },
  },
  plugins: [],
}
