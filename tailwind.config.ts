import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#FAFBFC',
        ink: '#10223B',
        crimson: '#C83A3A',
        audit: '#1F6B3A',
        folder: '#F2E8D5',
        folderLine: '#AFA38F',
        grid: '#C7D0DA',
      },
      fontFamily: {
        ledger: [
          'JetBrains Mono',
          'SFMono-Regular',
          'Consolas',
          'Liberation Mono',
          'Menlo',
          'monospace',
        ],
        display: ['Inter', 'Arial', 'Helvetica', 'sans-serif'],
      },
      boxShadow: {
        terminal: '0 15px 38px rgba(16, 34, 59, 0.085)',
        insetLine: 'inset 0 1px 0 rgba(255,255,255,0.75)',
      },
    },
  },
  plugins: [],
} satisfies Config;
