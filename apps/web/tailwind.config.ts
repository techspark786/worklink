import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        // Burnt Coffee & Espresso Palette (Replacing cold Navy with Warm Rich Coffee)
        navy: {
          950: '#100906', // deepest burnt coffee bean
          900: '#180F0B', // rich roasted espresso
          850: '#20140F', // dark roast coffee
          800: '#2A1A14', // burnt coffee
          700: '#3D271E', // warm roast border
          600: '#523529', // medium coffee roast
          500: '#6C4837', // mocha
          400: '#8A5D48', // latte foam
          300: '#AA755C', // caramel
          200: '#C99379', // light cinnamon
          100: '#E6BC9E', // almond cream
          50: '#F8E9DD',
        },
        espresso: {
          950: '#0C0604', // charcoal roast
          900: '#140A07', // burnt espresso
          850: '#1A0E0A', // dark roast
          800: '#23140E', // roasted bean
          700: '#351F16', // espresso crema
          600: '#4A2C20', // cafe noir
          500: '#643C2C', // warm coffee
        },
        coffee: {
          950: '#100906',
          900: '#180F0B',
          850: '#20140F',
          800: '#2A1A14',
          700: '#3D271E',
          600: '#523529',
          500: '#6C4837',
          400: '#8A5D48',
          300: '#AA755C',
          200: '#C99379',
          100: '#E6BC9E',
          50: '#F8E9DD',
        },
        rose: {
          50: '#FDF2F4',
          100: '#FCE7EC',
          200: '#F9D0DC',
          300: '#F4AEC0',
          400: '#E08DA4',
          500: '#D97793',
          600: '#C4677E',
          700: '#9E495D',
          800: '#7E3647',
          900: '#5F2634',
        },
        cream: {
          50: '#FDFBF7',
          100: '#F8F4EE',
          200: '#EFE8DE',
          300: '#E2D7C7',
          400: '#C7B8A1',
        },
        champagne: {
          100: '#FAF4E8',
          200: '#F5E5C9',
          300: '#EED6A8',
          400: '#E6C987',
          500: '#D4AF37',
          600: '#C5A059',
          700: '#947535',
          800: '#6C5424',
        },
        coop: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        brand: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        }
      },
      boxShadow: {
        'glow-rose': '0 0 25px -5px rgba(224, 141, 164, 0.4)',
        'glow-champagne': '0 0 25px -5px rgba(230, 201, 135, 0.35)',
        'glow-coffee': '0 0 35px -5px rgba(42, 26, 20, 0.8)',
        'luxury-card': '0 20px 40px -15px rgba(0, 0, 0, 0.4), 0 0 1px 1px rgba(230, 201, 135, 0.1)',
        'luxury-hover': '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 25px rgba(224, 141, 164, 0.25)',
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-delayed': 'float 9s ease-in-out 3s infinite',
        'float-reverse': 'floatReverse 10s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(1.5deg)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(14px) rotate(-1.5deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
