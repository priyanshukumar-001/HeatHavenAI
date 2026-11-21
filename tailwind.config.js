/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: 'var(--paper)',
          2: 'var(--paper-2)'
        },
        card: 'var(--card, #FFFFFF)',
        line: {
          DEFAULT: 'var(--line, #E2E8F0)',
          strong: 'var(--line-strong, #CBD5E1)'
        },
        ink: {
          DEFAULT: 'var(--ink, #0F172A)',
          2: 'var(--ink-2, #475569)',
          3: 'var(--ink-3, #94A3B8)'
        },
        pani: {
          DEFAULT: 'var(--pani)',
          soft: 'var(--pani-soft)',
          strong: 'var(--blue-strong)'
        },
        chhaon: {
          DEFAULT: 'var(--chhaon)',
          soft: 'var(--chhaon-soft)',
          text: 'var(--green-text)'
        },
        aaram: {
          DEFAULT: 'var(--aaram)',
          soft: 'var(--aaram-soft)'
        },
        loo: {
          DEFAULT: 'var(--loo)',
          soft: 'var(--loo-soft)'
        },
        angaar: 'var(--angaar)',
        sun: 'var(--sun)',
        cool: 'var(--cool)',
        night: {
          DEFAULT: 'var(--night)',
          2: 'var(--night-2)',
          card: 'var(--night-card)',
          line: 'var(--night-line)',
          ember: 'var(--ember)',
          text: 'var(--on-night)',
          muted: 'var(--on-night-muted)'
        },
        blue: {
          DEFAULT: 'var(--blue)',
          light: 'var(--blue-light)',
          'light-2': 'var(--blue-light-2)',
          strong: 'var(--blue-strong)'
        },
        red: {
          DEFAULT: 'var(--red)',
          light: 'var(--red-light)',
          'light-2': 'var(--red-light-2)',
          text: 'var(--red-text)'
        },
        yellow: {
          DEFAULT: 'var(--yellow)',
          light: 'var(--yellow-light)',
          'light-2': 'var(--yellow-light-2)',
        },
        green: {
          DEFAULT: 'var(--green)',
          light: 'var(--green-light)',
          'light-2': 'var(--green-light-2)',
          text: 'var(--green-text)'
        },
        amber: {
          text: 'var(--amber-text)'
        },
        surface: {
          text: 'var(--text)',
          secondary: 'var(--text-secondary)',
          border: 'var(--border)',
          'border-strong': 'var(--border-strong)',
          light: 'var(--bg-light)',
          outer: 'var(--bg-outer)',
          chip: 'var(--chip-bg)',
          muted: 'var(--muted)'
        },
        terminal: {
          bg: 'var(--terminal-bg)',
          code: 'var(--code-bg)',
          line: 'var(--dark-line)',
          blue: 'var(--on-dark-blue)',
          yellow: 'var(--on-dark-yellow)',
          green: 'var(--on-dark-green)',
          red: 'var(--on-dark-red)'
        }
      },
      fontFamily: {
        display: ['"Bricolage Grotesque Variable"', '"Bricolage Grotesque"', 'sans-serif'],
        sans: ['"Mukta"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        pill: 'var(--radius-pill)'
      },
      boxShadow: {
        1: 'var(--shadow-1)',
        2: 'var(--shadow-2)',
        'glow-pani': 'var(--shadow-glow-pani)',
        'glow-loo': 'var(--shadow-glow-loo)'
      }
    },
  },
  plugins: [],
}
