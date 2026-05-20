import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#534AB7',
          light: '#EEEDFE',
          dark: '#26215C',
        },
        surface: {
          DEFAULT: '#F8F7F2',
          card: '#FFFFFF',
        },
      },
    },
  },
  plugins: [],
}

export default config
